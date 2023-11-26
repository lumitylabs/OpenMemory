import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchActivities } from "../hooks/fetchActivities";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { addDays } from "date-fns";
import { deduplicateArray } from "../utils/utils";
import { searchAndFilterData } from "../hooks/searchAndFilterData";
import { loadFilteredMemories } from "../hooks/loadFilteredMemories";
import { loadMoreFilteredMemories } from "../hooks/loadMoreFilteredMemories";
import { DataPickerModal } from "../components/home/search-bar/DataPickerModal";
import { FullSearchBar } from "../components/home/search-bar/FullSearchBar";
import ImgComponent from "../components/general/manager/img-manager/ImgComponent";
import { generativeSearch } from "../hooks/generativeSearch";
import { motion } from "framer-motion";
import { GenerativeAnswer } from "../components/general/GenerativeAnswer";
import { MemoryCard } from "./MemoryCard";

// Constants
const INITIAL_FETCH_COUNT = 20;
const MAX_MEMORIES_COUNT = 200;

function MemoryController() {
  const [memories, setMemories] = useState<any>([]);
  const [searchDone, setSearchDone] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filteredTimestamps, setFilteredTimestamps] = useState<number[]>([]);
  const stringProcesses = ["All Memories"];
  const [selectedProcess, setSelectedProcess] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1600);
  const [generativeAnswer, setGenerativeAnswer] = useState<string | null>(null);
  const [state, setState] = useState<any>([
    {
      startDate: addDays(new Date(), -30),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSearch = async () => {
    await searchAndFilterData(
      search,
      state,
      selectedProcess,
      setFilteredTimestamps
    );
    setSearchDone(true);
  };

  const fetchMoreData = async () => {
    if (memories.length >= MAX_MEMORIES_COUNT) {
      setHasMore(false);
      return;
    }

    const newActivities = await fetchActivities(
      memories.length,
      memories.length + 20
    );
    setMemories(memories.concat(newActivities));
  };

  const requestMoreFilteredMemories = async () => {
    await loadMoreFilteredMemories(
      memories,
      setMemories,
      MAX_MEMORIES_COUNT,
      setHasMore,
      filteredTimestamps
    );
  };

  useEffect(() => {
    loadFilteredMemories(filteredTimestamps, deduplicateArray, setMemories);
  }, [filteredTimestamps]);

  useEffect(() => {
    if (filteredTimestamps.length > 0) {
      setGenerativeAnswer("Loading...");
      generativeSearch(filteredTimestamps, search).then((res) => {
        setGenerativeAnswer(res);
      });
    }
  }, [filteredTimestamps]);

  useEffect(() => {
    const loadData = async () => {
      const newActivities = await fetchActivities(0, INITIAL_FETCH_COUNT);
      setMemories(newActivities);
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1600);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  var imgBase = "http://localhost:8000/screencaptures/";

  return (
    <div className="overflow-auto p-9">
      {/* Modal para seleção de data */}
      <DataPickerModal
        showModal={showModal}
        setShowModal={setShowModal}
        isLargeScreen={isLargeScreen}
        state={state}
        setState={setState}
      ></DataPickerModal>

      <FullSearchBar
        setSearch={setSearch}
        stringProcesses={stringProcesses}
        selectedProcess={selectedProcess}
        setSelectedProcess={setSelectedProcess}
        setShowModal={setShowModal}
        state={state[0]}
        handleSearch={handleSearch}
      ></FullSearchBar>

      {generativeAnswer !== null ? (
        generativeAnswer == "Loading..." ? (
          <div className="bg-[#000] border border-[#444444] rounded-[27px] p-9 mb-[81px]">
            <div className="inline-flex items-center gap-3 text-2xl font-Mada font-semibold tracking-tight">
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ImgComponent name="BlueBrain" type="brain-logo" />
              </motion.div>
              <div className="font-Muda bg-clip-text text-transparent bg-gradient-to-l from-[#CA76FF] to-[#23BDFF] looping-gradient">
                Generating...
              </div>
            </div>
            <div className="font-Muda font-semibold text-[#B3B3B3] 2xl:w-[1000px] lg:w-[500px] iphone5:w-[300px] w-[190px] mt-3 overflow-y-auto overflow-scroll-y max-h-[300px]">
              {generativeAnswer}
            </div>
          </div>
        ) : (
          <div className="bg-[#000] border border-[#444444] rounded-[27px] p-9 mb-[81px] ">
            <div className="inline-flex items-center gap-3 text-2xl font-Mada font-semibold  tracking-tight">
              <ImgComponent name="BlueBrain" type="brain-logo"></ImgComponent>
              <div className="fade-in-wrapper">
                <div className="font-Muda bg-clip-text text-transparent bg-gradient-to-l from-[#CA76FF] to-[#23BDFF]">
                  Generative AI Memory
                </div>
              </div>
            </div>
            <div className="text-[#B3B3B3] 2xl:w-[1000px] lg:w-[500px] iphone5:w-[300px] w-[190px] mt-3 overflow-y-auto overflow-scroll-y scrollbar-hide max-h-[300px]">
              <GenerativeAnswer text={generativeAnswer}></GenerativeAnswer>
            </div>
          </div>
        )
      ) : (
        ""
      )}

      <h1 className="font-Mada font-extrabold flex w-full text-[60px] text-[#333232] select-none">
        {searchDone ? "Related Idea" : "Latest Ideas"}
      </h1>

      <InfiniteScroll
        dataLength={memories.length}
        next={
          filteredTimestamps.length > 0
            ? requestMoreFilteredMemories
            : fetchMoreData
        }
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p className="flex font-Muda font-semibold justify-center text-[#333333] ml-12 select-none">
            <span>Yay! You have seen it all.</span>
          </p>
        }
      >
        {memories.map((memory: any, idx: any) => (
          <div className="flex items-center mb-12" key={idx}>
            <MemoryCard
              isLargeScreen={isLargeScreen}
              imgBase={imgBase}
              memory={memory}
              idx={idx}
            ></MemoryCard>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}
export default MemoryController;
