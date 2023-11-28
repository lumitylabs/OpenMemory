from fastapi import APIRouter
from model.databases import AsyncSessionLocal, get_db
from sqlalchemy import desc
from model.models import Activity, RawIdeas, ScreenCapture
from fastapi import Depends
from sqlalchemy.orm import Session
app = APIRouter()

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from model.models import Activity, ScreenCapture

@app.get("/getFilteredAudioTranscriptions/")
async def read_filtered_audio_transcriptions(skip: int = 0, limit: int = 20, filter_timestamps: str = "", memory_id: int = None, db: AsyncSession = Depends(get_db)):
    filter_timestamps = [float(x) for x in filter_timestamps.split(",")] if filter_timestamps else []
    results = []

    async with db as session:
        for ft in filter_timestamps:
            # Construct queries for previous and next activities
            prev_activity_stmt = select(Activity).filter(Activity.timestamp <= ft)
            next_activity_stmt = select(Activity).filter(Activity.timestamp > ft)

            if memory_id is not None:
                prev_activity_stmt = prev_activity_stmt.filter(Activity.memory_id == memory_id)
                next_activity_stmt = next_activity_stmt.filter(Activity.memory_id == memory_id)

            # Execute queries
            prev_result = await session.execute(prev_activity_stmt.order_by(desc(Activity.timestamp)))
            next_result = await session.execute(next_activity_stmt.order_by(Activity.timestamp))

            prev_activity = prev_result.scalars().first()
            next_activity = next_result.scalars().first()

            raw_ideas_query = await session.execute(select(RawIdeas).filter(RawIdeas.start_timestamp == prev_activity.timestamp, RawIdeas.memory_id == prev_activity.memory_id))
            raw_idea = raw_ideas_query.scalars().first()
            idea_content = raw_idea.content if raw_idea else None

            if prev_activity and (not next_activity or next_activity.timestamp > ft):
                # Query for ScreenCapture
                screencap_stmt = select(ScreenCapture).filter(ScreenCapture.timestamp >= prev_activity.timestamp)
                if memory_id is not None:
                    screencap_stmt = screencap_stmt.filter(ScreenCapture.memory_id == memory_id)

                screencap_result = await session.execute(screencap_stmt)
                screencap_query = screencap_result.scalars().first()
                image_path = screencap_query.path if screencap_query else None

                results.append({
                    "id": prev_activity.id,
                    "memory_id": prev_activity.memory_id,
                    "title": prev_activity.title,
                    "description": prev_activity.description,
                    "tags": prev_activity.tags,
                    "reminders": prev_activity.reminders,
                    "date_str": prev_activity.date_str,
                    "time_str": prev_activity.time_str,
                    "timestamp": prev_activity.timestamp,
                    "image_path": image_path,
                    "raw_idea_content": idea_content
                })
    
    paginated_results = results[skip: skip + limit]
    return paginated_results