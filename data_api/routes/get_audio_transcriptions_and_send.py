

from models import AudioTranscriptions
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
    # Convertendo os timestamps para float uma única vez.
    timestamps_float = [float(t) for t in timestamps.split(",")]
    min_time = min(timestamps_float) - 30 * 60
    max_time = max(timestamps_float) + 30 * 60
    lines = db.query(AudioTranscriptions.timestamp, AudioTranscriptions.processes, AudioTranscriptions.content).filter(
        and_(
            AudioTranscriptions.timestamp >= min_time,
            AudioTranscriptions.timestamp <= max_time
        )
    ).order_by(AudioTranscriptions.timestamp).all()

    formatted_data = []
    BEFORE_CONTEXT = 5
    AFTER_CONTEXT = 5

    for timestamp in timestamps_float:
        # Encontra o índice da linha que tem o timestamp exato
        idx_base = next((idx for idx, line in enumerate(lines)
                        if line.timestamp == timestamp), None)
        if idx_base is not None:
            # Extrai as linhas de contexto antes e depois
            selected_lines = lines[max(
                0, idx_base - BEFORE_CONTEXT):min(len(lines), idx_base + AFTER_CONTEXT + 1)]
            human_readable_timestamp = datetime.fromtimestamp(
                timestamp).strftime('%B %d, %Y %H:%M')

            # Inicializa o buffer e a contagem de tokens para esta memória
            line_buffer = StringIO()
            line_buffer.write(f"Memory at {human_readable_timestamp}\n")
            current_token_count = 0

            # Adiciona as linhas selecionadas ao buffer, respeitando o limite de tokens
            for line in selected_lines:
                tentative_line = f"\nAudio Source: {line.processes}\nAudio Transcription: {line.content}\n"
                new_token_count = tokenizer.encode(tentative_line).shape[1]
                line_buffer.write(tentative_line)
                current_token_count += new_token_count

            # Adiciona a memória formatada à lista de dados formatados
            formatted_data.append(line_buffer.getvalue())

    documents = [Document(page_content=s) for s in formatted_data]

    dataframe = DocArrayInMemorySearch.from_documents(
        documents,
        embedding_function
    )

    # docs = dataframe.similarity_search(question)
    # len(docs)
    # print(docs)
    retriever = dataframe.as_retriever(search_kwargs={"k": 10})
    print(documents)

    question_prompt = """Your role is to identify and extract relevant phrases or passages from the provided Audio Transcriptions to help answer the user's question.
When doing so:
1. Consider the Audio Source, as this provides context on the origin and nature of the content.
2. Be aware these transcriptions may contain errors or inaccuracies due to the transcription process.
3. Directly quote relevant verbatim text from the transcriptions to support your answer.
4. If no relevant text can be found in the transcriptions, respond with "None".<|end_of_turn|>GPT4 User: question:{question}<|end_of_turn|>Audio transcriptions: {context}<|end_of_turn|>GPT4 Assistant: """

    combine_prompt = """Your role is to answer the user question to the best of your ability, using information from the provided summaries of audio transcriptions. Be aware that these summaries may contain errors or inaccuracies due to the transcription process.
When formulating your answer:
1. Consider the original source of the audio (Audio Source), as this provides context.
2. If the information in the summaries is insufficient to fully answer the question, communicate this limitation clearly to the user.
3. To answer use language that matches the user's question.
4. Start the text answering the following question using the sumaries.<|end_of_turn|>GPT4 User: {question}<|end_of_turn|>summaries: {summaries}<|end_of_turn|>GPT4 Assistant: """

    print(question_prompt)
    print(combine_prompt)

    question_prompt_template = PromptTemplate(
        template=question_prompt, input_variables=["context", "question"])

    combine_prompt_template = PromptTemplate(
        template=combine_prompt, input_variables=["summaries", "question"])

    n_gpu_layers = 50
    n_batch = 2048

    llm = LlamaCpp(
        model_path="../llm_api/model/openchat_3.5.Q5_K_M.gguf",
        n_gpu_layers=n_gpu_layers,
        n_batch=n_batch,
        temperature=0.7,
        top_p=0.1,
        top_k=40,
        n_ctx=4096,
        max_tokens=500,
        verbose=True,
    )
    qa = RetrievalQA.from_chain_type(llm=llm, chain_type="map_reduce", retriever=retriever, chain_type_kwargs={
                                     "question_prompt": question_prompt_template, "combine_prompt": combine_prompt_template})

    result = qa.run(question)
    return result

    # response = requests.post('http://127.0.0.1:8004/inference', data={"data": textwrap.dedent(prompt)})
    # return response.text
