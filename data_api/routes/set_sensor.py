from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from model.update_config import update_config

app = APIRouter()

class SensorData(BaseModel):
    sensor_name: str
    state: bool
    
@app.post("/set_sensor/")
async def set_sensor(data: SensorData):
    update_config(data.sensor_name, data.state)
    return {"message": f"Sensor {data.sensor_name} configuration updated"}