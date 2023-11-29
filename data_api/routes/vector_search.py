from fastapi import APIRouter
import model.databases
app = APIRouter()


@app.get("/vector_search/")
async def vector_search(search: str, start_time: int, end_time: int, process: str = "all", memory_id: int = None):
    print(search, start_time, end_time, process)
    where_clause = [
        {"start_timestamp": {"$gte": start_time}},
        {"start_timestamp": {"$lte": end_time}}
    ]

    if memory_id is not None:
        where_clause.append({"memory_id": {"$eq": memory_id}})

    retriever = model.databases.langchain_chroma.as_retriever(search_type="mmr", search_kwargs={"filter": {"$and": where_clause}, "k": 10, "fetch_k": 50})
    results = retriever.get_relevant_documents(search)
    return results