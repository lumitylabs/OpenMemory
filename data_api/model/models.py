from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import List
from sqlalchemy import DDL
from .databases import engine

Base = declarative_base()

class Memory(Base):
    __tablename__ = 'memory'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

class Activity(Base):
    __tablename__ = 'activities'
    id = Column(Integer, primary_key=True, index=True)
    memory_id = Column(Integer, ForeignKey('memory.id'))
    title = Column(String)
    description = Column(String)
    tags = Column(String)
    reminders = Column(String)
    date_str = Column(String)
    time_str = Column(String)
    timestamp = Column(Float)
    processed = Column(Boolean, default=False, index=True)
    memory = relationship("Memory")

class AudioTranscriptions(Base):
    __tablename__ = 'audio_transcriptions'
    id = Column(Integer, primary_key=True, index=True)
    memory_id = Column(Integer, ForeignKey('memory.id'))
    date_str = Column(String)
    time_str = Column(String)
    type = Column(String)
    content = Column(String)
    timestamp = Column(Integer, index=True)
    processes = Column(String)
    processed = Column(Boolean, default=False, index=True)
    memory = relationship("Memory")

class RawIdeas(Base):
    __tablename__ = 'raw_ideas'
    id = Column(Integer, primary_key=True, index=True)
    memory_id = Column(Integer, ForeignKey('memory.id'))
    content = Column(String)
    start_timestamp = Column(Integer, index=True)
    end_timestamp = Column(Integer, index=True)
    processed = Column(Boolean, default=False, index=True)
    memory = relationship("Memory")

class ScreenCapture(Base):
    __tablename__ = 'screencapture'
    timestamp = Column(Float, primary_key=True, index=True)
    memory_id = Column(Integer, ForeignKey('memory.id'))
    path = Column(String)
    processes = Column(String)
    memory = relationship("Memory")

class VectorSearchResults(BaseModel):
    metadatas: List[dict]
    documents: List[str]
    distances: List[float]

# Create an index if it doesn't exist
create_index = DDL("CREATE INDEX IF NOT EXISTS idx_timestamp ON audio_transcriptions (timestamp)")

# Execute the DDL instruction
with engine.begin() as conn:
    conn.execute(create_index)
