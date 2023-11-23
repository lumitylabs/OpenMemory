from model.databases import AsyncSessionLocal, get_db
from model.models import Activity, ScreenCapture
from fastapi import APIRouter
from sqlalchemy import desc
from fastapi import Depends
from sqlalchemy.orm import Session

app = APIRouter()

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

@app.get("/getAudioTranscriptions/")
async def read_audio_transcriptions(skip: int = 0, limit: int = 20, db: AsyncSession = Depends(get_db)):
    async with db as session:
        result = await session.execute(select(Activity).order_by(desc(Activity.timestamp)).offset(skip).limit(limit))
        activities = result.scalars().all()
        results = []

        for act in activities:
            result = await session.execute(select(ScreenCapture).filter(ScreenCapture.timestamp >= act.timestamp).limit(1))
            query = result.scalars().first()
            image_path = query.path if query else None
            results.append({
                "id": act.id,
                "title": act.title,
                "description": act.description,
                "tags": act.tags,
                "reminders": act.reminders,
                "description": act.description,
                "date_str": act.date_str,
                "time_str": act.time_str,
                "timestamp": act.timestamp,
                "image_path": image_path
            })

    return results