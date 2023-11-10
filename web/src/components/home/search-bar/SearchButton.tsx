export function SearchButton(props: any) {
  return (
    <button
      className="text-[#E4E4E4] pl-8 pr-8 rounded-full flex gap-4 items-center border-2 hover:bg-[#fafafa] hover:text-[#000] hover:border-[#fafafa]"
      onClick={props.handleSearch}
    >
      Search
    </button>
  );
}
