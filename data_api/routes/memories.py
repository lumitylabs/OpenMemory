from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from model.databases import get_db
from model.models import Memory
from typing import List, Dict

app = APIRouter()

from sqlalchemy import text



async def fetch_memories(db_session: AsyncSession):
    result = await db_session.execute(text("SELECT id, name FROM memory"))
    memories = result.fetchall()
    return [{"id": memory[0], "name": memory[1]} for memory in memories]

@app.get("/memories/", response_model=List[Dict[str, str]])
async def list_memories(db: AsyncSession = Depends(get_db)):
    return await fetch_memories(db)
