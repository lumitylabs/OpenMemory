import { useState, useEffect } from "react";

export const GenerativeAnswer = (props: { text: string }) => {
  const [lines, setLines] = useState<any>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const textLines: any = props.text
      .split("\n")
      .map((line) => line.split(" "));
    setLines(textLines);

    const interval = setInterval(() => {
      if (currentWordIndex >= lines[currentLineIndex]?.length - 1) {
        if (currentLineIndex < lines.length - 1) {
          setCurrentLineIndex((prevIndex) => prevIndex + 1);
          setCurrentWordIndex(0);
        } else {
          clearInterval(interval);
        }
      } else {
        setCurrentWordIndex((prevIndex) => prevIndex + 1);
      }
    }, 25); // Change the delay as needed

    return () => clearInterval(interval);
  }, [props.text, currentLineIndex, currentWordIndex]);

  return (
    <div className="">
      {lines.slice(0, currentLineIndex + 1).map((line: any, lineIndex: any) => (
        <div key={lineIndex}>
          {line
            .slice(
              0,
              lineIndex === currentLineIndex
                ? currentWordIndex + 1
                : line.length
            )
            .map((word: any, wordIndex: any) => (
              <div
                key={wordIndex}
                className="word-animation font-Muda font-semibold text-[16px] -z-10"
              >{word}&nbsp;
              </div>
            ))}
          {lineIndex < currentLineIndex && <br />}
        </div>
      ))}
    </div>
  );
};
