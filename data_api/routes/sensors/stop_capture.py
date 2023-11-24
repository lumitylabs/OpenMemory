from fastapi import HTTPException
import module_globals
from routes.sensors.stop_sensor import stop_sensor
from fastapi import APIRouter
app = APIRouter()

@app.post("/stop_capture")
async def stop_capture():
    if not module_globals.is_capturing:
        raise HTTPException(status_code=400, detail="Capture not active")

    for sensor_name in list(module_globals.processes.keys()):
        await stop_sensor(sensor_name)
    
    module_globals.is_capturing = False
    return {"message": "All sensors stopped"}