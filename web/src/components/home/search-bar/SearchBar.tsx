import MulticolorComponent from "../../general/manager/svg-manager/MulticolorComponent";

export function SearchBar(props: any) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      props.handleSearch();
    }
  };

  return (
    <div className="flex gap-4 iphone5:w-[250px] 2xl:w-[600px]">
      <input
        className="bg-[#000] resize-none outline-0 font-Mada font-semibold text-[18px] placeholder:text-[#444444] text-[#fff] w-full"
        placeholder="Ask your memory..."
        onChange={(e) => props.setSearch(e.target.value)}
        onKeyDown={handleKeyDown} // Adiciona o manipulador de eventos onKeyDown aqui
      />
    </div>
  );
}
