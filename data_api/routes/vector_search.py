from fastapi import APIRouter
from databases import langchain_chroma

app = APIRouter()


@app.get("/vector_search/")
async def vector_search(search: str, start_time: int, end_time: int, process: str = "all"):
    print(search, start_time, end_time, process)
    where_clause = [
        {"timestamp": {"$gte": start_time}},
        {"timestamp": {"$lte": end_time}}
    ]
    if process != "all":
        where_clause.append({"$or": [{"process_1": {"$eq": process}}, {"process_2": {"$eq": process}}, {"process_3": {"$eq": process}}]})
    retriever = langchain_chroma.as_retriever(search_type="mmr",search_kwargs={"filter":{"$and": where_clause},"k":10, "fetch_k":50})
    results = retriever.get_relevant_documents(
    search
    )
    return results