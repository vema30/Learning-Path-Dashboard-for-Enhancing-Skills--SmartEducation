import React from 'react'
import { Link } from 'react-router-dom';
import { Text } from '../common/Text';
import CodeBlocks from '../core/CodeBlocks';
import { FaArrowRight } from "react-icons/fa";
import HighlightText from '../common/HighlightText';
import  CTButton from '../common/CTButton';
import banner from '../../assets/Images/banner.mp4'
const HomePage = () => {
  return (
    <div className='relative mx-auto flex flex-col w-11/12  items-center justify-center '>

      {/*section 1*/}
       <Link to={"/signup"}>
       <div className='max-auto bg-richblack-800  text-richblack-200 border rounded-full border-richblack-100 p-3 border-t-0 border-l-0 border-r-0 transition-all duration-200 hover:bg-richblack-900 w-fit m-16 '>
        <div className='flex flex-row items-center px-10 py-[3px] group-hover:bg-richblue-800'>
       
          <Text text={"Become a Instructor"}/>
          <FaArrowRight/>
        </div>
      

       </div>
       </Link>
      <div>
      <div className='flex flex-row space-x-3 text-4xl items-center justify-center'>
       <Text text={"Empower Your Future with "}/>
        <HighlightText text={"skills"}/>
        </div>

        <div className='w-[89%] text-center text-lg text-richblack-300 mt-4 max-w-[max-content]'>
          <Text text={"With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. "}/>
        </div>
        <div className='flex flex-row justify-center gap-6 p-2'>
         <CTButton active={true} linkto={"/signup"}>Learn More</CTButton>
         <CTButton active={false} linkto={"/login"}>Book a demo</CTButton>
        </div>
        <div className='m-12 flex flex-row justify-center items-center shadow-blue-200'>
        <video 
  className="mt-6 w  border  border-r-white border-b-white rounded-xl shadow-lg object-cover"
  src={banner}
  autoPlay 
  loop 
  muted 
  playsInline
  typeof='video/mp4'
/>
        </div>
       <div>
       <CodeBlocks
  position="flex-row"
  heading="Unlock your  coding potential with our online courses"
  subheading="Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
  ctabtn1={{ active: true, linkto: "/signup", btnText: "Try it Yourself" }}
  ctabtn2={{ active: false, linkto: "/login", btnText: "Learn More" }}
  codeblock={`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My HTML Demo</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
     <p>hey champ</p>
</body>
</html>`}
  codeblockStyle="bg-gray-900 text-green-400"
/>

<CodeBlocks
  position="flex-row-reverse"
  heading="Start Coding in Seconds"
  subheading="Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
  ctabtn1={{ active: true, linkto: "/signup", btnText: "Continue Lesson" }}
  ctabtn2={{ active: false, linkto: "/learn-more", btnText: "Learn More" }}
  codeblock={`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My HTML Demo</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Welcome to My Website</h1>
    <p>This is a simple HTML example.</p>
</body>
</html>`}
  codeblockStyle="bg-gray-900 text-green-400 p-4 rounded-lg shadow-lg"
/>


       </div>
      </div>
       {/*section 2*/}
        {/*section 3*/}
         {/*section 4*/}
    </div>
  )
}

export default HomePage