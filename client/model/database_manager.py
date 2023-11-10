import sqlite3
import os
from datetime import datetime

current_directory = os.path.dirname(os.path.abspath(__file__))
database_path = os.path.join(current_directory, "database.db")


class DatabaseManager:
    def __init__(self):
        print(database_path)
        self.conn = sqlite3.connect(database_path)
        self.create_tables()

    def create_tables(self):
        with self.conn:
            self.conn.execute("""
                CREATE TABLE IF NOT EXISTS audio_transcriptions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    date_str TEXT,
                    time_str TEXT,
                    type TEXT,
                    content TEXT,
                    timestamp INTEGER,
                    processes TEXT
                );
            """)
        with self.conn:
            self.conn.execute("""
                CREATE TABLE IF NOT EXISTS screencapture (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp INTEGER,
                    path TEXT,
                    start_date INTEGER,
                    end_date INTEGER,
                    transcription TEXT,
                    processes TEXT
                );
            """)
        with self.conn:
            self.conn.execute("""
                CREATE TABLE IF NOT EXISTS activities (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT,
                    description TEXT,
                    tags TEXT,
                    reminders TEXT,
                    date_str TEXT,
                    time_str TEXT,
                    timestamp INTEGER
                );
            """)
        with self.conn:
            self.conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_audio_transcriptions_timestamp ON audio_transcriptions (timestamp);
            """)
            self.conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_screencapture_timestamp ON screencapture (timestamp);
            """)
            self.conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities (timestamp);
            """)

    def insert_activity(self, title, description, tags, reminders, date_str, time_str):
        timestamp = datetime.strptime(f"{date_str} {time_str}", "%m%d%Y %H:%M:%S").timestamp()
        with self.conn:
            self.conn.execute("""
                INSERT INTO activities (title, description, tags, reminders, date_str, time_str, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?);
            """, (title, description, tags, reminders, date_str, time_str, int(timestamp)))

    def insert_audio_transcription(self, date_str, time_str, type, content, processes):
        timestamp = datetime.strptime(f"{date_str} {time_str}", "%m%d%Y %H:%M:%S").timestamp()
        with self.conn:
            self.conn.execute("""
                INSERT INTO audio_transcriptions (date_str, time_str, type, content, timestamp, processes)
                VALUES (?, ?, ?, ?, ?, ?);
            """, (date_str, time_str, type, content, int(timestamp), processes))

    def insert_screencapture(self, timestamp, path, start_date, end_date, processes):
        with self.conn:
            self.conn.execute("""
                INSERT INTO screencapture (timestamp, path, start_date, end_date, transcription, processes)
                VALUES (?, ?, ?, ?, ?, ?);
            """, (timestamp, path, start_date, end_date, "", processes))

    def update_screencapture(self, prev_end_date, new_path, new_end_date):
        with self.conn:
            self.conn.execute("""
                UPDATE screencapture SET path = ?, end_date = ? WHERE end_date = ?;
            """, (new_path, new_end_date, prev_end_date))
            
    def query_data(self, date_str, type):
        # You can optimize this query based on your specific needs
        with self.conn:
            cur = self.conn.execute("""
                SELECT * FROM audio_transcriptions WHERE date_str = ? AND type = ?;
            """, (date_str, type))
            return cur.fetchall()
