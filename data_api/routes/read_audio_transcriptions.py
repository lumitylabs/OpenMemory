from model.databases import AsyncSessionLocal, get_db
from model.models import Activity,RawIdeas, ScreenCapture
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
            screen_capture_query = await session.execute(select(ScreenCapture).filter(ScreenCapture.timestamp >= act.timestamp).limit(1))
            screen_capture = screen_capture_query.scalars().first()
            image_path = screen_capture.path if screen_capture else None

            raw_ideas_query = await session.execute(select(RawIdeas).filter(RawIdeas.start_timestamp == act.timestamp, RawIdeas.memory_id == act.memory_id))
            raw_idea = raw_ideas_query.scalars().first()
            idea_content = raw_idea.content if raw_idea else None

            results.append({
                "id": act.id,
                "title": act.title,
                "description": act.description,
                "tags": act.tags,
                "reminders": act.reminders,
                "date_str": act.date_str,
                "time_str": act.time_str,
                "timestamp": act.timestamp,
                "image_path": image_path,
                "raw_idea_content": idea_content
            })

    return results