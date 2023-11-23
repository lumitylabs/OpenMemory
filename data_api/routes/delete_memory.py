import zipfile
import os
import json
from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from model.databases import AsyncSessionLocal, get_db
from model.models import Memory, Activity, AudioTranscriptions, RawIdeas, ScreenCapture
import shutil
import aiofiles
import asyncio
from fastapi import HTTPException

app = APIRouter()

@app.delete("/delete_memory/{memory_id}")
async def delete_memory(memory_id: int, db: AsyncSession = Depends(get_db)):
    async with db as session:
        memory = await session.get(Memory, memory_id)
        if not memory:
            raise HTTPException(status_code=404, detail="Memory not found")

        screencaptures = await session.execute("SELECT path FROM screencapture WHERE memory_id = :memory_id", {'memory_id': memory_id})
        paths = [result[0] for result in screencaptures]

        for path in paths:
            full_path = os.path.join('../client/data/screencapture', path)
            if os.path.exists(full_path):
                os.remove(full_path)

        folder_path = os.path.join('../client/data/screencapture', str(memory_id))
        if os.path.exists(folder_path) and os.path.isdir(folder_path):
            # Excluir a pasta e seu conteúdo
            shutil.rmtree(folder_path)

        await session.execute("DELETE FROM audio_transcriptions WHERE memory_id = :memory_id", {'memory_id': memory_id})
        await session.execute("DELETE FROM screencapture WHERE memory_id = :memory_id", {'memory_id': memory_id})
        await session.execute("DELETE FROM raw_ideas WHERE memory_id = :memory_id", {'memory_id': memory_id})
        await session.execute("DELETE FROM activities WHERE memory_id = :memory_id", {'memory_id': memory_id})
        await session.execute("DELETE FROM memory WHERE id = :memory_id", {'memory_id': memory_id})
        await session.commit()

        return {"message": "Memory and associated data deleted successfully"}