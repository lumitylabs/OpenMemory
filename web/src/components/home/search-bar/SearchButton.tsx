export function SearchButton(props: any) {
  // Aplica a cor de fundo branca se isSearchActive for true
  const buttonClasses = `font-Muda select-none transition duration-300 ease-in-out font-regular text-[#000] px-2 rounded-full flex gap-4 items-center ${
    props.isSearchActive ? "bg-white" : "bg-[#3b3b3b]"
  } hover:bg-[#fafafa] hover:text-[#000] hover:border-[#fafafa]`;

  return (
    <button className={buttonClasses} onClick={props.handleSearch}>
      search
    </button>
  );
}
