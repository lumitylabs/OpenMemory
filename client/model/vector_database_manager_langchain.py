import sys
import os
script_dir = os.path.dirname(os.path.abspath(__file__))
if script_dir not in sys.path:
    sys.path.append(script_dir)
from database_manager import DatabaseManager
from langchain.vectorstores import Chroma
from langchain.embeddings.sentence_transformer import SentenceTransformerEmbeddings
import chromadb



current_directory = os.path.dirname(os.path.abspath(__file__))
persist_directory = os.path.join(current_directory, "chroma")

# Initialize ChromaDB client
persistent_client = chromadb.PersistentClient(persist_directory)
embedding_f = SentenceTransformerEmbeddings(model_name="intfloat/multilingual-e5-large", model_kwargs={'device': 'cuda'})

collection_name_ideas = "raw_ideas"
langchain_chroma_ideas = Chroma(client=persistent_client, collection_name=collection_name_ideas)

def update_chromadb_from_sqlite(db_manager):
    with db_manager.conn:
        cursor_raw = db_manager.conn.execute("""
            SELECT * FROM raw_ideas WHERE processed = FALSE;
        """)
        records_raw = cursor_raw.fetchall()

        if not records_raw:
            return

        documents_raw = []
        metadatas_raw = []
        ids_raw = []

        for record in records_raw:
            id, memory_id, content, start_timestamp, end_timestamp, processed = record
            document = f"passage:{content}"
            
            metadata = {
                "memory_id": memory_id,
                "content": content,
                "start_timestamp": start_timestamp,
                "end_timestamp": end_timestamp
            }

            documents_raw.append(document)
            metadatas_raw.append(metadata)
            ids_raw.append(id)

        # Add raw_ideas to ChromaDB
        langchain_chroma_ideas.from_texts(collection_name=collection_name_ideas, texts=documents_raw, embedding=embedding_f, metadatas=metadatas_raw, ids=[str(id) for id in ids_raw], persist_directory=persist_directory)

        # Update processed state
        placeholders = ', '.join(['?'] * len(ids_raw))
        db_manager.conn.execute(f"UPDATE raw_ideas SET processed = TRUE WHERE id IN ({placeholders})", ids_raw)

# Usage
db_manager = DatabaseManager()
update_chromadb_from_sqlite(db_manager)
