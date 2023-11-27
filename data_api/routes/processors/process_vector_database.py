import subprocess
import sys
import time
from fastapi import APIRouter
app = APIRouter()

@app.post("/process_vector_database/{memory_id}")
async def process_vector_database(memory_id: int):

    # server_cmd = f"{sys.executable} ../llm_api/start_server.py"
    # server = subprocess.Popen(server_cmd)
    # time.sleep(5)

    # Inicia o segundo script após o primeiro finalizar
    command3 = f"{sys.executable} ../client/model/vector_database_manager_langchain.py"
    subprocess.Popen(command3, shell=True).wait()

    # await server.terminate()

    return {"message": f"Processed memory ID {memory_id} and started vector database manager"}
