import React, { useState, useEffect } from 'react';

const AnimatedCode = ({ codeLines, delay = 800 }) => {
  const [visibleLines, setVisibleLines] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < codeLines.length) {
      const timeout = setTimeout(() => {
        setVisibleLines((prev) => [...prev, codeLines[index]]);
        setIndex(index + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      // Reset after all lines are shown
      setTimeout(() => {
        setVisibleLines([]);
        setIndex(0);
      }, 2000); // 2s pause before restarting
    }
  }, [index, codeLines, delay]);

  return (
    <div className="bg-gray-900 text-green-400 font-mono p-4 rounded-lg w-[600px] min-h-[250px] shadow-lg overflow-hidden">
      {visibleLines.map((line, i) => (
        <p 
          key={i} 
          className="opacity-0 translate-y-2 transition-all duration-500"
          style={{ opacity: 1, transform: 'translateY(0)' }} 
        >
          {line}
        </p>
      ))}
    </div>
  );
};

export default AnimatedCode;
