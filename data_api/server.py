import sys
import os
import asyncio
from asyncio import windows_events

if sys.platform == 'win32':
    asyncio.set_event_loop_policy(windows_events.WindowsProactorEventLoopPolicy())

script_dir = os.path.dirname(os.path.abspath(__file__))
if script_dir not in sys.path:
    sys.path.append(script_dir)
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
import routes.read_audio_transcriptions
import routes.get_activity_and_related_data
import routes.get_audio_transcriptions_and_send
import routes.read_filtered_audio_transcriptions
import routes.create_memory
import routes.sensors.start_sensor
import routes.sensors.stop_sensor
import routes.sensors.stop_all
import routes.sensors.running_sensors
import routes.sensors.start_capture
import routes.sensors.stop_capture
import routes.vector_search
import routes.processors.process_all
import routes.processors.process_memory
import routes.export_memory
import routes.import_memory
import routes.delete_memory
import routes.memories
import routes.set_sensor
import routes.select_memory
import routes.load_config
import routes.processors.process_vector_database
import routes.sensors.get_capture_state
import routes.sensors.get_is_processing
import routes.websockets
import module_globals
app = FastAPI()
origins = [
    "*",
]

@app.on_event("shutdown")
async def shutdown_event():
    print("Shutting down fastAPI server...")
    for process in module_globals.processes.values():
        process.terminate() 
        process.wait() 


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/screencaptures", StaticFiles(directory=os.path.abspath("../client/data/screencapture")), name="screencaptures")
@app.get("/screencaptures/{file_path:path}")
async def read_screencapture(file_path: str):
    file_location = os.path.join(os.path.abspath("../client/data/screencapture"), file_path)
    if not os.path.exists(file_location):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_location)


app.include_router(routes.read_audio_transcriptions.app)
app.include_router(routes.get_activity_and_related_data.app)
app.include_router(routes.get_audio_transcriptions_and_send.app)
app.include_router(routes.read_filtered_audio_transcriptions.app)
app.include_router(routes.create_memory.app)
app.include_router(routes.export_memory.app)
app.include_router(routes.import_memory.app)
app.include_router(routes.delete_memory.app)
app.include_router(routes.memories.app)
app.include_router(routes.vector_search.app)
app.include_router(routes.sensors.start_sensor.app)
app.include_router(routes.sensors.stop_sensor.app)
app.include_router(routes.sensors.stop_all.app)
app.include_router(routes.sensors.running_sensors.app)
app.include_router(routes.sensors.start_capture.app)
app.include_router(routes.sensors.stop_capture.app)
app.include_router(routes.sensors.get_capture_state.app)
app.include_router(routes.sensors.get_is_processing.app)
app.include_router(routes.processors.process_all.app)
app.include_router(routes.processors.process_memory.app)
app.include_router(routes.processors.process_vector_database.app)
app.include_router(routes.set_sensor.app)
app.include_router(routes.select_memory.app)
app.include_router(routes.load_config.app)
app.include_router(routes.websockets.router)