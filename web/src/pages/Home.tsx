
import MemoryController from "../controllers/MemoryController";
import Navbar from "../components/Navbar";
import ChatUI from "../components/general/ChatUI";

function Home() {
  return (
    <div className="flex flex-col h-screen bg-[#1B1B1B] font-NotoSansDisplay">
      <Navbar />
      <div className="flex mt-32">
        <div className="mt-12 md:w-3/4 w-full">
            <MemoryController />
        </div>
        
        <div className="fixed right-0 top-0 h-screen md:inline-block hidden overflow-y-auto md:w-1/4">
          <ChatUI />
        </div>
      </div>
    </div>
  );
}

export default Home;
