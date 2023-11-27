from fastapi import APIRouter
import module_globals

app = APIRouter()

@app.post("/get_is_processing")
async def get_is_processing():
    return {"state":module_globals.is_processing}