import sqlite3
import os
from datetime import datetime

current_directory = os.path.dirname(os.path.abspath(__file__))
database_path = os.path.join(current_directory, "database.db")

class DatabaseManager:
    def __init__(self):
        self.conn = sqlite3.connect(database_path)
        self.create_tables()

    def create_tables(self):
        with self.conn:
            self.conn.execute("""
                CREATE TABLE IF NOT EXISTS memory (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT
                );
            """)
            self.conn.execute("""
                INSERT INTO memory (id, name) VALUES (0, 'default') 
                ON CONFLICT(id) DO NOTHING;
            """)
            self.conn.execute("""
                CREATE TABLE IF NOT EXISTS audio_transcriptions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    memory_id INTEGER,
                    date_str TEXT,
                    time_str TEXT,
                    type TEXT,
                    content TEXT,
                    timestamp INTEGER,
                    processes TEXT,
                    processed BOOLEAN DEFAULT FALSE,
                    FOREIGN KEY (memory_id) REFERENCES memory(id)
                );
            """)
            self.conn.execute("""
                CREATE TABLE IF NOT EXISTS screencapture (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    memory_id INTEGER,
                    timestamp INTEGER,
                    path TEXT,
                    start_date INTEGER,
                    end_date INTEGER,
                    transcription TEXT,
                    processes TEXT,
                    FOREIGN KEY (memory_id) REFERENCES memory(id)
                );
            """)
            self.conn.execute("""
                CREATE TABLE IF NOT EXISTS activities (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    memory_id INTEGER,
                    title TEXT,
                    description TEXT,
                    tags TEXT,
                    reminders TEXT,
                    date_str TEXT,
                    time_str TEXT,
                    timestamp INTEGER,
                    processed BOOLEAN DEFAULT FALSE,
                    FOREIGN KEY (memory_id) REFERENCES memory(id)
                );
            """)
            self.conn.execute("""
                CREATE TABLE IF NOT EXISTS raw_ideas (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    memory_id INTEGER,
                    content TEXT,
                    start_timestamp INTEGER,
                    end_timestamp INTEGER,
                    processed BOOLEAN DEFAULT FALSE,
                    FOREIGN KEY (memory_id) REFERENCES memory(id)
                );
            """)
            # Creating indexes
            self.conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_raw_ideas_start_timestamp ON raw_ideas (start_timestamp);
            """)
            self.conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_raw_ideas_end_timestamp ON raw_ideas (end_timestamp);
            """)
            self.conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_audio_transcriptions_timestamp ON audio_transcriptions (timestamp);
            """)
            self.conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_screencapture_timestamp ON screencapture (timestamp);
            """)
            self.conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities (timestamp);
            """)
            self.conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_audio_transcriptions_processed ON audio_transcriptions (processed);
            """)
            self.conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_activities_processed ON activities (processed);
            """)
            self.conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_raw_ideas_processed ON raw_ideas (processed);
            """)

    # Insert methods with memory_id
    def insert_raw_idea(self, memory_id, content, start_timestamp, end_timestamp):
        with self.conn:
            self.conn.execute("""
                INSERT INTO raw_ideas (memory_id, content, start_timestamp, end_timestamp, processed)
                VALUES (?, ?, ?, ?, ?);
            """, (memory_id, content, start_timestamp, end_timestamp, False))
            
    def insert_activity(self, memory_id, title, description, tags, reminders, date_str, time_str, timestamp):
        with self.conn:
            self.conn.execute("""
                INSERT INTO activities (memory_id, title, description, tags, reminders, date_str, time_str, timestamp, processed)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (memory_id, title, description, tags, reminders, date_str, time_str, timestamp, False))

    def insert_audio_transcription(self, memory_id, date_str, time_str, type, content, processes):
        timestamp = datetime.strptime(f"{date_str} {time_str}", "%m%d%Y %H:%M:%S").timestamp()
        with self.conn:
            self.conn.execute("""
                INSERT INTO audio_transcriptions (memory_id, date_str, time_str, type, content, timestamp, processes, processed)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            """, (memory_id, date_str, time_str, type, content, int(timestamp), processes, False))

    def insert_screencapture(self, memory_id, timestamp, path, start_date, end_date, processes):
        with self.conn:
            self.conn.execute("""
                INSERT INTO screencapture (memory_id, timestamp, path, start_date, end_date, transcription, processes)
                VALUES (?, ?, ?, ?, ?, ?, ?);
            """, (memory_id, timestamp, path, start_date, end_date, "", processes))

    # Update screencapture
    def update_screencapture(self, prev_end_date, new_path, new_end_date):
        with self.conn:
            self.conn.execute("""
                UPDATE screencapture SET path = ?, end_date = ? WHERE end_date = ?;
            """, (new_path, new_end_date, prev_end_date))

    # Query data
    def query_data(self, date_str, type):
        with self.conn:
            cur = self.conn.execute("""
                SELECT * FROM audio_transcriptions WHERE date_str = ? AND type = ?;
            """, (date_str, type))
            return cur.fetchall()
