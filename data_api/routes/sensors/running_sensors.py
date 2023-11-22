
from module_globals import processes
from fastapi import APIRouter
app = APIRouter()
@app.get("/running_sensors")
async def list_running_sensors():
    return {"running_sensors": list(processes.keys())}