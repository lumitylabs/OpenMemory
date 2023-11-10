import axios from "axios";

export const generativeSearch = async (filteredTimestamps:any, question:any) => {
    const timestamps = filteredTimestamps;
    if (timestamps && timestamps.length > 0) {
      const response = await axios.get(
        `http://127.0.0.1:8000/getAudioTranscriptionsAndSend/?timestamps=${timestamps.join(
          ","
        )}&question=${question}`
      );
      return response.data;
    }
  };