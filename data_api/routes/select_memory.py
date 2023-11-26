from fastapi import APIRouter, Depends
from pydantic import BaseModel
from model.databases import AsyncSessionLocal, get_db

from model.update_config import update_config
from routes.memories import fetch_memories, list_memories


app = APIRouter()


class MemoryData(BaseModel):
    memory_id: int


@app.post("/select_memory/")
async def select_memory(data: MemoryData, db: AsyncSessionLocal = Depends(get_db)):
    memories = await fetch_memories(db)
    memory_name = next((memory['name'] for memory in memories if memory['id'] == data.memory_id), None)
    
    if memory_name is None:
        return {"message": f"Memory {data.memory_id} not found"}

    update_config("selected_memory", {"id": data.memory_id, "name": memory_name})
    return {"message": f"Memory {data.memory_id} selected"}