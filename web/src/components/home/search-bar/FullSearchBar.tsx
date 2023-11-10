import { SearchBar } from "./SearchBar";
import { SelectProcess } from "./SelectProcess";
import { CalendarButton } from "./CalendarButton";
import { SearchButton } from "./SearchButton";

export const FullSearchBar = (props: any) => {
  return (
    <div className="flex items-center justify-center gap-3 xl:gap-1 lg:gap-2 mb-10 iphone5:mb-14 xl:mb-20 flex-wrap">
      <div className="flex items-center gap-4 p-3 pl-6 pr-6 bg-[#363636] rounded-full">
        <SearchBar setSearch={props.setSearch}></SearchBar>
        <SelectProcess
          stringProcesses={props.stringProcesses}
          selectedProcess={props.selectedProcess}
          setSelectedProcess={props.setSelectedProcess}
        ></SelectProcess>
      </div>
      <div className="flex gap-3 lg:gap-6">
        <CalendarButton
          setShowModal={props.setShowModal}
          state={props.state}
        ></CalendarButton>

        <SearchButton handleSearch={props.handleSearch}></SearchButton>
      </div>
    </div>
  );
};
