import axios from "axios";
import { deduplicateArray } from "../utils/utils";

export const loadMoreFilteredMemories = async (
  memories: any,
  setMemories: any,
  MAX_MEMORIES_COUNT: any,
  setHasMore: any,
  filteredTimestamps: any,
  selectedMemoryId: number
) => {
  if (memories.length >= MAX_MEMORIES_COUNT) {
    setHasMore(false);
    return;
  }

  const timestamps = filteredTimestamps;

  var base_url = `http://127.0.0.1:8000/getFilteredAudioTranscriptions/?filter_timestamps=${timestamps.join(
    ","
  )}&skip=${memories.length}&limit=20`;

  if (selectedMemoryId !== -1) {
    base_url += `&memory_id=${selectedMemoryId}`;
  }

  const response = await axios.get(base_url);
  const newMemories = response.data;

  // Create a Set of existing memory timestamps for quick lookup
  const existingTimestamps = new Set(
    memories.map((memory: any) => memory.timestamp)
  );
  const uniqueNewMemoriesFilter = deduplicateArray(newMemories, "timestamp");
  // Filter out new memories that are already present
  const uniqueNewMemories = uniqueNewMemoriesFilter.filter(
    (memory: any) => !existingTimestamps.has(memory.timestamp)
  );

  if (uniqueNewMemories.length > 0) {
    setMemories(memories.concat(uniqueNewMemories));
  } else {
    setHasMore(false);
  }
};
