from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel
from typing import List

Base = declarative_base()

class Activity(Base):
    __tablename__ = 'activities'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    tags = Column(String)
    reminders = Column(String)
    date_str = Column(String)
    time_str = Column(String)
    timestamp = Column(Float)

class AudioTranscriptions(Base):
    __tablename__ = 'audio_transcriptions'
    id = Column(Integer, primary_key=True, index=True)
    date_str = Column(String)
    time_str = Column(String)
    type = Column(String)
    content = Column(String)
    timestamp = Column(Integer, index=True)
    processes = Column(String)


class ScreenCapture(Base):
    __tablename__ = 'screencapture'
    timestamp = Column(Float, primary_key=True, index=True)
    path = Column(String)
    processes = Column(String)

class VectorSearchResults(BaseModel):
    metadatas: List[dict]
    documents: List[str]
    distances: List[float]

from sqlalchemy import DDL, MetaData

from databases import engine

# Crie uma instrução DDL para criar o índice, se ele ainda não existir
create_index = DDL("CREATE INDEX IF NOT EXISTS idx_timestamp ON audio_transcriptions (timestamp)")

# Execute a instrução DDL
with engine.begin() as conn:
    conn.execute(create_index)