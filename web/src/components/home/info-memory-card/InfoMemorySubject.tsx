import React, { useState, useEffect, useRef } from 'react';

type InfoMemorySubjectProps = {
  tags: string;
};

export function InfoMemorySubject({ tags }: InfoMemorySubjectProps) {
  const [visibleTags, setVisibleTags] = useState<string[]>([]);
  const containerRef:any = useRef<HTMLDivElement>(null);
  const previousTagsRef:any = useRef<string>('');

  useEffect(() => {
    if (tags !== previousTagsRef.current) {
      previousTagsRef.current = tags;
      const tagsArray = tags.split(', ');

      if (containerRef.current) {
        let availableWidth = containerRef.current.offsetWidth;
        const newVisibleTags: string[] = [];

        tagsArray.forEach(tag => {
          const span = document.createElement('span');
          span.textContent = tag;
          containerRef.current.appendChild(span);
          if (span.offsetWidth <= availableWidth) {
            newVisibleTags.push(tag);
            availableWidth -= span.offsetWidth;
          }
          containerRef.current.removeChild(span);
        });

        setVisibleTags(newVisibleTags);
      }
    }
  }, [tags]);

  return (
    <div ref={containerRef} className="font-Mada leading-none font-medium text-[16px] tracking-tight text-[#989898] w-[250px] max-w-[250px] overflow-hidden flex justify-end items-center">
      {visibleTags.map((tag, index) => (
        <span key={index}>
          {tag}{index < visibleTags.length - 1 ? ', ' : ''}
        </span>
      ))}
    </div>
  );
}
