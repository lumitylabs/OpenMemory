from databases import db
from models import Activity, ScreenCapture
from fastapi import APIRouter
from sqlalchemy import desc

app = APIRouter()

@app.get("/getAudioTranscriptions/")
async def read_audio_transcriptions(skip: int = 0, limit: int = 20):
    activities = db.query(Activity).order_by(desc(Activity.timestamp)).offset(skip).limit(limit).all()
    results = []

    for act in activities:
        query = db.query(ScreenCapture).filter(ScreenCapture.timestamp >= act.timestamp).first()
        if query:
            image_path = query.path
        else:
            image_path = None
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