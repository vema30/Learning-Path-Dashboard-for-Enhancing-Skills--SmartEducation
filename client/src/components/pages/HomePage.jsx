import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa";
import { Text } from '../common/Text';
import CodeBlocks from '../core/CodeBlocks';
import HighlightText from '../common/HighlightText';
import CTButton from '../common/CTButton';
import TimelineImage from '../../assets/Images/TimelineImage.png';
import Instructor from '../../assets/Images/Instructor.png';
import banner from '../../assets/Images/banner.mp4';
import Logo1 from '../../assets/TimeLineLogo/Logo1.svg';
import Logo2 from '../../assets/TimeLineLogo/Logo2.svg';
import Logo3 from '../../assets/TimeLineLogo/Logo3.svg';
import Logo4 from '../../assets/TimeLineLogo/Logo4.svg';

const HomePage = () => {
  return (
    <div className="relative mx-auto flex flex-col w-11/12 items-center justify-center">
      {/* Section 1 */}
      <Link to="/signup">
        <div className="mx-auto bg-richblack-800 text-richblack-200 border rounded-full border-richblack-100 px-6 py-3 transition-all duration-200 hover:bg-richblack-900 mt-10">
          <div className="flex flex-row items-center gap-2">
            <Text text="Become an Instructor" />
            <FaArrowRight />
          </div>
        </div>
      </Link>

      {/* Hero Section */}
      <div className="text-center mt-10">
        <h1 className="text-4xl font-bold">
          Empower Your Future with <HighlightText text="Skills" />
        </h1>
        <p className="w-3/4 mx-auto text-lg text-richblack-300 mt-4">
          With our online coding courses, learn at your own pace, from anywhere, with hands-on projects, quizzes, and expert feedback.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <CTButton active={true} linkto="/signup">Learn More</CTButton>
          <CTButton active={false} linkto="/login">Book a demo</CTButton>
        </div>
      </div>

      {/* Video Banner */}
      <div className="mt-12 w-full max-w-4xl">
        <video className="w-full rounded-xl md shadow-lg border-4 border-gray-700 border-r-8 border-b-8" src={banner} autoPlay loop muted playsInline />
      </div>

      {/* Code Blocks */}
      <CodeBlocks
        position="flex-row"
        heading="Unlock Your Coding Potential"
        subheading="Taught by industry experts with years of experience."
        ctabtn1={{ active: true, linkto: "/signup", btnText: "Try it Yourself" }}
        ctabtn2={{ active: false, linkto: "/login", btnText: "Learn More" }}
        codeblock={`<!DOCTYPE html>
<html>
<head>
  <title>My HTML Demo</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <p>Hey champ</p>
</body>
</html>`}
        codeblockStyle="bg-gray-900 text-green-400 p-4 rounded-lg shadow-lg"
      />

      {/* Responsive Section 3 */}
      <div className="bg-white w-screen text-black text-xl py-12 px-4 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-center text-center md:text-left">
            {/* Left Section */}
            <div className="w-full md:w-1/2 text-3xl font-semibold">
              Get the skills you need for <HighlightText text="a job that is in demand" />
            </div>
            {/* Right Section */}
            <div className="w-full md:w-1/2 text-lg text-richblack-300">
              <Text text="Modern industries demand more than just skills. Stay ahead with our tailored courses." />
              <div className="mt-6">
                <CTButton active={true} linkto="/signup">Learn More</CTButton>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="flex flex-col md:flex-row items-center mt-12 gap-10">
            {/* Left Content */}
            <div className="w-full md:w-1/2 flex flex-col gap-6">
              {[{logo: Logo1, title: "Leadership", desc: "Committed to success"},
                {logo: Logo2, title: "Innovation", desc: "Encouraging creativity"},
                {logo: Logo3, title: "Teamwork", desc: "Collaboration and respect"},
                {logo: Logo4, title: "Excellence", desc: "Striving for quality"}].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg shadow-md">
                    <img src={item.logo} alt={item.title} className="w-12 h-12" />
                    <div>
                      <div className="font-semibold text-lg">{item.title}</div>
                      <div className="text-sm text-richblack-400">{item.desc}</div>
                    </div>
                  </div>
              ))}
            </div>
            
            {/* Right Image & Stats */}
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <img src={TimelineImage} alt="Timeline Representation" className="w-full max-w-md md:max-w-lg rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Section 4 - Become an Instructor */}
      <div className="bg-gray-100 w-full py-12 px-4 md:px-16 flex flex-col md:flex-row items-center gap-10">
        <div className="w-full md:w-1/2">
          <img src={Instructor} alt="Instructor"  className="w-full max-w-md rounded-lg shadow-lg border-4 border-gray-700 border-r-8 border-b-8" />
        </div>
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl font-semibold">Become an Instructor</h2>
          <p className="text-lg text-richblack-400 mt-4">
            Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
          </p>
          <div className="mt-6">
            <CTButton active={true} linkto="/signup">Start Teaching Today</CTButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
