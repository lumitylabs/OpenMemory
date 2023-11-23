from fastapi import APIRouter
from pydantic import BaseModel

from model.update_config import update_config


app = APIRouter()


class MemoryData(BaseModel):
    memory_id: int


@app.post("/select_memory/")
async def select_memory(data: MemoryData):
    update_config("selected_memory", data.memory_id)
    return {"message": f"Memory {data.memory_id} selected"}