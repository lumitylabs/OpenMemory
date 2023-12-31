import React from "react";
import { SearchBar } from "./SearchBar";
import { SelectProcess } from "./SelectProcess";
import { CalendarButton } from "./CalendarButton";
import { SearchButton } from "./SearchButton";

export const FullSearchBar = (props: any) => {
  const [isSearchActive, setIsSearchActive] = React.useState(false);
  const [isSearching, setIsSearching] = React.useState(false);

  const handleSearch = async () => {
    if(isSearching) return;
    setIsSearching(true);
    await props.handleSearch(props.search);
    setIsSearching(false);
  };

  const handleSetSearch = (value: string) => {
    props.setSearch(value);
    setIsSearchActive(value.length > 0);
  };

  return (
    <div className="flex gap-3 xl:gap-4 lg:gap-2 mb-10 iphone5:mb-14 xl:mb-[45px] flex-wrap xl:flex-nowrap">
      <div className="flex justify-between w-full rounded-[18px] gap-4 p-3 pl-6 pr-6 border hover:shadow-none border-[#444444] hover:border-[#44444] shadow-2xl shadow-[#333333] focus:shadow-none transition duration-300 ease-in-out">
        <SearchBar
          setSearch={handleSetSearch}
          handleSearch={handleSearch}
        ></SearchBar>

        <SearchButton
          handleSearch={handleSearch}
          isSearchActive={isSearchActive}
          isSearching={isSearching}
        ></SearchButton>
      </div>
      <SelectProcess
        memoriesList={props.memoriesList}
        selectedMemoryId={props.selectedMemoryId}
        setSelectedMemoryId={props.setSelectedMemoryId}
      ></SelectProcess>
      <div className="flex gap-3 lg:gap-4">
        <CalendarButton
          setShowModal={props.setShowModal}
          state={props.state}
        ></CalendarButton>
      </div>
    </div>
  );
};
