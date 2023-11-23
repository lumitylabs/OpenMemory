import chromadb
from langchain.vectorstores import Chroma
from langchain.embeddings.sentence_transformer import SentenceTransformerEmbeddings
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker



async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

def load_vector_database():
    global langchain_chroma
    persist_directory = '../client/model/chroma'
    persistent_client = chromadb.PersistentClient(persist_directory)
    collection_name = "raw_ideas"
    langchain_chroma = Chroma(
        client=persistent_client,
        collection_name=collection_name,
        embedding_function=embedding_function,
)
    
DATABASE_URL = "sqlite+aiosqlite:///../client/model/database.db"
async_engine = create_async_engine(DATABASE_URL)
AsyncSessionLocal = sessionmaker(bind=async_engine, class_=AsyncSession)

langchain_chroma = None
embedding_function = SentenceTransformerEmbeddings(model_name="intfloat/multilingual-e5-large", model_kwargs = {'device': 'cuda'})
load_vector_database()