import React from 'react'
import { FaArrowRight } from "react-icons/fa";

const CodeBlocks = ({ position, heading, subheading, btn1, btn2 }) => {
  return (
    <div className={`flex ${position === "right" ? "flex-row-reverse" : "flex-row"} items-center`}>
      <div className="w-1/2 p-4">
        <p className="text-2xl font-bold">{heading}</p>
        <p className="text-gray-600">{subheading}</p>
        <div className="flex space-x-4 mt-4">
          {btn1}  {/* Now used as a component */}
          {btn2}  {/* Now used as a component */}
        </div>
      </div>
    </div>
  )
}

export default CodeBlocks
