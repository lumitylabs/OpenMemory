import { SpinAnimation } from "../../general/utils";

export function SearchButton(props: any) {
  const buttonClasses = `font-Mada font-semibold select-none transition duration-300 ease-in-out font-regular text-[#000] px-2 rounded-full flex gap-4 items-center ${
    props.isSearchActive ? "bg-white" : "bg-[#3b3b3b]"
  } hover:bg-[#fafafa] hover:text-[#000] hover:border-[#fafafa]`;

  return (
    <div className="flex items-center justify-center h-full">
      {props.isSearching ? (
        <SpinAnimation height={18} width={18} />
      ) : (
        <button className={buttonClasses} onClick={props.handleSearch}>
          Ask AI
        </button>
      )}
    </div>
    
  );
}
