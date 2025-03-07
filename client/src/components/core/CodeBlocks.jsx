import React, { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import CTButton from "../common/CTButton";

const CodeBlocks = ({ 
  position, 
  heading, 
  subheading, 
  ctabtn1, 
  ctabtn2, 
  codeblock, 
  codeblockStyle 
}) => {
  const lines = codeblock.split("\n");
  const totalLines = lines.length;
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines < totalLines) {
      const timer = setTimeout(() => {
        setVisibleLines(visibleLines + 1);
      }, 200); // Typing speed
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setVisibleLines(0), 2000); // Restart after pause
    }
  }, [visibleLines, totalLines]);

  return (
    <div className={`flex ${position} my-10 lg:my-20 justify-between gap-10 items-center bg-gradient-to-r from-gray-900 to-gray-800 p-10 rounded-lg shadow-xl`}>
      
      {/* Left Section - Text & Buttons */}
      <div className="w-full lg:w-[50%] flex flex-col gap-6 text-center lg:text-left">
        <h2 className="text-4xl font-bold text-white">{heading}</h2>
        <p className="text-lg text-gray-300">{subheading}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <CTButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
            <div className="flex gap-2 items-center">
              {ctabtn1.btnText} <FaArrowRight />
            </div>
          </CTButton>

          <CTButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
            <div className="flex gap-2 items-center">
              {ctabtn2.btnText}
            </div>
          </CTButton>
        </div>
      </div>

      {/* Right Section - Animated Code Block */}
      <div className="w-full lg:w-[50%] relative">
        <div 
          className="bg-gray-900 text-green-400 p-6 rounded-lg shadow-lg overflow-hidden border border-gray-700 relative"
          style={{ minHeight: `${totalLines * 24}px`, maxHeight: "500px" }} // Keeps height consistent
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-5 rounded-lg"></div>

          <pre className={`text-sm font-mono ${codeblockStyle} whitespace-pre-wrap break-words`}>
            {Array.from({ length: totalLines }, (_, index) => (
              <div key={index} className="flex">
                {/* ✅ Fix: Keep line numbers width fixed (handles 2-digit numbers properly) */}
                <span className="text-gray-600 pr-4 min-w-[40px] text-right">{index + 1}</span> 
                <span className="text-green-300 break-words w-full">
                  {index < visibleLines ? lines[index] : ""} {/* Animated Typing Effect */}
                </span>
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeBlocks;
