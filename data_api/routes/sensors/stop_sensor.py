from fastapi import HTTPException
from module_globals import processes
from fastapi import APIRouter
app = APIRouter()
@app.post("/stop/{sensor_name}")
async def stop_sensor(sensor_name: str):
    if sensor_name not in processes:
        raise HTTPException(status_code=404, detail="Sensor not found")

    process = processes.pop(sensor_name)
    process.kill()
    process.wait()
    return {"message": f"Sensor {sensor_name} stopped"}