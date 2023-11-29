import sys
import os
script_dir = os.path.dirname(os.path.abspath(__file__))
if script_dir not in sys.path:
    sys.path.append(script_dir)
import json
import requests
import sqlite3
from database_manager import DatabaseManager
import os
import datetime
import numpy as np
from langchain.embeddings.sentence_transformer import SentenceTransformerEmbeddings
import argparse

# Análise de argumentos
parser = argparse.ArgumentParser(description='Process summary text.')
parser.add_argument('--memory_id', type=int, help='Memory ID to process', default=None)
args = parser.parse_args()

current_directory = os.path.dirname(os.path.abspath(__file__))
embedding_function = SentenceTransformerEmbeddings(model_name="intfloat/multilingual-e5-large", model_kwargs = {'device': 'cuda'})




def aggregate_and_process(db_manager, memory_id=None):
    aggregated_content = ''
    last_timestamp = None
    start_timestamp = None
    end_timestamp = None
    start_date_str = None
    start_time_str = None

    query = "SELECT * FROM audio_transcriptions WHERE processed = FALSE"
    params = []

    if memory_id is not None:
        query += " AND memory_id = ?"
        params.append(memory_id)

    query += " ORDER BY timestamp;"

    with db_manager.conn:
        cursor = db_manager.conn.execute(query, tuple(params))
        ids_to_update = []
        for record in cursor:
            
            id, memory_id, date_str, time_str, type, content, timestamp, processes, processed = record
            ids_to_update.append(id)
            record_timestamp = timestamp

            if start_timestamp is None:
                start_timestamp = record_timestamp
                start_date_str = date_str
                start_time_str = time_str

            if last_timestamp is None:
                last_timestamp = record_timestamp
                aggregated_content = f"Audio from {processes}:{content}"
                continue

            time_difference = (record_timestamp - last_timestamp) / 60

            if time_difference < 1 or (time_difference <= 15 and is_topic_similar(aggregated_content, f"Audio from {processes}:{content}")):
                aggregated_content += f"\nAudio from {processes}:{content}"
            else:
                end_timestamp = last_timestamp
                process_aggregated_content(aggregated_content, db_manager, start_date_str, start_time_str, start_timestamp, end_timestamp, memory_id, ids_to_update)

                start_timestamp = record_timestamp
                start_date_str = date_str
                start_time_str = time_str
                aggregated_content = f"Audio from {processes}:{content}"

            last_timestamp = record_timestamp

        if aggregated_content:
            end_timestamp = last_timestamp
            process_aggregated_content(aggregated_content, db_manager, start_date_str, start_time_str, start_timestamp, end_timestamp, memory_id, ids_to_update)

def is_topic_similar(topic1, topic2):
    text1 = embedding_function.embed_query(topic1)
    text2 = embedding_function.embed_query(topic2)
    similarity = np.inner(np.array(text1), np.array(text2))
    threshold = 0.85
    return similarity > threshold

def process_aggregated_content(aggregated_content, db_manager, date_str, time_str, start_timestamp, end_timestamp, memory_id, ids_to_update):
    payload = {'data': aggregated_content}

    for _ in range(3):
        try:
            response = requests.post("http://127.0.0.1:8004/metadata-summary", data=payload)
            api_result = response.json()
            
            title = api_result.get("text_title")
            description = api_result.get("summary")

            if title is None or description is None:
                raise ValueError("Missing 'text_title' or 'summary' in the response")
            
            tags = ', '.join(api_result.get("tags", []))
            reminders = ', '.join(api_result.get("essential_reminders", []))
            unix_start_timestamp = start_timestamp
            unix_end_timestamp = end_timestamp
            
            db_manager.insert_activity(memory_id, title, description, tags, reminders, date_str, time_str, unix_start_timestamp)
            # Convertendo para timestamp Unix antes de salvar
            
            db_manager.insert_raw_idea(memory_id, aggregated_content, unix_start_timestamp, unix_end_timestamp)
            update_processed_records(db_manager, ids_to_update)
            ids_to_update.clear()
            return
        except Exception as e:
            #print(e)
            ids_to_update.clear()
            continue

def update_processed_records(db_manager, ids):
    placeholders = ', '.join(['?'] * len(ids))
    query = f"UPDATE audio_transcriptions SET processed = TRUE WHERE id IN ({placeholders})"
    db_manager.conn.execute(query, ids)

db_manager = DatabaseManager()
aggregate_and_process(db_manager, args.memory_id)
