
from fastapi import APIRouter
from databases import db
from sqlalchemy import desc
from sqlalchemy import and_
from models import Activity, AudioTranscriptions, ScreenCapture

app = APIRouter()

@app.get("/getActivityAndRelatedData/")
async def get_activity_and_related_data(timestamp: float):
    # Get the activity with the given timestamp
    activity = db.query(Activity).filter_by(timestamp=timestamp).first()
    if not activity:
        return {"error": "Activity not found"}

    # Find the next activity's timestamp
    next_activity = db.query(Activity).filter(Activity.timestamp > timestamp).order_by(Activity.timestamp).first()
    next_timestamp = next_activity.timestamp if next_activity else float('inf')
    
    # Get audio_transcriptions
    audio_transcriptions = db.query(AudioTranscriptions).filter(
        and_(AudioTranscriptions.timestamp >= timestamp, AudioTranscriptions.timestamp < next_timestamp)
    ).all()

    # Get screencaptures
    screencaptures = db.query(ScreenCapture).filter(
        and_(ScreenCapture.timestamp >= timestamp, ScreenCapture.timestamp < next_timestamp)
    ).all()
    
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
        "screencaptures": [{"timestamp": sc.timestamp, "path": sc.path, "processes":sc.processes} for sc in screencaptures]
    }