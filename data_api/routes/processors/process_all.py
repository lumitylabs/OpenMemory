import subprocess
import sys
import time
from fastapi import APIRouter
app = APIRouter()

@app.post("/process_all")
async def process_all():

    server_cmd = f"{sys.executable} ../llm_api/start_server.py"
    server = subprocess.Popen(server_cmd)
    time.sleep(5)

    command1 = f"{sys.executable} ../client/sensors/audio_processor.py"
    subprocess.Popen(command1, shell=True).wait()  # Espera o script finalizar

    command2 = f"{sys.executable} ../client/model/summary_text.py"
    subprocess.Popen(command2, shell=True).wait()  # Espera o script finalizar

    # Inicia o segundo script após o primeiro finalizar
    command3 = f"{sys.executable} ../client/model/vector_database_manager_langchain"
    subprocess.Popen(command3, shell=True).wait()

    server.terminate()

    return {"message": "Processed all and started vector database manager"}