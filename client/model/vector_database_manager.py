import json
import chromadb
from database_manager import DatabaseManager
from chromadb.utils import embedding_functions

def init_last_synced_record():
    try:
        with open('last_synced_record.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        with open('last_synced_record.json', 'w') as f:
            json.dump({"audio_transcriptions": 0}, f)
        return {"audio_transcriptions": 0}
    

# Initialize ChromaDB client
client = chromadb.PersistentClient()
sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="intfloat/multilingual-e5-large", device="cuda")
collection = client.get_or_create_collection("all-my-documents", embedding_function=sentence_transformer_ef)




def update_chromadb_from_sqlite(db_manager, last_synced_record):
    # Fetch records after last synced ID for audio_transcriptions
    last_synced_id = last_synced_record["audio_transcriptions"]
    
    with db_manager.conn:
        cursor = db_manager.conn.execute("""
            SELECT * FROM audio_transcriptions WHERE id > ?;
        """, (last_synced_id,))
        records = cursor.fetchall()

    documents = []
    metadatas = []
    ids = []

    for record in records:
        id, date_str, time_str, type, content, timestamp, processes = record
        document = f"passage:{content}"
        split_processes = processes.split(',')
        first_three_processes = split_processes[:3]

        metadata = {
            "date_str": date_str,
            "time_str": time_str,
            "type": type,
            "content": content,
            "timestamp": timestamp
        }

        for i, process in enumerate(first_three_processes):
            metadata[f"process_{i+1}"] = process

        documents.append(document)
        metadatas.append(metadata)
        print(document)
        ids.append(id)

    # Add to ChromaDB
    if documents:
        collection.add(documents=documents, metadatas=metadatas, ids=[str(id) for id in ids])
        print(max(ids))
        # Update last synced ID
        last_synced_record["audio_transcriptions"] = max(ids)

        # Save to JSON file
        with open('last_synced_record.json', 'w') as f:
            json.dump(last_synced_record, f)

# Usage
last_synced_record = init_last_synced_record()
db_manager = DatabaseManager()
update_chromadb_from_sqlite(db_manager, last_synced_record)
