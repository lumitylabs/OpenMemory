import MemoryController from "../controllers/MemoryController";
import Sidebar from "../components/general/side-bar/Sidebar";

function Home() {
  return (
    <div className="flex bg-[#000]">
      <div className="flex">
        <Sidebar />
      </div>

      <div className="flex ml-[400px] w-full justify-center">
        <MemoryController />
      </div>
    </div>
  );
}

export default Home;
