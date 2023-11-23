from fastapi import APIRouter, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from model.models import Memory
from model.databases import AsyncSessionLocal, get_db
from fastapi import Depends

app = APIRouter()

@app.post("/create_memory/{name}")
async def create_memory(name: str, db: AsyncSession = Depends(get_db)):
    try:
        new_memory = Memory(name=name)

        db.add(new_memory)
        await db.commit()

        await db.refresh(new_memory)

        return {"message": "Memory created successfully", "memory_id": new_memory.id}
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating memory: {e}"
        )
