

from model.models import RawIdeas
import os
from datetime import datetime
from fastapi import APIRouter, Query
from model.databases import AsyncSessionLocal, get_db
import model.databases
from sqlalchemy import and_
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from langchain.llms import LlamaCpp
from langchain.schema import Document
from langchain.vectorstores import DocArrayInMemorySearch
from fastapi import Depends
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from model.models import RawIdeas
app = APIRouter()

current_directory = os.path.dirname(os.path.abspath(__file__))


@app.get("/getAudioTranscriptionsAndSend/")
async def get_audio_transcriptions_and_send(timestamps: str, question: str, memory_id: int = Query(None), db: AsyncSession = Depends(get_db)):
    timestamps_int = [int(t) for t in timestamps.split(",")]
    formatted_data = []

    async with db as session:
        for timestamp in timestamps_int:
            raw_ideas_stmt = select(RawIdeas).filter(RawIdeas.start_timestamp == timestamp)

            if memory_id is not None:
                raw_ideas_stmt = raw_ideas_stmt.filter(RawIdeas.memory_id == memory_id)

            result = await session.execute(raw_ideas_stmt)
            raw_idea = result.scalars().first()

            if raw_idea is not None:
                content = raw_idea.content
                human_readable_timestamp = datetime.fromtimestamp(timestamp).strftime('%B %d, %Y %H:%M')


                content = raw_idea.content
                while len(content) > 6000:
                    break_point = content.rfind(" ", 0, 6000)
                    if break_point == -1: 
                        break_point = 6000
                    
                    formatted_line = f"Memory at {human_readable_timestamp}\nIdea: {content[:break_point]}\n"
                    formatted_data.append(formatted_line)
                    content = content[break_point:].lstrip()

                formatted_line = f"Memory at {human_readable_timestamp}\nIdea: {content}\n"
                formatted_data.append(formatted_line)

    documents = [Document(page_content=s) for s in formatted_data]

    dataframe = DocArrayInMemorySearch.from_documents(
        documents,
        model.databases.embedding_function
    )

    retriever = dataframe.as_retriever(search_kwargs={"k": 5})

    question_prompt = """Your task is to extract and utilize relevant information from provided audio transcriptions to answer the user's question.
Keep in mind:
1. The source of the audio, as it provides important context.
2. Possible errors or inaccuracies in the transcriptions due to the transcription process.
3. Use direct quotes from the transcriptions when relevant.
4. If no pertinent information is available in the transcriptions, respond with "None".<|end_of_turn|>GPT4 User: Question: What was the topic of our discussion related to technology?
Audio Transcriptions:
[Memory at October 31, 2023 01:39] Audio from microphone: I think the future of AI is fascinating, especially in healthcare.
Audio from microphone: Did you hear about the new blockchain project? It's quite revolutionary.
Audio from microphone: Let's discuss the latest trends in full stack development next time."
Audio from microphone: I'm really interested in the ethical implications of AI.<|end_of_turn|>GPT4 Assistant: Your discussion covered several technology-related topics, including the future of AI in healthcare, a new blockchain project, and trends in full stack development. There was also a mention of the ethical implications of AI.<|end_of_turn|>GPT4 User: Question: Can you summarize our conversation about web development tools?
Audio Transcriptions:
[Memory at November 02, 2023 10:15] Audio from microphone: "I find the use of Python in data analysis quite impressive."
Audio from microphone: "React is a powerful tool for front-end development, isn't it?"
Audio from microphone: "Have you explored using TailwindCSS for styling? It's quite efficient."
Audio from microphone: "Node.js has really changed the landscape of backend development."<|end_of_turn|>GPT4 Assistant: In your conversation about web development tools, Python was mentioned in the context of data analysis, React as a tool for front-end development, the efficiency of TailwindCSS for styling, and the impact of Node.js on backend development.<|end_of_turn|>GPT4 User: Question: Do que falamos sobre inovações tecnológicas recentemente?
Audio Transcriptions:
[Memória em 03 de Novembro de 2023 14:22] Áudio do microfone: A inteligência artificial pode realmente transformar a maneira como interagimos com dispositivos.
Áudio do microfone: Você viu o último projeto de blockchain? Parece promissor.
Áudio do microfone: O desenvolvimento full stack está se tornando cada vez mais integrado.
Áudio do microfone: Estilos com TailwindCSS parecem mais limpos e organizados.<|end_of_turn|>GPT4 Assistant: Na conversa recente, vocês falaram sobre como a inteligência artificial pode transformar a interação com dispositivos, um projeto de blockchain promissor, a integração no desenvolvimento full stack, e a organização e limpeza dos estilos com TailwindCSS.<|end_of_turn|>GPT4 User: Question: {question}
Audio Transcriptions:
{context}<|end_of_turn|>GPT4 Assistant:"""

    combine_prompt = """Your role is to comprehensively answer the user's question using information from the provided summaries of audio transcriptions, each summary will be separated by a line break. Ensure to:
1. Direct Relevance: Prioritize summaries that directly mention details relevant to the user's question. Disregard summaries that explicitly state the absence of relevant information.
2. Specific Extraction: Extract and focus on key information or direct mentions from the summaries that are directly relevant to the question.
3. Clear and Concise Response: Formulate a response that is clear, concise, and focused solely on the information extracted from the relevant summaries.
4. Acknowledgement of Absence: If none of the provided summaries contain information relevant to the user's question, clearly state that the answer to the question is not available in the provided summaries.
5. Avoid Redundancy: Do not repeat statements about the absence of relevant information across multiple summaries. Focus only on the content that provides a direct answer.
<|end_of_turn|>GPT4 User: Question: How has the perception of remote work changed over time?
Summaries:
 None

 The provided audio transcriptions do not address the evolution of attitudes towards remote work.

 Initial skepticism about productivity in remote settings, citing home distractions.

 Shift in perception towards valuing work-life balance and increased employee satisfaction with remote work.

 Lack of mention in several transcripts about the evolution of remote work perceptions.

 Technological advancements have made remote work more feasible and efficient.

 None

 None
 
 None<|end_of_turn|>GPT4 Assistant: The perception of remote work has shifted over time. Initially, there was skepticism about productivity, mainly due to potential distractions at home. This perception changed, with a growing appreciation for the work-life balance that remote work offers, leading to increased employee satisfaction. Additionally, recent advancements in technology have made remote work more feasible and efficient.
<|end_of_turn|>GPT4 User: Question: What are the key factors contributing to urban pollution?
Summaries:
 No discussion on urban pollution contributors in several transcriptions.

 None

 High vehicle emissions in populated areas identified as a major pollution source.

 Industrial activities in and around urban areas contributing to air and water pollution.

 The audio transcriptions discusses the impact of poor waste management in cities, contributing significantly to both land and water pollution.

 Absence of explicit mention of urban pollution factors in some transcripts.

 None

 None<|end_of_turn|>GPT4 Assistant: Key factors contributing to urban pollution include high vehicle emissions in densely populated areas, industrial activities in and around urban areas affecting air and water quality, and poor waste management practices leading to land and water pollution.
<|end_of_turn|>GPT4 User: Question: What are the trends in global dietary habits?
Summaries:
 None

 No information on global dietary trends in several transcriptions.

 Preference for high-calorie, processed foods linked to rising obesity rates.

 Increased demand for organic and plant-based foods due to growing health awareness.

 Innovations like lab-grown meat and AI-driven nutrition plans emerging in food-tech.",

 Lack of specific details on dietary trends in some audio transcriptions.

 None<|end_of_turn|>GPT4 Assistant: Global dietary habits are showing a trend towards high-calorie, processed foods, contributing to rising obesity rates. Concurrently, there's an increased demand for healthier options like organic and plant-based foods. Innovations in food technology, such as lab-grown meat and AI-driven personalized nutrition plans, are also gaining traction.
<|end_of_turn|>GPT4 User: Question: {question}
Summaries:
{summaries}<|end_of_turn|>GPT4 Assistant:"""


    question_prompt_template = PromptTemplate(
        template=question_prompt, input_variables=["context", "question"])

    combine_prompt_template = PromptTemplate(
        template=combine_prompt, input_variables=["summaries", "question"])

    n_gpu_layers = 512
    n_batch = 1024

    llm = LlamaCpp(
        model_path="../llm_api/model/model.gguf",
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

    return result.replace("\n ", "\n")