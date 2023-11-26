from fastapi import HTTPException
from routes.load_config import load_config
from routes.sensors.start_sensor import start_sensor

from fastapi import APIRouter
import module_globals

app = APIRouter()

@app.post("/start_capture")
async def start_capture():
    if module_globals.is_capturing:
        raise HTTPException(status_code=400, detail="Capture already active")
    config = await load_config()
    for sensor_name in config['sensors'].keys():
        if(config['sensors'][sensor_name]):
            await start_sensor(sensor_name, config['selected_memory']['id'])
    
    module_globals.is_capturing = True
    print(module_globals.is_capturing)
    return {"message": "All sensors started"}