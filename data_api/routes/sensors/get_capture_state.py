from fastapi import APIRouter
import module_globals

app = APIRouter()

@app.post("/get_capture_state")
async def get_capture_state():
    return {"state":module_globals.is_capturing}