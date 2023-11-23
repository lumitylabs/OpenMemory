import shutil
import zipfile
import os
import json
from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from starlette.responses import FileResponse
from model.databases import AsyncSessionLocal, get_db
from model.models import Activity, AudioTranscriptions, RawIdeas, ScreenCapture

app = APIRouter()

@app.get("/export_memory/")
async def export_memory(memory_id: int, background_tasks: BackgroundTasks, db: AsyncSessionLocal = Depends(get_db)):
    async with db as session:
        # Query for activities
        activities_result = await session.execute(select(Activity).filter(Activity.memory_id == memory_id))
        activities = activities_result.scalars().all()

        # Query for audio transcriptions
        audio_transcriptions_result = await session.execute(select(AudioTranscriptions).filter(AudioTranscriptions.memory_id == memory_id))
        audio_transcriptions = audio_transcriptions_result.scalars().all()

        # Query for raw ideas
        raw_ideas_result = await session.execute(select(RawIdeas).filter(RawIdeas.memory_id == memory_id))
        raw_ideas = raw_ideas_result.scalars().all()

        # Query for screencaptures
        screencaptures_result = await session.execute(select(ScreenCapture).filter(ScreenCapture.memory_id == memory_id))
        screencaptures = screencaptures_result.scalars().all()

    # Serialize the data into JSON format
    data = {
        "activities": [activity.to_dict() for activity in activities],
        "audio_transcriptions": [audio.to_dict() for audio in audio_transcriptions],
        "raw_ideas": [idea.to_dict() for idea in raw_ideas],
        "screencaptures": [capture.to_dict() for capture in screencaptures]
    }
    
    # Create a temporary directory to store the data and images
    export_dir = f"temp_export_{memory_id}"
    os.makedirs(export_dir, exist_ok=True)

    # Write the data to a JSON file
    with open(f"{export_dir}/data.json", 'w') as f:
        json.dump(data, f)

    # Copy the relevant image files
    for screencapture in screencaptures:
        image_src_path = f"../client/data/screencapture/{screencapture.path}"
        image_dest_path = f"{export_dir}/{screencapture.path}"

        os.makedirs(os.path.dirname(image_dest_path), exist_ok=True)  # Cria subdiretórios, se necessário
        shutil.copy2(image_src_path, image_dest_path)

    # Create a zip file
    zip_path = f"{export_dir}.zip"
    with zipfile.ZipFile(zip_path, 'w') as zipf:
        for root, dirs, files in os.walk(export_dir):
            for file in files:
                file_path = os.path.join(root, file)
                
                # Verifica se o arquivo pertence à pasta de imagens
                if file_path.startswith(os.path.join(export_dir, "screencaptures")):
                    # Use os.path.relpath para criar a estrutura correta dentro do arquivo zip
                    zipf.write(file_path, os.path.relpath(file_path, os.path.join(export_dir, "screencaptures")))
                else:
                    # Mantenha a estrutura de diretórios para outros tipos de arquivos
                    zipf.write(file_path, os.path.relpath(file_path, export_dir))

    # Schedule the clean up of the exported directory after the response is completed
    background_tasks.add_task(shutil.rmtree, export_dir)

    return zip_path
