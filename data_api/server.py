from fastapi import Depends, HTTPException

from datetime import datetime
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import routes.read_audio_transcriptions
import routes.get_activity_and_related_data
import routes.get_audio_transcriptions_and_send
import routes.read_filtered_audio_transcriptions
import routes.vector_search
    
app = FastAPI()
origins = [
    "http://localhost:5173",
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
