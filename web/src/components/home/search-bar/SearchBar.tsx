import MulticolorComponent from "../../general/manager/MulticolorComponent";

export function SearchBar(props: any) {
  return (
    <div className="flex gap-4 iphone5:w-[250px] 2xl:w-[600px]">
      <MulticolorComponent
        name="Search"
        baseColor="#E4E4E4"
        selectedColor="#E4E4E4"
        isSelected={false}
        classParameters="w-6 h-6" />
      <input
        className="bg-[#363636] resize-none outline-0 text-[#E4E4E4] w-full"
        placeholder="Search in memories..."
        onChange={(e) => props.setSearch(e.target.value)} />
    </div>
  );
}
