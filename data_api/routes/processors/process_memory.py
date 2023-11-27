import asyncio
import sys
from fastapi import APIRouter
from routes.websockets import notify_websockets
app = APIRouter()
import module_globals

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

@app.post("/process_memory/{memory_id}")
async def process_memory(memory_id: int):
    
    module_globals.is_processing = True
    await notify_websockets({"function":"processing_start"})
    server_cmd = f"{sys.executable} ../llm_api/start_server.py"
    server = await asyncio.create_subprocess_shell(server_cmd)

    await asyncio.sleep(5)

    command = f"{sys.executable} ../client/sensors/audio_processor.py --memory_id {memory_id}"
    await run_subprocess(command)

    command2 = f"{sys.executable} ../client/model/summary_text.py --memory_id {memory_id}"
    await run_subprocess(command2)

    command3 = f"{sys.executable} ../client/model/vector_database_manager_langchain.py"
    await run_subprocess(command3)

    module_globals.is_processing = False
    await notify_websockets({"function":"processing_done"})
    await server.terminate()

    return {"message": f"Processed memory ID {memory_id} and started vector database manager"}