from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from model.databases import get_db
from model.models import Memory
from typing import List, Dict

app = APIRouter()

from sqlalchemy import text

@app.get("/memories/", response_model=List[Dict[str, str]])
async def list_memories(db: AsyncSession = Depends(get_db)):
    async with db as session:
        # Use text() to explicitly declare the SQL query
        result = await session.execute(text("SELECT id, name FROM memory"))
        memories = result.fetchall()

        # Rest of the code remains the same
        formatted_memories = [{"id": memory[0], "name": memory[1]} for memory in memories]

        return formatted_memories
