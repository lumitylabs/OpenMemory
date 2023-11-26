from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
from model.load_or_create_config import load_or_create_config

from model.sensor_config import SensorConfig
app = APIRouter()
config_file = "data_config.json"

@app.get("/load_config/")
async def load_config():
    config = load_or_create_config()
    return config