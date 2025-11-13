"use client";
import React from "react";

interface WordCycleProps {
  words: string[];
  duration?: number; // hər sözün tam göstərilmə müddəti (saniyə)
  typingSpeed?: number; // hər hərfin yazılma sürəti (ms)
  deletingSpeed?: number; // hər hərfin silinmə sürəti (ms)
  pauseTime?: number; // söz tam göründükdən sonra gözləmə müddəti (ms)
  className?: string;
}

const WordCycle: React.FC<WordCycleProps> = ({
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 2000,
  className = "",
}) => {
  const [currentWordIndex, setCurrentWordIndex] = React.useState(0);
  const [currentText, setCurrentText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    const currentWord = words[currentWordIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          // Yazma fazası
          if (currentText.length < currentWord.length) {
            setCurrentText(currentWord.slice(0, currentText.length + 1));
          } else {
            // Söz tam yazıldı, gözlə və sonra silməyə başla
            setTimeout(() => setIsDeleting(true), pauseTime);
          }
        } else {
          // Silmə fazası
          if (currentText.length > 0) {
            setCurrentText(currentText.slice(0, -1));
          } else {
            // Söz tam silindi, növbəti sözə keç
            setIsDeleting(false);
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [
    currentText,
    currentWordIndex,
    isDeleting,
    words,
    typingSpeed,
    deletingSpeed,
    pauseTime,
  ]);

  return (
    <span
      className={`relative text-center w-full sm:w-fit mx-auto inline-block ${className}`}
    >
      <span className="font-bold"> {currentText}</span>
      <span className="animate-blink font-bold">|</span>
      <style jsx>{`
        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }
        .animate-blink {
          animation: blink 0.7s infinite;
        }
      `}</style>
    </span>
  );
};

export default WordCycle;
