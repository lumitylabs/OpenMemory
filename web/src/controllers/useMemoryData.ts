import { useState, useEffect } from "react";
import axios from "axios";
import { GET_ACTIVIY_AND_RELATED_DATA } from "../repository/routes";


function useMemoryData(memoryId: string) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(GET_ACTIVIY_AND_RELATED_DATA, {
        params: { timestamp: memoryId },
      })
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, [memoryId]);

  return { data, isLoading };
}

export default useMemoryData;
