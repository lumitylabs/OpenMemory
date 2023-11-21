import sys
import os
script_dir = os.path.dirname(os.path.abspath(__file__))
if script_dir not in sys.path:
    sys.path.append(script_dir)
import json
from database_manager import DatabaseManager
from langchain.vectorstores import Chroma
import os
from langchain.embeddings.sentence_transformer import SentenceTransformerEmbeddings

import chromadb
current_directory = os.path.dirname(os.path.abspath(__file__))
last_synced_record_path = os.path.join(current_directory,"last_synced_record.json")
persist_directory = os.path.join(current_directory, "chroma")

def init_last_synced_record():
    try:
        with open(last_synced_record_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        with open(last_synced_record_path, 'w') as f:
            json.dump({"audio_transcriptions": 0, "raw_ideas": 0}, f)
        return {"audio_transcriptions": 0, "raw_ideas": 0}
    

# Initialize ChromaDB client

persistent_client = chromadb.PersistentClient(persist_directory)

embedding_f = SentenceTransformerEmbeddings(model_name="intfloat/multilingual-e5-large", model_kwargs = {'device': 'cuda'})


collection_name_ideas = "raw_ideas"
langchain_chroma_ideas = Chroma(
    client=persistent_client,
    collection_name=collection_name_ideas,
)


def update_chromadb_from_sqlite(db_manager, last_synced_record):
    # Fetch records for audio_transcriptions and raw_ideas
    last_synced_id_audio = last_synced_record["audio_transcriptions"]
    last_synced_id_raw = last_synced_record["raw_ideas"]

    with db_manager.conn:
        # Processing audio_transcriptions

        # Processing raw_ideas
        cursor_raw = db_manager.conn.execute("""
            SELECT * FROM raw_ideas WHERE id > ?;
        """, (last_synced_id_raw,))
        records_raw = cursor_raw.fetchall()

        documents_raw = []
        metadatas_raw = []
        ids_raw = []

        for record in records_raw:
            id, content, start_timestamp, end_timestamp = record
            document = f"passage:{content}"
            
            metadata = {
                "content": content,
                "start_timestamp": start_timestamp,
                "end_timestamp": end_timestamp
            }

            documents_raw.append(document)
            metadatas_raw.append(metadata)
            ids_raw.append(id)

        # Add raw_ideas to ChromaDB
        if documents_raw:
            langchain_chroma_ideas.from_texts(collection_name=collection_name_ideas, texts=documents_raw, embedding=embedding_f, metadatas=metadatas_raw, ids=[str(id) for id in ids_raw], persist_directory=persist_directory)
            last_synced_record["raw_ideas"] = max(ids_raw)

        # Save to JSON file
        with open(last_synced_record_path, 'w') as f:
            json.dump(last_synced_record, f)

# Usage
last_synced_record = init_last_synced_record()
db_manager = DatabaseManager()
update_chromadb_from_sqlite(db_manager, last_synced_record)