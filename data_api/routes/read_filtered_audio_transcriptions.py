
from fastapi import APIRouter
from databases import db
from sqlalchemy import desc
from models import Activity, ScreenCapture
app = APIRouter()

@app.get("/getFilteredAudioTranscriptions/")
async def read_filtered_audio_transcriptions(skip: int = 0, limit: int = 20, filter_timestamps: str = ""):
    filter_timestamps = [float(x) for x in filter_timestamps.split(",")] if filter_timestamps else []
    results = []
    for ft in filter_timestamps:  # Iterate through each filter timestamp
        # Find the relevant activity whose timestamp <= ft and the next one's timestamp > ft
        prev_activity = db.query(Activity).filter(Activity.timestamp <= ft).order_by(desc(Activity.timestamp)).first()
        next_activity = db.query(Activity).filter(Activity.timestamp > ft).order_by(Activity.timestamp).first()
        
        if prev_activity and (not next_activity or next_activity.timestamp > ft):
            query = db.query(ScreenCapture).filter(ScreenCapture.timestamp >= prev_activity.timestamp).first()
            image_path = query.path if query else None
            results.append({
                "id": prev_activity.id,
                "title": prev_activity.title,
                "description": prev_activity.description,
                "tags": prev_activity.tags,
                "reminders": prev_activity.reminders,
                "date_str": prev_activity.date_str,
                "time_str": prev_activity.time_str,
                "timestamp": prev_activity.timestamp,
                "image_path": image_path
            })
    
    # Implement pagination on the filtered results
    paginated_results = results[skip: skip + limit]
    return paginated_results