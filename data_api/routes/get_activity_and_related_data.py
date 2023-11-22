from fastapi import APIRouter, HTTPException, Query
from model.databases import db
from sqlalchemy import and_
from model.models import Activity, AudioTranscriptions, ScreenCapture

app = APIRouter()

@app.get("/getActivityAndRelatedData/")
async def get_activity_and_related_data(timestamp: float, memory_id: int = Query(None)):
    # Construct the base query for Activity
    activity_query = db.query(Activity).filter_by(timestamp=timestamp)
    if memory_id is not None:
        activity_query = activity_query.filter_by(memory_id=memory_id)

    # Get the activity
    activity = activity_query.first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    # Find the next activity's timestamp, considering memory_id if provided
    next_activity_query = db.query(Activity).filter(Activity.timestamp > timestamp)
    if memory_id is not None:
        next_activity_query = next_activity_query.filter_by(memory_id=memory_id)
    next_activity = next_activity_query.order_by(Activity.timestamp).first()
    next_timestamp = next_activity.timestamp if next_activity else float('inf')
    
    # Construct and execute query for AudioTranscriptions
    audio_transcriptions_query = db.query(AudioTranscriptions).filter(
        and_(AudioTranscriptions.timestamp >= timestamp, AudioTranscriptions.timestamp < next_timestamp))
    if memory_id is not None:
        audio_transcriptions_query = audio_transcriptions_query.filter_by(memory_id=memory_id)
    audio_transcriptions = audio_transcriptions_query.all()

    # Construct and execute query for ScreenCapture
    screencaptures_query = db.query(ScreenCapture).filter(
        and_(ScreenCapture.timestamp >= timestamp, ScreenCapture.timestamp < next_timestamp))
    if memory_id is not None:
        screencaptures_query = screencaptures_query.filter_by(memory_id=memory_id)
    screencaptures = screencaptures_query.all()
    
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
