from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import Annotated
from langchain.llms import LlamaCpp
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field, validator
from langchain.prompts import (
    PromptTemplate
)
import time
from typing import Sequence, Optional

from langchain.schema.runnable import RunnableLambda
from langchain.text_splitter import TokenTextSplitter
import os

template = """### User:\n{question}### Assistant:\n"""
prompt = PromptTemplate(template=template, input_variables=["question"])

callback_manager = CallbackManager([StreamingStdOutCallbackHandler()])
n_gpu_layers = 224
n_batch = 512

current_directory = os.path.dirname(os.path.abspath(__file__))
llm_path = os.path.join(
    current_directory, "model/neural-chat-7b-v3-1.Q4_K_M.gguf")

llm = LlamaCpp(
    model_path=llm_path,
    n_gpu_layers=n_gpu_layers,
    n_batch=n_batch,
    temperature=0.5,
    top_p=0.1,
    top_k=20,
    n_ctx=4096,
    max_tokens=500,
    verbose=False, 
)


app = FastAPI()
origins = [
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post('/inference')
def inferContextP(data: Annotated[str, Form()]):

    llm_chain = LLMChain(prompt=prompt, llm=llm, verbose=False)
    # print(data)
    answer = llm_chain.run(data)
    return answer


@app.post('/metadata-summary')
def metadataSummary(data: Annotated[str, Form()]):
    # print(data)

    class Metadata(BaseModel):
        text_title: str = Field(
            description="A descritive title for the user text.")
        summary: str = Field(
            description="A descriptive summary of the user text that explains its content.")
        tags: Sequence[str] = Field(description="Keywords for the user text.")
        essential_reminders: Optional[Sequence[str]] = Field(
            description="Optional list for critical reminders ONLY, such as indispensable dates and pivotal events in natural language format. Otherwise, if not critical DO NOT fill this list.")

    class ExtractedData(BaseModel):
        base_heading: str = Field(
            description="A descritive title for the user text.")
        base_abstract: str = Field(
            description="A descriptive summary of the user text that explains its content.")
        base_labels: Sequence[str] = Field(
            description="Keywords for the user text.")
        base_memos: Optional[Sequence[str]] = Field(
            description="Optional list for critical reminders ONLY, such as indispensable dates and pivotal events in natural language format. Otherwise, if not critical DO NOT fill this list.")

    parser = PydanticOutputParser(pydantic_object=Metadata)
    extract_parser = PydanticOutputParser(pydantic_object=ExtractedData)

    samples = [
        {
            "input": "Audio from Discord: Hey Bob, just a reminder that the project deadline is next Monday, November 14th. Also, the client meeting is scheduled for Wednesday, November 16th at 10 AM. We need to finalize our presentation by this Friday.\nMicrofone: Got it, Alice. I'll have the draft ready by Thursday for review. Also, remember that our team outing is on the 18th.\nAudio from Discord: Perfect, thanks Bob! Let's keep everything on track.",
            "output": "{\"base_heading\": \"Project and Meeting Deadlines with Team Outing Reminder\", \"base_abstract\": \"This conversation between Alice and Bob in a company setting highlights crucial dates for a project deadline, a client meeting, and a team outing. Alice reminds Bob of the need to finalize the presentation by Friday, and Bob acknowledges this with an assurance to have a draft ready by Thursday.\", \"base_labels\": [\"Project Deadline\", \"Client Meeting\", \"Team Outing\", \"Corporate Communication\"], \"base_memos\": [\"Project deadline is on Monday, November 14th\", \"Client meeting scheduled for Wednesday, November 16th at 10 AM\", \"Team outing is on November 18th\"]}"
        },
        {
            "input": "á, Ana, você lembra que temos que entregar o relatório financeiro até a próxima sexta-feira, dia 17?\nMicrofone: Sim, João, eu lembro. Vou finalizar a análise de custos hoje e te envio para revisão.\nAudio from Zoom: Perfeito. E não esqueça da reunião com o diretor na quarta-feira às 14h para discutirmos o orçamento do próximo ano.\nMicrofone: Já está na minha agenda. Obrigada pelo lembrete!",
            "output": "{\"base_heading\": \"Lembretes de Tarefas e Reuniões no Ambiente de Trabalho\", \"base_abstract\": \"Nesta conversa, João lembra Ana da necessidade de entregar o relatório financeiro até sexta-feira. Ana confirma que finalizará a análise de custos e João menciona uma reunião com o diretor na quarta-feira sobre o orçamento do próximo ano.\", \"base_labels\": [\"Relatório Financeiro\", \"Reunião com o Diretor\", \"Análise de Custos\", \"Ambiente de Trabalho\"], \"base_memos\": [\"Entrega do relatório financeiro até sexta-feira, dia 17\", \"Reunião com o diretor na quarta-feira às 14h\"]}"
        },
        {
            "input": "Audio from Brave: Welcome to TechTalk, the podcast where we discuss the latest in technology. Today, we're exploring the world of artificial intelligence.\nAudio from Brave: That's right. AI is transforming industries in remarkable ways, from healthcare to finance.\nAudio from Brave: Absolutely. It's fascinating to see how AI algorithms can analyze data and make predictions that were previously impossible.\nAudio from Brave: Indeed. The potential for innovation is limitless. It's an exciting time for tech enthusiasts.",
            "output": "{\"base_heading\": \"TechTalk Podcast on Artificial Intelligence\", \"base_abstract\": \"In this TechTalk podcast episode, the host and guest delve into the impact of artificial intelligence on various industries. They discuss the capabilities of AI in data analysis and prediction, highlighting the potential for future innovations in the tech field.\", \"base_labels\": [\"Podcast\", \"Artificial Intelligence\", \"Technology Discussion\", \"Industry Transformation\"], \"base_memos\": []}"
        },
        {
            "input": "cuerdas que debemos actualizar el sistema de gestión del cliente antes del 20 de este mes?\nAudio from Discord: Sí, Carlos, lo tengo en cuenta. Hoy trabajaré en la integración de la nueva base de datos.\nMicrofone: Excelente. También, por favor, revisa el informe de errores que nos envió el equipo técnico.\nAudio from Discord: Claro, lo revisaré después de la integración.",
            "output": "{\"base_heading\": \"Recordatorios de Actualización de Sistema y Revisión de Informes\", \"base_abstract\": \"Carlos recuerda a María la necesidad de actualizar el sistema de gestión del cliente antes del 20. María indica que trabajará en la integración de la base de datos y Carlos le pide que revise el informe de errores enviado por el equipo técnico.\", \"base_labels\": [\"Actualización de Sistema\", \"Gestión de Clientes\", \"Integración de Base de Datos\", \"Informe de Errores\"], \"base_memos\": [\"Actualizar el sistema de gestión del cliente antes del 20\"]}"
        },
        {
            "input": "Audio from Skype: Hello, this is Mike from Tech Solutions. I'm calling to confirm our meeting next Tuesday, November 22nd, about the software upgrade.\nMicrofone: Hi Mike, yes, I remember. November 22nd for the software upgrade meeting. Looking forward to it!\nAudio from Skype: Great! We'll send over the agenda by the end of this week. Have a good day!",
            "output": "{\"base_heading\": \"Confirmation Call for Software Upgrade Meeting\", \"base_abstract\": \"Mike from Tech Solutions calls to confirm a meeting regarding a software upgrade scheduled for next Tuesday, November 22nd. The receiver acknowledges the meeting date, and Mike mentions that an agenda will be sent over by the end of the week.\", \"base_labels\": [\"Meeting Confirmation\", \"Software Upgrade\", \"Business Call\"], \"base_memos\": [\"Software upgrade meeting on Tuesday, November 22nd\"]}"
        },

    ]

    samples_combine = [
        {
            "input": "[{\"base_heading\":\"Addressing Sleep Deprivation\",\"base_abstract\":\"The conversation begins with addressing the issue of sleep deprivation and its recognition as a serious health problem.\",\"base_labels\":[\"Sleep Deprivation\",\"Health Issues\"],\"base_memos\":[]},{\"base_heading\":\"Effects of Lack of Sleep\",\"base_abstract\":\"Discussion moves to the physical and mental effects of lack of sleep, highlighting how it impacts overall health and well-being.\",\"base_labels\":[\"Sleep Effects\",\"Physical Health\",\"Mental Health\"],\"base_memos\":[]},{\"base_heading\":\"Prioritizing Adequate Sleep\",\"base_abstract\":\"The conversation concludes with an urgent call to prioritize adequate sleep and a question about how society can better facilitate healthy sleep habits.\",\"base_labels\":[\"Adequate Sleep\",\"Health Prioritization\",\"Sleep Habits\"],\"base_memos\":[\"World Sleep Day on March 19th\",\"Sleep Awareness Week in April\"]}]",
            "output": "{\"text_title\":\"Discussion on Sleep and Health\",\"summary\":\"This conversation series delves into the serious health problem of sleep deprivation, discussing its physical and mental effects and emphasizing the need to prioritize adequate sleep. It raises an important question: How can society better promote healthy sleep habits?\",\"tags\":[\"Sleep Deprivation\",\"Health Effects\",\"Adequate Sleep\"],\"essential_reminders\":[\"World Sleep Day on March 19th\",\"Sleep Awareness Week in April\"]}"
        },
        {
            "input": "[{\"base_heading\": \"Informal Conversation about Data Science and Learning\", \"base_abstract\": \"A group of friends discuss their experiences with data science, learning techniques, and various tools. They mention Gradient Boost, Render Flasher, Light DBA, and other related topics.\", \"base_labels\": [\"Data Science\", \"Learning Techniques\", \"Tools\", \"Informal Conversation\"], \"base_memos\": []}, {\"base_heading\": \"Discussão sobre Compartilhamento de Informações e Colaboração\", \"base_abstract\": \"Nesta conversa informal, os participantes discutem a importância da colaboração entre equipes e o compartilhamento de informações. Eles mencionam que qualquer compartilhamento privado é proibido e que as discussões devem ser públicas.\", \"base_labels\": [\"Colaboração\", \"Informações\", \"Compartilhamento\", \"Desafio\"], \"base_memos\": []}]",
            "output": "{\"text_title\":\"Conversations on Data Science and Collaboration\",\"summary\":\"This series of informal conversations starts with a group discussing their experiences in data science, learning techniques, and tools like Gradient Boost and Light DBA. It then shifts to a discussion on the importance of collaboration and information sharing in teams, emphasizing the necessity of public discussions and the prohibition of private sharing.\",\"tags\":[\"Data Science\",\"Collaboration\",\"Information Sharing\",\"Learning Techniques\"],\"essential_reminders\":[]}"
        },
        {
            "input": "[{\"base_heading\": \"Discussão sobre Educação e Prática na Área de Programação\", \"base_abstract\": \"A conversa aborda a importância da prática e educação em programação, mencionando o desafio do Kegler e a necessidade de se dedicar à área. A ideia é apresentar um curso para começar e praticar com projetos simples, como o Titanic, para desenvolver habilidades e aprender de erros.\", \"base_labels\": [\"Educação em Programação\", \"Prática\", \"Desafios\", \"Projetos Simples\"], \"base_memos\": []}, {\"base_heading\": \"Discussão sobre Gerenciamento de Dados e Empresas\", \"base_abstract\": \"Nesta conversação, os participantes discutem a abordagem com um gerente da iFood e mencionam o Leonel como exemplo. Eles falam sobre o funcionamento normal do Data Manager e a importância de garantir que as informações estejam seguras e processadas rapidamente. Também são mencionados os diretores de empresas em dificuldades financeiras e a necessidade de contato com esses indivíduos.\", \"base_labels\": [\"Gerenciamento de Dados\", \"iFood\", \"Empresa em Dificuldades Financeira\", \"Data Manager\"], \"base_memos\": []}]",
            "output": "{\"text_title\":\"Discussão sobre Educação em Programação e Gerenciamento de Dados em Negócios\",\"summary\":\"Esta série de conversas aborda dois tópicos principais. A primeira discussão é sobre a importância da educação e prática em programação, destacando o desafio do Kegler e enfatizando o valor de começar com projetos simples como o Titanic para desenvolvimento de habilidades. A segunda discussão gira em torno do gerenciamento de dados em negócios, usando um estudo de caso do iFood e discutindo o papel dos gerentes de dados em garantir um processamento seguro e rápido das informações. A conversa também aborda os desafios enfrentados por empresas em dificuldades financeiras e a necessidade de engajar tais negócios.\",\"tags\":[\"Educação em Programação\",\"Gerenciamento de Dados\",\"Desafios de Negócios\",\"Desenvolvimento de Habilidades\"],\"essential_reminders\":[]}"
        },
        {
            "input": "[{\"base_heading\": \"Conversations in Portuguese and Russian\", \"base_abstract\": \"A group of people engage in a conversation discussing various topics such as software upgrades, soccer matches, and personal experiences. They speak in Portuguese and Russian.\", \"base_labels\": [\"Software Upgrade\", \"Soccer Match\", \"Personal Experiences\"], \"base_memos\": []}, {\"base_heading\": \"Insulto informal\", \"base_abstract\": \"Esta frase contém um insulto informal e deve ser tratada com cautela. Não é adequado para uso em contextos profissionais ou públicos.\", \"base_labels\": [\"Insulto\", \"Linguagem Inapropriada\"], \"base_memos\": []}]",
            "output": "{\"text_title\":\"Conversations in Multilingual Contexts and Awareness of Language Sensitivity\",\"summary\":\"This conversation series encompasses two distinct discussions. The first involves a multilingual conversation in Portuguese and Russian, where the topics range from software upgrades to soccer matches and personal experiences. The second discussion highlights the use of an informal insult, underlining the importance of being cautious with language, particularly in professional or public contexts. It serves as a reminder of the need for appropriate language use and cultural sensitivity in communication.\",\"tags\":[\"Multilingual Conversation\",\"Language Sensitivity\",\"Cultural Awareness\",\"Professional Communication\"],\"essential_reminders\":[]}"
        }
    ]

    formatted_strings = ""
    for item in samples:
        formatted_string = f"### User:\n<text>{item['input']}</text>### Assistant:\n{item['output']}"
        formatted_strings += formatted_string

    formatted_strings_combine = ""
    for item in samples_combine:
        formatted_string_combine = f"### User:\n<JSONLIST>{item['input']}</JSONLIST>### Assistant:\n{item['output']}"
        formatted_strings_combine += formatted_string_combine

    # Prompt
    prompt = PromptTemplate(
        template="### System:\nIt is critical that you follow the following instructions accurately. Format the user text highlighting key information from user input and maintaining the integrity and diversity of multifaceted content. Make sure the fill the fields using the right type and using the same language as the text. {format_instructions}.{formatted_strings}### User:\n<text>{query}</text>### Assistant:\n",
        input_variables=["query", "formatted_strings"],
        partial_variables={
            "format_instructions": extract_parser.get_format_instructions()},
    )
    prompt_combine = PromptTemplate(
        template="### System:\nYour job is to summarize the JSONLIST provided by the user returing a new JSON scheema in the following format. {format_instructions}.{formatted_strings}### User:\n<JSONLIST>{query}</JSONLIST>### Assistant:\n",
        input_variables=["query"],
        partial_variables={
            "format_instructions": parser.get_format_instructions()},
    )

    text_splitter = TokenTextSplitter(chunk_size=1800, chunk_overlap=0)

    model = llm

    split_texts = RunnableLambda(
        lambda x: [{"input": doc} for doc in text_splitter.split_text(x)]
    )
    extract_information = RunnableLambda(
        lambda x: [model(prompt.format_prompt(
            query=doc['input'], formatted_strings=formatted_strings).to_string()) for doc in x]
    )

    def flatten(matrix):
        return '[' + ','.join(matrix) + ']'

    def combine_data(outputs):
        return prompt_combine.format_prompt(query=outputs, formatted_strings=formatted_strings_combine).to_string()

    def reduce(outputs):
        max_chars = 5000

        def process_group(group):
            flattened_group = flatten(group)
            summary = combine_data | model
            data = str(summary.invoke(flattened_group))
            data = (data.replace("\"text_title\"", "\"base_heading\"")
                            .replace("\"summary\"", "\"base_abstract\"")
                            .replace("\"tags\"", "\"base_labels\"")
                            .replace("\"essential_reminders\"", "\"base_memos\""))
            return data

        def process_outputs(data):
            current_group = []
            current_char_count = 0
            processed_data = []

            for i, output in enumerate(data):
                output_char_count = len(output)
                if current_char_count + output_char_count > max_chars:
                    if current_group:
                        processed_data.append(process_group(current_group))
                        if len(flatten(processed_data + data[i:])) <= max_chars:
                            return processed_data + data[i:]
                        current_group = []
                        current_char_count = 0

                current_group.append(output)
                current_char_count += output_char_count

            if current_group:
                processed_data.append(process_group(current_group))

            return processed_data
        
        flatten_output = flatten(outputs)
        if(len(flatten_output) <= max_chars):
            return flatten_output
        final_result = process_outputs(outputs)
        final_flattened = flatten(final_result)


        while len(final_flattened) > max_chars:
            final_result = process_outputs(final_result)
            final_flattened = flatten(final_result)

        return final_flattened

    for _ in range(3):
        try:
            chain = split_texts | extract_information | reduce | combine_data | model | parser.parse
            return chain.invoke(data)
        except Exception as e:
            print(e)
            continue
    return "Error: Could not generate metadata summary"
