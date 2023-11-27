export const Tags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-wrap">
    {tags &&
      tags.map((tag: string, idx: number) => (
        <span
          key={idx}
          className="bg-[#1a1a1a] p-2 pl-3 pr-3 mr-1 rounded-full text-[#A4A4A4] text-sm font-Mada font-semibold overflow-hidden whitespace-normal"
        >
          {tag}
        </span>
      ))}
  </div>
);
