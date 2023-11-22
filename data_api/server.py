import sys
import os
script_dir = os.path.dirname(os.path.abspath(__file__))
if script_dir not in sys.path:
    sys.path.append(script_dir)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import routes.read_audio_transcriptions
import routes.get_activity_and_related_data
import routes.get_audio_transcriptions_and_send
import routes.read_filtered_audio_transcriptions
import routes.sensors.start_sensor
import routes.sensors.stop_sensor
import routes.sensors.stop_all
import routes.sensors.running_sensors
import routes.vector_search
import routes.processors.process_all
import routes.processors.process_memory
    
app = FastAPI()
origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/screencaptures", StaticFiles(directory=os.path.abspath("../client/data/screencapture")), name="screencaptures")

app.include_router(routes.read_audio_transcriptions.app)
app.include_router(routes.get_activity_and_related_data.app)
app.include_router(routes.get_audio_transcriptions_and_send.app)
app.include_router(routes.read_filtered_audio_transcriptions.app)
app.include_router(routes.vector_search.app)
app.include_router(routes.sensors.start_sensor.app)
app.include_router(routes.sensors.stop_sensor.app)
app.include_router(routes.sensors.stop_all.app)
app.include_router(routes.sensors.running_sensors.app)
app.include_router(routes.processors.process_all.app)
app.include_router(routes.processors.process_memory.app)