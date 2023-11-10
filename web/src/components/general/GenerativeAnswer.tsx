import React, { useState, useEffect } from 'react';

export const GenerativeAnswer = (props:{ text:string }) => {
  const [words, setWords] = useState<any>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  useEffect(() => {
    const textWords = props.text.split(' ');
    setWords(textWords);

    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
      if (currentWordIndex >= textWords.length) {
        clearInterval(interval);
      }
    }, 25); // Change the delay as needed

    return () => clearInterval(interval);
  }, [props.text, currentWordIndex]);

  return (
    <div>
      {words.slice(0, currentWordIndex).map((word:any, index:any) => (
        <React.Fragment key={index}>
          <span className="word-animation">{word}</span>&nbsp; {/* This adds the space */}
        </React.Fragment>
      ))}
    </div>
  );
};