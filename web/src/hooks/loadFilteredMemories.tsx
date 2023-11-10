import axios from "axios";

export const loadFilteredMemories = async (filteredTimestamps:any, deduplicateArray:any, setMemories:any) => {
    const timestamps = filteredTimestamps;
    if (timestamps && timestamps.length > 0) {
      const response = await axios.get(
        `http://127.0.0.1:8000/getFilteredAudioTranscriptions/?filter_timestamps=${timestamps.join(
          ","
        )}`
      );
      const newMemories = response.data;
      const uniqueNewMemories = deduplicateArray(newMemories, "timestamp");
      setMemories(uniqueNewMemories);
    }
  };