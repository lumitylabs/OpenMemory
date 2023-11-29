import chromadb
from langchain.vectorstores import Chroma
from langchain.embeddings.sentence_transformer import SentenceTransformerEmbeddings
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import sys
import subprocess


class VectorDB:
    def __init__(self):
        self.chroma = None
        self.retriever = None

    def load_vector_db(self):
        if self.chroma:
            self.chroma._client.clear_system_cache()
        self.chroma = None
        self.retriever = None
        
        import gc
        gc.collect()
        persist_directory = '../client/model/chroma'
        persistent_client = chromadb.PersistentClient(persist_directory)  
        collection_name = "raw_ideas"
        
        
        self.chroma = Chroma(
            client=persistent_client,
            collection_name=collection_name,
            embedding_function=embedding_function
        )
        print("Loaded vector DB")


    def get_retriever(self, where_clause=None):
        print("Getting retriever")
        print (where_clause)
        print (self.retriever)
        if not self.retriever:
            self.retriever = self.chroma.as_retriever(
                search_type="mmr", search_kwargs={"filter": {"$and": where_clause}, "k": 10, "fetch_k": 50}
            )
            
        return self.retriever

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

    
databaseManager = "../client/model/initialize_database_manager.py"
command = f"{sys.executable} {databaseManager}"
process = subprocess.Popen(command)
DATABASE_URL = "sqlite+aiosqlite:///../client/model/database.db"
async_engine = create_async_engine(DATABASE_URL)
AsyncSessionLocal = sessionmaker(bind=async_engine, class_=AsyncSession)

manager = VectorDB()
embedding_function = SentenceTransformerEmbeddings(model_name="intfloat/multilingual-e5-large", model_kwargs = {'device': 'cuda'})
manager.load_vector_db()
chroma = manager.chroma

