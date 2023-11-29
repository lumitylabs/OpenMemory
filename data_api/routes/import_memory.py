import zipfile
import os
import json
from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from model.databases import AsyncSessionLocal, get_db
from model.models import Memory, Activity, AudioTranscriptions, RawIdeas, ScreenCapture
import shutil
import aiofiles
import asyncio

from routes.processors.process_vector_database import process_vector_database

app = APIRouter()

@app.post("/import_memory/")
async def import_memory(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    temp_dir = "temp_import"
    os.makedirs(temp_dir, exist_ok=True)

    zip_path = os.path.join(temp_dir, file.filename)
    async with aiofiles.open(zip_path, "wb") as zip_file:
        await zip_file.write(await file.read())

    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(temp_dir)

    with open(os.path.join(temp_dir, 'data.json'), 'r') as json_file:
        data = json.load(json_file)

    async with db as session:
        memory_name = os.path.splitext(file.filename)[0]
        new_memory = Memory(name=memory_name)
        session.add(new_memory)
        await session.flush()
        new_memory_id = new_memory.id
        await session.commit()
        
        await session.refresh(new_memory)

        for activity_data in data["activities"]:
            activity_data.pop('memory_id', None)
            activity_data.pop('id', None)
            activity = Activity(**activity_data, memory_id=new_memory_id)
            session.add(activity)

        for audio_data in data["audio_transcriptions"]:
            audio_data.pop('memory_id', None)
            audio_data.pop('id', None)
            audio_transcription = AudioTranscriptions(**audio_data, memory_id=new_memory_id)
            session.add(audio_transcription)

        for raw_idea_data in data["raw_ideas"]:
            raw_idea_data.pop('memory_id', None)
            raw_idea_data.pop('id', None)
            raw_idea = RawIdeas(**raw_idea_data, memory_id=new_memory_id)
            raw_idea.processed = False
            session.add(raw_idea)

        for screencapture_data in data["screencaptures"]:
            original_path = screencapture_data.get("path")
            screencapture_data.pop('id', None)

            file_extension = os.path.splitext(original_path)[1]
            timestamp = screencapture_data.get("timestamp")
            new_file_name = f"{new_memory_id}/{timestamp}{file_extension}"
            
            screencapture = ScreenCapture(**screencapture_data)
            screencapture.path = new_file_name
            screencapture.memory_id = new_memory_id
            session.add(screencapture)

            image_src_path = os.path.join(temp_dir, original_path)
            image_dest_path = os.path.join('../client/data/screencapture', new_file_name)

            os.makedirs(os.path.dirname(image_dest_path), exist_ok=True)
            shutil.move(image_src_path, image_dest_path)

        await session.commit()

    os.remove(zip_path)
    shutil.rmtree(temp_dir)
    await process_vector_database(new_memory_id)

    return {"message": "Memory imported successfully", "new_memory_id": new_memory_id}


async def handle_images(screencaptures, temp_dir, new_memory_id):
    for screencapture_data in screencaptures:
        original_path = screencapture_data["path"]
        new_path = os.path.join('../client/data/screencapture', f'{new_memory_id}_{os.path.basename(original_path)}')

        os.makedirs(os.path.dirname(new_path), exist_ok=True)
        await asyncio.get_event_loop().run_in_executor(None, shutil.copy2, os.path.join(temp_dir, original_path), new_path)