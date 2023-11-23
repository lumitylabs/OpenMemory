from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from model.databases import get_db
from model.models import Memory
from typing import List, Dict

app = APIRouter()

@app.get("/memories/", response_model=List[Dict[str, str]])
async def list_memories(db: AsyncSession = Depends(get_db)):
    async with db as session:
        # Realize uma consulta para obter id e nome das memórias
        result = await session.execute("SELECT id, name FROM memory")
        memories = result.fetchall()

        # Formate os dados para o formato desejado
        formatted_memories = [{"id": memory[0], "name": memory[1]} for memory in memories]

        return formatted_memories