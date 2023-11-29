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

    # Add filter for memory_id if provided
    if memory_id is not None:
        where_clause.append({"memory_id": {"$eq": memory_id}})

    # Uncomment and modify this part if you want to filter by process
    # if process != "all":
    #     where_clause.append({"$or": [{"process_1": {"$eq": process}}, {"process_2": {"$eq": process}}, {"process_3": {"$eq": process}}]})

    retriever = model.databases.langchain_chroma.as_retriever(search_type="mmr", search_kwargs={"filter": {"$and": where_clause}, "k": 10, "fetch_k": 50})
    results = retriever.get_relevant_documents(search)
    return results