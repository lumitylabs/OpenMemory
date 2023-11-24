from fastapi import HTTPException
import subprocess
import sys
from module_globals import processes
from fastapi import APIRouter
app = APIRouter()
@app.post("/start/{sensor_name}/{memory_id}")
async def start_sensor(sensor_name: str, memory_id: int):
    print(sensor_name, memory_id)
    if sensor_name in processes:
        raise HTTPException(status_code=400, detail="Sensor already running")

    command = f"{sys.executable} ../client/sensors/{sensor_name}.py --memory_id {memory_id}"
    process = subprocess.Popen(command)
    processes[sensor_name] = process
    return {"message": f"Sensor {sensor_name} started with memory_id {memory_id}"}
