import subprocess
import sys
import time
from fastapi import APIRouter
app = APIRouter()

@app.post("/process_memory/{memory_id}")
async def process_memory(memory_id: int):

    server_cmd = f"{sys.executable} ../llm_api/start_server.py"
    server = subprocess.Popen(server_cmd)
    time.sleep(5)

    command = f"{sys.executable} ../client/sensors/audio_processor.py --memory_id {memory_id}"
    subprocess.Popen(command, shell=True).wait()  # Espera o script finalizar

    command2 = f"{sys.executable} ../client/model/summary_text.py --memory_id {memory_id}"
    subprocess.Popen(command2, shell=True).wait()  # Espera o script finalizar

    # Inicia o segundo script após o primeiro finalizar
    command3 = f"{sys.executable} ../client/model/vector_database_manager_langchain.py"
    subprocess.Popen(command3, shell=True).wait()

    server.terminate()

    return {"message": f"Processed memory ID {memory_id} and started vector database manager"}
