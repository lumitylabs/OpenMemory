import json
import requests
import sqlite3
from database_manager import DatabaseManager
import os
from tokenizer import ExLlamaTokenizer
import datetime
import numpy as np
from langchain.embeddings.sentence_transformer import SentenceTransformerEmbeddings

current_directory = os.path.dirname(os.path.abspath(__file__))
last_processed_record_path = os.path.join(current_directory,"last_processed_record.json")
template_path = os.path.join(current_directory, "template.txt")
tokenizer_path = os.path.join(current_directory, "tokenizer.model")
tokenizer = ExLlamaTokenizer(tokenizer_path)
embedding_function = SentenceTransformerEmbeddings(model_name="intfloat/multilingual-e5-large", model_kwargs = {'device': 'cuda'})



def init_last_processed_record():
    try:
        with open(last_processed_record_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        with open(last_processed_record_path, 'w') as f:
            json.dump({"audio_transcriptions": -1}, f)
        return {"audio_transcriptions": -1}

def load_template(file_path):
    with open(file_path, 'r') as f:
        return f.read()
    
def parse_datetime(date_str, time_str):
    return datetime.datetime.strptime(f"{date_str} {time_str}", "%m%d%Y %H:%M:%S")


def aggregate_and_process(db_manager, last_processed_record):
    last_processed_id = last_processed_record.get("audio_transcriptions", -1)
    aggregated_content = ''
    last_timestamp = None
    last_topic_group = []
    current_topic_group = []
    full_first_time_str = ''
    first_date_str = ''
    with db_manager.conn:
        cursor = db_manager.conn.execute("SELECT * FROM audio_transcriptions WHERE id > ?;", (last_processed_id,))
        for record in cursor:
            id, date_str, time_str, type, content, timestamp, processes = record
            record_timestamp = parse_datetime(date_str, time_str)
            if not full_first_time_str:
                full_first_time_str = time_str
                first_date_str = date_str
            if last_timestamp is None:
                last_timestamp = record_timestamp
                last_topic_group.append(f"Audio from {processes}:{content}")
                aggregated_content = f"Audio from {processes}:{content}"
                continue

            time_difference = (record_timestamp - last_timestamp).total_seconds() / 60
            if time_difference < 1:
                last_topic_group.append(f"Audio from {processes}:{content}")
                aggregated_content += f"\nAudio from {processes}:{content}"
            elif time_difference <= 15:
                if is_topic_similar(' '.join(last_topic_group), ' '.join(current_topic_group)):
                    last_topic_group.extend(current_topic_group)
                    aggregated_content += f"\nAudio from {processes}:{content}"
                else:
                    process_aggregated_content(aggregated_content, db_manager, first_date_str, full_first_time_str)
                    last_processed_record["audio_transcriptions"] = id - 1 
                    update_last_processed_record(last_processed_record)
                    full_first_time_str = time_str
                    first_date_str = date_str
                    
                    aggregated_content = f"Audio from {processes}:{content}"
                    last_topic_group = [content]
            else:
                process_aggregated_content(aggregated_content, db_manager, first_date_str, full_first_time_str)
                last_processed_record["audio_transcriptions"] = id - 1
                update_last_processed_record(last_processed_record)
                full_first_time_str = time_str
                first_date_str = date_str
                
                aggregated_content = f"Audio from {processes}:{content}"
                last_topic_group = [content]
            
            last_timestamp = record_timestamp

        if aggregated_content:
            process_aggregated_content(aggregated_content, db_manager, first_date_str, full_first_time_str)
            last_processed_record["audio_transcriptions"] = id
            update_last_processed_record(last_processed_record)


def is_topic_similar(topic1, topic2):
    text1 = embedding_function.embed_query(topic1)
    text2 = embedding_function.embed_query(topic2)
    similarity = np.inner(np.array(text1), np.array(text2))
    threshold = 0.85
    return similarity > threshold


def process_aggregated_content(aggregated_content, db_manager, date_str, time_str):
    payload = {'data': aggregated_content}


    for _ in range(3):
        try:
            response = requests.post("http://127.0.0.1:8004/metadata-summary", data=payload)
            api_result = response.json()
            #print(api_result)
            
            title = api_result.get("text_title")
            description = api_result.get("summary")

            if title is None or description is None:
                raise ValueError("Missing 'text_title' or 'summary' in the response")
            
            tags = ', '.join(api_result.get("tags", []))
            reminders = ', '.join(api_result.get("essential_reminders", []))
            
            db_manager.insert_activity(title, description, tags, reminders, date_str, time_str)
            return
        except Exception as e:
            #print(e)
            continue
    #print(response.text)
    #print("Skipping the batch as API result did not contain expected format even after 3 retries.")

def update_last_processed_record(last_processed_record):
    with open(last_processed_record_path, 'w') as f:
        json.dump(last_processed_record, f)

last_processed_record = init_last_processed_record()
db_manager = DatabaseManager()
aggregate_and_process(db_manager, last_processed_record)