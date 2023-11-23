from fastapi import APIRouter, HTTPException, Query
from model.databases import AsyncSessionLocal, get_db
from sqlalchemy import and_
from model.models import Activity, AudioTranscriptions, ScreenCapture
from fastapi import Depends
from sqlalchemy.orm import Session
app = APIRouter()

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_

@app.get("/getActivityAndRelatedData/")
async def get_activity_and_related_data(timestamp: float, memory_id: int = Query(None), db: AsyncSession = Depends(get_db)):
    async with db as session:
        # Construct the base query for Activity
        activity_stmt = select(Activity).filter(Activity.timestamp == timestamp)
        if memory_id is not None:
            activity_stmt = activity_stmt.filter(Activity.memory_id == memory_id)

        # Get the activity
        result = await session.execute(activity_stmt)
        activity = result.scalars().first()
        if not activity:
            raise HTTPException(status_code=404, detail="Activity not found")

        # Find the next activity's timestamp, considering memory_id if provided
        next_activity_stmt = select(Activity).filter(Activity.timestamp > timestamp)
        if memory_id is not None:
            next_activity_stmt = next_activity_stmt.filter(Activity.memory_id == memory_id)
        result = await session.execute(next_activity_stmt.order_by(Activity.timestamp))
        next_activity = result.scalars().first()
        next_timestamp = next_activity.timestamp if next_activity else float('inf')
        
        # Queries for AudioTranscriptions and ScreenCapture
        audio_transcriptions_stmt = select(AudioTranscriptions).filter(
            and_(AudioTranscriptions.timestamp >= timestamp, AudioTranscriptions.timestamp < next_timestamp))
        if memory_id is not None:
            audio_transcriptions_stmt = audio_transcriptions_stmt.filter(AudioTranscriptions.memory_id == memory_id)
        result = await session.execute(audio_transcriptions_stmt)
        audio_transcriptions = result.scalars().all()

        screencaptures_stmt = select(ScreenCapture).filter(
            and_(ScreenCapture.timestamp >= timestamp, ScreenCapture.timestamp < next_timestamp))
        if memory_id is not None:
            screencaptures_stmt = screencaptures_stmt.filter(ScreenCapture.memory_id == memory_id)
        result = await session.execute(screencaptures_stmt)
        screencaptures = result.scalars().all()
    
    return {
        "activity": {
            "id": activity.id,
            "title": activity.title,
            "description": activity.description,
            "tags": activity.tags,
            "reminders": activity.reminders,
            "date_str": activity.date_str,
            "time_str": activity.time_str,
            "timestamp": activity.timestamp
        },
        "audio_transcriptions": [{"timestamp": at.timestamp, "content": at.content, "type": at.type, "processes": at.processes} for at in audio_transcriptions],
        "screencaptures": [{"timestamp": sc.timestamp, "path": sc.path, "processes": sc.processes} for sc in screencaptures]
    }
