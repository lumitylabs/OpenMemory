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
from langchain.llms import LlamaCpp
from langchain.schema.runnable import RunnableLambda
from langchain.text_splitter import TokenTextSplitter
import os

template = """GPT4 User: {question}<|end_of_turn|>GPT4 Assistant:"""
prompt = PromptTemplate(template=template, input_variables=["question"])

callback_manager = CallbackManager([StreamingStdOutCallbackHandler()])
n_gpu_layers = 50 
n_batch = 2048 


current_directory = os.path.dirname(os.path.abspath(__file__))
llm_path = os.path.join(current_directory,"model/openchat_3.5.Q5_K_M.gguf")


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

    llm = LlamaCpp(
    model_path=llm_path,
    n_gpu_layers=n_gpu_layers,
    n_batch=n_batch,
    temperature=0.7,
    top_p=0.1,
    top_k=20,
    typical_p=0,
    repetition_penalty=1.17,
    #callback_manager=callback_manager,
    n_ctx=4096,
    max_tokens=500,
    verbose=False,  # Verbose is required to pass to the callback manager
    )

    llm_chain = LLMChain(prompt=prompt, llm=llm, verbose=False)
    print(data)
    answer = llm_chain.run(data)
    return answer

@app.post('/metadata-summary')
def metadataSummary(data: Annotated[str, Form()]):
    print(data)
    n_gpu_layers = 4096
    n_batch = 4096

    llm = LlamaCpp(
        model_path=llm_path,
        n_gpu_layers=n_gpu_layers,
        n_batch=n_batch,
        temperature=0.5,
        top_p = 0.1,
        top_k=20,
        # callback_manager=callback_manager,
        n_ctx=4096,
        max_tokens=500,
        verbose=False,  # Verbose is required to pass to the callback manager
    )
    


    class Metadata(BaseModel):
        text_title: str = Field(description="A descritive title for the user text.")
        summary: str = Field(
            description="A descriptive summary of the user text that explains its content.")
        tags: Sequence[str] = Field(description="Keywords for the user text.")
        essential_reminders: Optional[Sequence[str]] = Field(
            description="Optional list for critical reminders ONLY, such as indispensable dates and pivotal events in natural language format. Otherwise, if not critical DO NOT fill this list.")
    
    parser = PydanticOutputParser(pydantic_object=Metadata)

    
    samples = [
        {
            "input": "Audio from Discord: Hey Bob, just a reminder that the project deadline is next Monday, November 14th. Also, the client meeting is scheduled for Wednesday, November 16th at 10 AM. We need to finalize our presentation by this Friday.\nMicrofone: Got it, Alice. I'll have the draft ready by Thursday for review. Also, remember that our team outing is on the 18th.\nAudio from Discord: Perfect, thanks Bob! Let's keep everything on track.",
            "output": "{\"text_title\": \"Project and Meeting Deadlines with Team Outing Reminder\", \"summary\": \"This conversation between Alice and Bob in a company setting highlights crucial dates for a project deadline, a client meeting, and a team outing. Alice reminds Bob of the need to finalize the presentation by Friday, and Bob acknowledges this with an assurance to have a draft ready by Thursday.\", \"tags\": [\"Project Deadline\", \"Client Meeting\", \"Team Outing\", \"Corporate Communication\"], \"essential_reminders\": [\"Project deadline is on Monday, November 14th\", \"Client meeting scheduled for Wednesday, November 16th at 10 AM\", \"Team outing is on November 18th\"]}"
        },
        {
            "input": "á, Ana, você lembra que temos que entregar o relatório financeiro até a próxima sexta-feira, dia 17?\nMicrofone: Sim, João, eu lembro. Vou finalizar a análise de custos hoje e te envio para revisão.\nAudio from Zoom: Perfeito. E não esqueça da reunião com o diretor na quarta-feira às 14h para discutirmos o orçamento do próximo ano.\nMicrofone: Já está na minha agenda. Obrigada pelo lembrete!",
            "output": "{\"text_title\": \"Lembretes de Tarefas e Reuniões no Ambiente de Trabalho\", \"summary\": \"Nesta conversa, João lembra Ana da necessidade de entregar o relatório financeiro até sexta-feira. Ana confirma que finalizará a análise de custos e João menciona uma reunião com o diretor na quarta-feira sobre o orçamento do próximo ano.\", \"tags\": [\"Relatório Financeiro\", \"Reunião com o Diretor\", \"Análise de Custos\", \"Ambiente de Trabalho\"], \"essential_reminders\": [\"Entrega do relatório financeiro até sexta-feira, dia 17\", \"Reunião com o diretor na quarta-feira às 14h\"]}"
        },
        {
            "input": "Audio from Brave: Welcome to TechTalk, the podcast where we discuss the latest in technology. Today, we're exploring the world of artificial intelligence.\nAudio from Brave: That's right. AI is transforming industries in remarkable ways, from healthcare to finance.\nAudio from Brave: Absolutely. It's fascinating to see how AI algorithms can analyze data and make predictions that were previously impossible.\nAudio from Brave: Indeed. The potential for innovation is limitless. It's an exciting time for tech enthusiasts.",
            "output": "{\"text_title\": \"TechTalk Podcast on Artificial Intelligence\", \"summary\": \"In this TechTalk podcast episode, the host and guest delve into the impact of artificial intelligence on various industries. They discuss the capabilities of AI in data analysis and prediction, highlighting the potential for future innovations in the tech field.\", \"tags\": [\"Podcast\", \"Artificial Intelligence\", \"Technology Discussion\", \"Industry Transformation\"], \"essential_reminders\": []}"
        },
        {
            "input": "cuerdas que debemos actualizar el sistema de gestión del cliente antes del 20 de este mes?\nAudio from Discord: Sí, Carlos, lo tengo en cuenta. Hoy trabajaré en la integración de la nueva base de datos.\nMicrofone: Excelente. También, por favor, revisa el informe de errores que nos envió el equipo técnico.\nAudio from Discord: Claro, lo revisaré después de la integración.",
            "output": "{\"text_title\": \"Recordatorios de Actualización de Sistema y Revisión de Informes\", \"summary\": \"Carlos recuerda a María la necesidad de actualizar el sistema de gestión del cliente antes del 20. María indica que trabajará en la integración de la base de datos y Carlos le pide que revise el informe de errores enviado por el equipo técnico.\", \"tags\": [\"Actualización de Sistema\", \"Gestión de Clientes\", \"Integración de Base de Datos\", \"Informe de Errores\"], \"essential_reminders\": [\"Actualizar el sistema de gestión del cliente antes del 20\"]}"
        },
        {
            "input": "Audio from Skype: Hello, this is Mike from Tech Solutions. I'm calling to confirm our meeting next Tuesday, November 22nd, about the software upgrade.\nMicrofone: Hi Mike, yes, I remember. November 22nd for the software upgrade meeting. Looking forward to it!\nAudio from Skype: Great! We'll send over the agenda by the end of this week. Have a good day!",
            "output": "{\"text_title\": \"Confirmation Call for Software Upgrade Meeting\", \"summary\": \"Mike from Tech Solutions calls to confirm a meeting regarding a software upgrade scheduled for next Tuesday, November 22nd. The receiver acknowledges the meeting date, and Mike mentions that an agenda will be sent over by the end of the week.\", \"tags\": [\"Meeting Confirmation\", \"Software Upgrade\", \"Business Call\"], \"essential_reminders\": [\"Software upgrade meeting on Tuesday, November 22nd\"]}"
        },
        
    ]

    samples_combine = [
    {
        "input": "[{\"text_title\":\"Causes of Climate Change\",\"summary\":\"The conversation begins with an exploration of what causes climate change, focusing on natural factors and human activities.\",\"tags\":[\"Climate Change Causes\",\"Natural Factors\",\"Human Activities\"],\"essential_reminders\":[]},{\"text_title\":\"Human Activities and Climate Change\",\"summary\":\"The discussion progresses to specifically address how human activities, particularly the burning of fossil fuels, contribute to climate change.\",\"tags\":[\"Human Activities\",\"Fossil Fuels\",\"Climate Impact\"],\"essential_reminders\":[]},{\"text_title\":\"Transition to Renewable Energy\",\"summary\":\"The conversation concludes with an emphasis on the need to switch to renewable energy sources to mitigate the effects of climate change.\",\"tags\":[\"Renewable Energy\",\"Climate Change Mitigation\",\"Energy Transition\"],\"essential_reminders\":[]}]",
        "output": "{\"text_title\":\"Climate Change Discussion\",\"summary\":\"This conversation series covers the topic of climate change, starting with its causes, both natural and human-induced, notably the burning of fossil fuels. It then transitions to the urgent need for switching to renewable energy sources as a means to combat climate change effects.\",\"tags\":[\"Climate Change\",\"Fossil Fuels\",\"Renewable Energy\"],\"essential_reminders\":[]}"
    },
    {
        "input": "[{\"text_title\":\"Meditação nas Escolas: Uma Introdução\",\"summary\":\"A conversa começa questionando se a meditação deveria ser ensinada nas escolas, explorando conceitos iniciais e a relevância da prática.\",\"tags\":[\"Meditação\",\"Educação\",\"Escolas\"],\"essential_reminders\":[]},{\"text_title\":\"Benefícios da Meditação para Estudantes\",\"summary\":\"A discussão avança para os benefícios da meditação para os estudantes, incluindo a redução do estresse e a melhoria do foco.\",\"tags\":[\"Meditação\",\"Benefícios\",\"Estudantes\",\"Foco\"],\"essential_reminders\":[]},{\"text_title\":\"Meditação Como Ferramenta Educacional\",\"summary\":\"A conversa conclui que a meditação poderia ajudar significativamente com o estresse e o foco dos estudantes nas escolas.\",\"tags\":[\"Meditação\",\"Estresse\",\"Foco\",\"Ferramenta Educacional\"],\"essential_reminders\":[]}]",
        "output": "{\"text_title\":\"Discussão sobre Meditação nas Escolas\",\"summary\":\"Esta série de conversas aborda a introdução da meditação nas escolas. Começa com uma análise da necessidade de ensinar meditação, passa pelos benefícios para os estudantes, incluindo melhoria no foco e redução de estresse, e conclui avaliando a meditação como uma ferramenta educacional eficaz.\",\"tags\":[\"Meditação\",\"Educação\",\"Benefícios para Estudantes\"],\"essential_reminders\":[]}"
    },
    {
        "input": "[{\"text_title\":\"Addressing Sleep Deprivation\",\"summary\":\"The conversation begins with addressing the issue of sleep deprivation and its recognition as a serious health problem.\",\"tags\":[\"Sleep Deprivation\",\"Health Issues\"],\"essential_reminders\":[]},{\"text_title\":\"Effects of Lack of Sleep\",\"summary\":\"Discussion moves to the physical and mental effects of lack of sleep, highlighting how it impacts overall health and well-being.\",\"tags\":[\"Sleep Effects\",\"Physical Health\",\"Mental Health\"],\"essential_reminders\":[]},{\"text_title\":\"Prioritizing Adequate Sleep\",\"summary\":\"The conversation concludes with an urgent call to prioritize adequate sleep and a question about how society can better facilitate healthy sleep habits.\",\"tags\":[\"Adequate Sleep\",\"Health Prioritization\",\"Sleep Habits\"],\"essential_reminders\":[\"World Sleep Day on March 19th\",\"Sleep Awareness Week in April\"]}]",
        "output": "{\"text_title\":\"Discussion on Sleep and Health\",\"summary\":\"This conversation series delves into the serious health problem of sleep deprivation, discussing its physical and mental effects and emphasizing the need to prioritize adequate sleep. It raises an important question: How can society better promote healthy sleep habits?\",\"tags\":[\"Sleep Deprivation\",\"Health Effects\",\"Adequate Sleep\"],\"essential_reminders\":[\"World Sleep Day on March 19th\",\"Sleep Awareness Week in April\"]}"
    }
]
    
    formatted_strings = ""
    for item in samples:
        formatted_string = f"GPT4 Correct User: <text>{item['input']}</text><|end_of_turn|>GPT4 Correct Assistant: {item['output']}<|end_of_turn|>"
        formatted_strings += formatted_string

    formatted_strings_combine = ""
    for item in samples_combine:
        formatted_string_combine = f"GPT4 Correct User: <JSONLIST>{item['input']}</JSONLIST><|end_of_turn|>GPT4 Correct Assistant: {item['output']}<|end_of_turn|>"
        formatted_strings_combine += formatted_string_combine


    # Prompt
    prompt = PromptTemplate(
        template="It is critical that you follow the following instructions accurately. Format the user text highlighting key information from user input and maintaining the integrity and diversity of multifaceted content. Make sure the fill the fields using the right type. {format_instructions}.<|end_of_turn|>{formatted_strings}GPT4 Correct User: <text>{query}</text><|end_of_turn|>GPT4 Correct Assistant:",
        input_variables=["query","formatted_strings"],
        partial_variables={
            "format_instructions": parser.get_format_instructions()},
    )
    prompt_combine = PromptTemplate(
        template="Your job is to summarize the JSONLIST provided by the user returing a new JSON scheema in the following format. {format_instructions}.<|end_of_turn|>{formatted_strings}GPT4 Correct User: <JSONLIST>{query}</JSONLIST><|end_of_turn|>GPT4 Correct Assistant:",
        input_variables=["query"],
        partial_variables={
            "format_instructions": parser.get_format_instructions()},
    )

    text_splitter = TokenTextSplitter(chunk_size=2000, chunk_overlap=0)


    model = llm

    split_texts = RunnableLambda(
        lambda x: [{"input": doc} for doc in text_splitter.split_text(x)]
    )
    extract_information = RunnableLambda(
        lambda x: [model(prompt.format_prompt(query=doc['input'], formatted_strings=formatted_strings).to_string()) for doc in x]
    )

    def flatten(matrix):
        flat_str = '['
        for row in matrix:
            flat_str += row + ","
        flat_str += "]"
        print(flat_str)
        return flat_str
    
    def combine_data(outputs):
        return prompt_combine.format_prompt(query=outputs, formatted_strings=formatted_strings_combine).to_string()
    
    for _ in range(3):
        try:
            chain = split_texts | extract_information | flatten | combine_data | model | parser.parse
            return chain.invoke(data)
        except Exception as e:
            print(e)
            continue
    return "Error: Could not generate metadata summary"

