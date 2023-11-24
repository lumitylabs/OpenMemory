
from pydantic import BaseModel
import module_globals

from model.update_config import update_config
from routes.load_config import load_config
from routes.sensors.start_sensor import start_sensor
from routes.sensors.stop_sensor import stop_sensor
from fastapi import APIRouter
app = APIRouter()

class SensorData(BaseModel):
    sensor_name: str
    state: bool
    
@app.post("/set_sensor/")
async def set_sensor(data: SensorData):

    print(module_globals.is_capturing)
    config = await load_config()
    update_config(data.sensor_name, data.state)
    
    
    if module_globals.is_capturing:
        print(data)
        print(data.state)
        if data.state:
            await start_sensor(data.sensor_name,config['selected_memory'])
        else:
            await stop_sensor(data.sensor_name)

    return {"message": f"Sensor {data.sensor_name} configuration updated"}