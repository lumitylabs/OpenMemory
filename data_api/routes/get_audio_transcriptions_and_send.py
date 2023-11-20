

from models import AudioTranscriptions, RawIdeas
import os
from datetime import datetime
import textwrap
import requests
from io import StringIO
from .tokenizer import ExLlamaTokenizer
from fastapi import APIRouter
from databases import db, embedding_function
from sqlalchemy import and_
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from langchain.llms import LlamaCpp
from langchain.schema import Document
from langchain.vectorstores import DocArrayInMemorySearch
from langchain.chains.question_answering import load_qa_chain

app = APIRouter()

current_directory = os.path.dirname(os.path.abspath(__file__))
template_path = os.path.join(current_directory, "prompt_template.txt")
tokenizer_path = os.path.join(current_directory, "tokenizer.model")
tokenizer = ExLlamaTokenizer(tokenizer_path)

prompt_template = ""
with open(template_path, 'r') as file:
    prompt_template = file.read()


@app.get("/getAudioTranscriptionsAndSend/")
async def get_audio_transcriptions_and_send(timestamps: str, question: str):
    timestamps_int = [int(t) for t in timestamps.split(",")]

    formatted_data = []

    for timestamp in timestamps_int:
        # Busca registros na tabela RawIdeas com start_timestamp igual ao timestamp atual
        raw_idea = db.query(RawIdeas.content).filter(
            RawIdeas.start_timestamp == timestamp
        ).first()

        if raw_idea is not None:
            human_readable_timestamp = datetime.fromtimestamp(
                timestamp).strftime('%B %d, %Y %H:%M')

            # Formata e adiciona o conteúdo à lista de dados formatados
            content = raw_idea.content
            while len(content) > 6000:
                # Encontra um ponto seguro para quebrar o texto
                break_point = content.rfind(" ", 0, 6000)
                if break_point == -1: # Não encontrou um espaço, usa o limite
                    break_point = 6000

                # Adiciona a parte do texto até o ponto de quebra
                formatted_line = f"Memory at {human_readable_timestamp}\nIdea: {content[:break_point]}\n"
                formatted_data.append(formatted_line)

                # Resto do texto para a próxima iteração
                content = content[break_point:].lstrip()

            # Adiciona o texto restante
            formatted_line = f"Memory at {human_readable_timestamp}\nIdea: {content}\n"
            formatted_data.append(formatted_line)

    documents = [Document(page_content=s) for s in formatted_data]

    dataframe = DocArrayInMemorySearch.from_documents(
        documents,
        embedding_function
    )

    # docs = dataframe.similarity_search(question)
    # len(docs)
    # print(docs)
    retriever = dataframe.as_retriever(search_kwargs={"k": 5})

    question_prompt = """### System:
Your task is to extract and utilize relevant information from provided audio transcriptions to answer the user's question.
Keep in mind:
1. The source of the audio, as it provides important context.
2. Possible errors or inaccuracies in the transcriptions due to the transcription process.
3. Use direct quotes from the transcriptions when relevant.
4. If no pertinent information is available in the transcriptions, respond with "None".
### User:
Question: What was the topic of our discussion related to technology?
Audio Transcriptions:
[Memory at October 31, 2023 01:39] Audio from microphone: I think the future of AI is fascinating, especially in healthcare.
Audio from microphone: Did you hear about the new blockchain project? It's quite revolutionary.
Audio from microphone: Let's discuss the latest trends in full stack development next time."
Audio from microphone: I'm really interested in the ethical implications of AI.
### Assistant:
Your discussion covered several technology-related topics, including the future of AI in healthcare, a new blockchain project, and trends in full stack development. There was also a mention of the ethical implications of AI.
### User:
Question: Can you summarize our conversation about web development tools?
Audio Transcriptions:
[Memory at November 02, 2023 10:15] Audio from microphone: "I find the use of Python in data analysis quite impressive."
Audio from microphone: "React is a powerful tool for front-end development, isn't it?"
Audio from microphone: "Have you explored using TailwindCSS for styling? It's quite efficient."
Audio from microphone: "Node.js has really changed the landscape of backend development."
### Assistant:In your conversation about web development tools, Python was mentioned in the context of data analysis, React as a tool for front-end development, the efficiency of TailwindCSS for styling, and the impact of Node.js on backend development.
### User:
Question: Do que falamos sobre inovações tecnológicas recentemente?
Audio Transcriptions:
[Memória em 03 de Novembro de 2023 14:22] Áudio do microfone: A inteligência artificial pode realmente transformar a maneira como interagimos com dispositivos.
Áudio do microfone: Você viu o último projeto de blockchain? Parece promissor.
Áudio do microfone: O desenvolvimento full stack está se tornando cada vez mais integrado.
Áudio do microfone: Estilos com TailwindCSS parecem mais limpos e organizados.
### Assistant:
Na conversa recente, vocês falaram sobre como a inteligência artificial pode transformar a interação com dispositivos, um projeto de blockchain promissor, a integração no desenvolvimento full stack, e a organização e limpeza dos estilos com TailwindCSS.
### User:
Question: {question}
Audio Transcriptions:
{context}
### Assistant:
"""

    combine_prompt = """### System:
Your role is to comprehensively answer the user's question using information from the provided summaries of audio transcriptions. Be aware of potential inaccuracies in these summaries. When responding:
1. Consider the original audio source for contextual understanding.
2. Acknowledge if the information from the summaries is insufficient.
3. Match your response to the style of the user's question.
4. Begin your response by addressing the following question using the summaries.
### User:
Question: How has the perception of remote work changed over time?
Summaries:
Early transcription indicates skepticism about productivity in remote work settings, with concerns about distractions at home.
A later summary highlights a shift towards appreciation of work-life balance achieved through remote work, citing increased employee satisfaction.
The most recent summary discusses technological advancements, suggesting remote work is now more feasible and efficient due to improved communication tools.
### Assistant:
The perception of remote work has evolved significantly. Initially, there was skepticism about its productivity due to potential home distractions. Over time, this view shifted as people began appreciating the work-life balance that remote work offers, leading to increased employee satisfaction. Recently, advancements in communication technology have further bolstered the feasibility and efficiency of remote work, making it a more practical option.
### User:
Question: What are the key factors contributing to urban pollution?
Summaries:
One transcript identifies high vehicle emissions in densely populated areas as a major source of urban pollution.
Another summary points to industrial activities within and around urban areas, emphasizing their role in air and water pollution.
A recent summary discusses the impact of poor waste management in cities, contributing significantly to both land and water pollution.
### Assistant:
Urban pollution is primarily driven by several factors. High vehicle emissions in densely populated areas contribute significantly to air pollution. Industrial activities, both within and around urban areas, also play a crucial role in polluting air and water. Additionally, poor waste management in cities exacerbates the problem, leading to land and water pollution.
### User:
Question: What are the trends in global dietary habits?
Summaries:
An early summary notes a dominant preference for high-calorie, processed foods in many regions, linked to rising obesity rates.
A subsequent summary indicates a growing awareness of health and nutrition, with an increased demand for organic and plant-based foods.
The latest summary discusses the emergence of 'food-tech' innovations, like lab-grown meat and AI-driven personalized nutrition plans.
### Assistant:
Global dietary habits have undergone noticeable changes. Initially, there was a predominant preference for high-calorie, processed foods, which correlated with increasing obesity rates. However, there's been a shift towards health-conscious eating, with heightened demand for organic and plant-based options. Recently, 'food-tech' innovations, including lab-grown meat and AI-driven personalized nutrition, have started to shape new trends in global diets.
### User:
Question: {question}
Summaries:
{summaries}
### Assistant:
"""


    question_prompt_template = PromptTemplate(
        template=question_prompt, input_variables=["context", "question"])

    combine_prompt_template = PromptTemplate(
        template=combine_prompt, input_variables=["summaries", "question"])

    n_gpu_layers = 512
    n_batch = 1024

    llm = LlamaCpp(
        model_path="../llm_api/model/neural-chat-7b-v3-1.Q4_K_M.gguf",
        n_gpu_layers=n_gpu_layers,
        n_batch=n_batch,
        temperature=0.7,
        top_p=0.1,
        top_k=40,
        n_ctx=4096,
        max_tokens=500,
        verbose=False,
    )
    qa = RetrievalQA.from_chain_type(llm=llm, chain_type="map_reduce", retriever=retriever, chain_type_kwargs={
                                     "question_prompt": question_prompt_template, "combine_prompt": combine_prompt_template})

    result = qa.run(question)
    return result

    # response = requests.post('http://127.0.0.1:8004/inference', data={"data": textwrap.dedent(prompt)})
    # return response.text
