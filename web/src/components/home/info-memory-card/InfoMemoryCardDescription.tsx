interface InfoMemoryCardDescriptionProps {
  description: string;
}

export function InfoMemoryCardDescription(props: InfoMemoryCardDescriptionProps) {
  const filterAndLimitDescription = (description: string): string => {
    return description
      .split('\n')
      .slice(0, 5)
      .map(line => {
        const parts = line.split(': ');
        return parts.length > 1 ? parts[1] : line;
      })
      .join('\n');
  };

  const filteredDescription = filterAndLimitDescription(props.description);

  return (
    <div className="xl:w-[300px] w-[150px] h-[100px] text-[#dadada] overflow-clip overflow-ellipsis font-Mada font-semibold tracking-tight xl:text-[18px] whitespace-pre-line">
      {filteredDescription}
    </div>
  );
}