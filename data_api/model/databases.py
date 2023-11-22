import chromadb
from langchain.vectorstores import Chroma
from langchain.embeddings.sentence_transformer import SentenceTransformerEmbeddings
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker



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
    
DATABASE_URL = "sqlite:///../client/model/database.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()
langchain_chroma = None
embedding_function = SentenceTransformerEmbeddings(model_name="intfloat/multilingual-e5-large", model_kwargs = {'device': 'cuda'})
load_vector_database()