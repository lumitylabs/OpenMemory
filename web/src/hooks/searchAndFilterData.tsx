import axios from "axios";

export const searchAndFilterData = async (search:any, state:any, selectedProcess:any, setFilteredTimestamps:any, selectedMemoryId:number) => {
    const searchQuery = search; // Fetch from input
    const startTime = Math.floor(state[0].startDate.getTime() / 1000); // Fetch from input
    // ADD 23:59:59 to end date
    const endTime = Math.floor(state[0].endDate.getTime() / 1000) + 86399; // Fetch from input
    const process = selectedProcess; // Fetch from input
    var base_url = `http://127.0.0.1:8000/vector_search/?search=${searchQuery}&start_time=${startTime}&end_time=${endTime}&process=${process}`;
    if (selectedMemoryId !== -1) {
      base_url += `&memory_id=${selectedMemoryId}`;
    }
    const response = await axios.get(base_url
      
    );
    const data = response.data; // assuming this is where your data array is
    const timestamps = data.map((item:any) => item.metadata.start_timestamp);
    setFilteredTimestamps(timestamps);
  };