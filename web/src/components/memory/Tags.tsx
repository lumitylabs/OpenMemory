export const Tags = ({ tags }: { tags: string[] }) => (
    <div className="flex flex-wrap">
      {tags &&
        tags.map((tag: string, idx: number) => (
          <span
            key={idx}
            className="bg-[#1F1F1F] p-2 pl-3 pr-3 rounded-full text-[#A4A4A4] text-sm font-NotoSansDisplay overflow-hidden whitespace-normal"
          >
            {tag}
          </span>
        ))}
    </div>
  );