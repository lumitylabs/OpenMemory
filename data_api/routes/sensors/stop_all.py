from fastapi import HTTPException
from module_globals import processes
from fastapi import APIRouter
app = APIRouter()
@app.post("/stop_all")
async def stop_all_sensors():
    for sensor_name, process in list(processes.items()):
        process.kill()
        process.wait()
        processes.pop(sensor_name)
    return {"message": "All sensors stopped"}