import asyncio
import sys
from fastapi import APIRouter
from model.databases import load_vector_database
from routes.websockets import notify_websockets
app = APIRouter()
import module_globals
import subprocess

async def run_subprocess(command):
    process = await asyncio.create_subprocess_shell(
        command,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    stdout, stderr = await process.communicate()
    if process.returncode != 0:
        error = stderr.decode().strip() if stderr else 'Subprocess error'
        print(f"Error in {command}: {error}")
    return stdout.decode().strip() if stdout else 'No output'

@app.post("/process_all")
async def process_all():
    module_globals.is_processing = True
    await notify_websockets({"function":"processing_start"})

    server_cmd = [sys.executable, "../llm_api/start_server.py"]
    server = await asyncio.create_subprocess_exec(*server_cmd)

    await asyncio.sleep(5)

    command1 = f"{sys.executable} ../client/sensors/audio_processor.py"
    await run_subprocess(command1)

    command2 = f"{sys.executable} ../client/model/summary_text.py"
    await run_subprocess(command2)

    command3 = f"{sys.executable} ../client/model/vector_database_manager_langchain.py"
    await run_subprocess(command3)

    module_globals.is_processing = False
    await notify_websockets({"function":"processing_done"})

    await load_vector_database()
    
    server.terminate()
    try:
        await asyncio.wait_for(server.wait(), timeout=10)
    except asyncio.TimeoutError:
        server.kill()

    module_globals.is_processing = False
    await notify_websockets({"function": "processing_done"})

    return {"message": "Processed all and started vector database manager"}