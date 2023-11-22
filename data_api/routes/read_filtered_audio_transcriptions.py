from fastapi import APIRouter
from model.databases import db
from sqlalchemy import desc
from model.models import Activity, ScreenCapture
app = APIRouter()

@app.get("/getFilteredAudioTranscriptions/")
async def read_filtered_audio_transcriptions(skip: int = 0, limit: int = 20, filter_timestamps: str = "", memory_id: int = None):
    filter_timestamps = [float(x) for x in filter_timestamps.split(",")] if filter_timestamps else []
    results = []
    for ft in filter_timestamps:
        query = db.query(Activity)
        if memory_id is not None:
            query = query.filter(Activity.memory_id == memory_id)
        prev_activity = query.filter(Activity.timestamp <= ft).order_by(desc(Activity.timestamp)).first()
        next_activity = query.filter(Activity.timestamp > ft).order_by(Activity.timestamp).first()
        
        if prev_activity and (not next_activity or next_activity.timestamp > ft):
            screencap_query = db.query(ScreenCapture).filter(ScreenCapture.timestamp >= prev_activity.timestamp)
            if memory_id is not None:
                screencap_query = screencap_query.filter(ScreenCapture.memory_id == memory_id)
            query = screencap_query.first()
            image_path = query.path if query else None
            results.append({
                "id": prev_activity.id,
                "memory_id": prev_activity.memory_id,  # Include memory_id in the response
                "title": prev_activity.title,
                "description": prev_activity.description,
                "tags": prev_activity.tags,
                "reminders": prev_activity.reminders,
                "date_str": prev_activity.date_str,
                "time_str": prev_activity.time_str,
                "timestamp": prev_activity.timestamp,
                "image_path": image_path
            })
    
    paginated_results = results[skip: skip + limit]
    return paginated_results