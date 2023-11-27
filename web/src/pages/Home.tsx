import MemoryController from "../controllers/MemoryController";
import Sidebar from "../components/general/side-bar/Sidebar";
import { useRef } from "react";

function Home() {
  const reloadMemoriesRef = useRef<(() => void) | null>(null);

  return (
    <div className="flex bg-[#000]">
      <div className="flex">
        <Sidebar forceReloadMemories={() => reloadMemoriesRef.current && reloadMemoriesRef.current()} />
      </div>

      <div className="flex ml-[450px] w-full justify-center">
        <MemoryController onForceReload={(reloadFunc) => { reloadMemoriesRef.current = reloadFunc; }} />
      </div>
    </div>
  );
}

export default Home;