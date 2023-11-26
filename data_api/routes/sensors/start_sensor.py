from fastapi import HTTPException
import subprocess
import sys
import module_globals
from fastapi import APIRouter
import win32job
import module_globals
import win32api
import win32con

app = APIRouter()
@app.post("/start/{sensor_name}/{memory_id}")
async def start_sensor(sensor_name: str, memory_id: int):
    print(sensor_name, memory_id)
    if sensor_name in module_globals.processes:
        raise HTTPException(status_code=400, detail="Sensor already running")

    path = f"../client/sensors/{sensor_name}.py"
    proc = subprocess.Popen([sys.executable, path])
    win32job.AssignProcessToJobObject(module_globals.job, win32api.OpenProcess(win32con.PROCESS_ALL_ACCESS, False, proc.pid))
    module_globals.processes[sensor_name] = proc
    return {"message": f"Sensor {sensor_name} started with memory_id {memory_id}"}
