import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../core/Button';
import Banner from '../../assets/Images/banner.mp4';
import CodeBlocks from '../core/CodeBlocks';
import AnimatedCode from '../core/AnimatedCode'; // Import AnimatedCode component

export const HomePage = () => {
  const codeLines = [
    "<html>",
    "    <head>",
    "        <title>Animated Code</title>",
    "        <style>",
    "            body { background-color: black; color: white; }",
    "        </style>",
    "    </head>",
    "    <body>",
    "        <h1>Hello, World!</h1>",
    "    </body>",
    "</html>"
  ];

  return (
    <div className="p-8">
  
      <Link to="/signup">Become an Instructor</Link>
      <div>Empower Your Future with <span>Coding skills</span></div>
      <div>Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
      
      <div className='flex flex-row items-center justify-center space-x-2'> 
        <Button active={true} linkto="/signup">Learn More</Button>
        <Button active={false} linkto="/login">Book a Demo</Button>
      </div>

      {/* Video Banner */}
      <div className="relative w-full h-[500px] overflow-hidden">
        <video className="w-full h-full object-cover" src={Banner} muted loop autoPlay />
      </div>
      
      {/* CodeBlocks Section + Animated Code */}
      <div className="flex flex-row justify-between items-start mt-8">
        {/* CodeBlocks Section */}
        <CodeBlocks 
          position="left"
          heading="Start Coding Today!"
          subheading="Learn industry-leading coding skills and transform your future."
          btn1={<Button active={true} linkto="/signup">Get Started</Button>}
          btn2={<Button active={false} linkto="/login">Explore More</Button>}
        />

        {/* Animated Code Display */}
        <AnimatedCode codeLines={codeLines} delay={700} />
      </div>
      <div className="flex flex-row-reverse justify-between items-start mt-8">
        {/* CodeBlocks Section */}
        <CodeBlocks 
          position="left"
          heading="Start Coding Today!"
          subheading="Learn industry-leading coding skills and transform your future."
          btn1={<Button active={true} linkto="/signup">Get Started</Button>}
          btn2={<Button active={false} linkto="/login">Explore More</Button>}
        />

        {/* Animated Code Display */}
        <AnimatedCode codeLines={codeLines} delay={700} />
      </div>
      <div>
           <p>Unlock the power of code</p>
      </div>
    </div>
  );
};
