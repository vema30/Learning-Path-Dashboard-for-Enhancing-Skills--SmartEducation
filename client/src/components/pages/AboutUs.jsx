import React from 'react';
import HighlightText from '../common/HighlightText';
import aboutus1 from '../../assets/Images/aboutus1.webp';
import aboutus2 from '../../assets/Images/aboutus2.webp';
import aboutus3 from '../../assets/Images/aboutus3.webp';
import foundingStory from '../../assets/Images/FoundingStory.png';
import CTButton from '../common/CTButton';
import ContactUs from '../pages/ContactUs';

const AboutUs = () => {
  return (
    <div className="px-6 py-12 bg-richblue-900 text-gray-100">
      
      {/* Header Section */}
      <div className="text-center">
        <p className="text-lg font-semibold text-blue-400">About Us</p>
        <h2 className="text-4xl font-bold mt-2 text-white">
          Driving Innovation in Online Education for a <HighlightText text="Brighter Future" />
        </h2>
        <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
          Studynotion is at the forefront of driving innovation in online education. We're passionate about creating a brighter future by offering cutting-edge courses, leveraging emerging technologies, and nurturing a vibrant learning community.
        </p>
      </div>

      {/* Images Section */}
      <div className="flex flex-wrap justify-center gap-6 mt-8">
        {[aboutus1, aboutus2, aboutus3].map((img, index) => (
          <img key={index} src={img} alt={`About Us ${index + 1}`} 
            className="w-60 rounded-lg shadow-lg transition-transform transform hover:scale-110 hover:shadow-2xl duration-300" />
        ))}
      </div>

      {/* Founding Story */}
      <div className="mt-12 flex flex-col lg:flex-row items-center gap-8">
        <div className="lg:w-1/2">
          <h3 className="text-3xl font-bold text-purple-400 text-caribbeangreen-400" >Our Founding Story</h3>
          <p className="mt-4 text-gray-300 text-lg">
            Our e-learning platform was born out of a shared vision and passion for transforming education. It all began with a group of educators, technologists, and lifelong learners who recognized the need for accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world.
          </p>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          <img src={foundingStory} alt="Founding Story" 
            className="rounded-lg shadow-lg transition-transform transform hover:scale-110 hover:shadow-2xl duration-300" />
        </div>
      </div>

      {/* Our Vision & Mission */}
      <div className="mt-12 grid md:grid-cols-2 gap-8 bg-richblue-300 rounded p-3 ">
        <div className="p-6 bg-gray-800 text-white bg-richblue-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-3xl font-bold text-red-100">Our Vision</h3>
          <p className="mt-4 text-gray-300 text-lg">
            With this vision in mind, we set out on a journey to create an e-learning platform that would revolutionize the way people learn.
          </p>
        </div>
        <div className="p-6 bg-gray-800 bg-richblue-200 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-3xl font-bold text-purple-400 text-caribbeangreen-300">Our Mission</h3>
          <p className="mt-4 text-gray-300 text-lg">
            Our mission goes beyond just delivering courses online. We aim to create a vibrant community of learners where individuals can connect, collaborate, and grow together.
          </p>
        </div>
      </div>

      {/* Additional Info Sections - Grid Layout */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "World-Class Learning", text: "We partner with top universities and companies to bring job-relevant learning.", bg: "bg-blue-500" },
          { title: "Industry-Based Curriculum", text: "Designed to be easier to understand and aligned with industry needs.", bg: "bg-green-500" },
          { title: "Flexible Learning Methods", text: "Choose from online or offline learning to fit your lifestyle.", bg: "bg-yellow-500" },
          { title: "Certification", text: "Earn a certificate to enhance your job prospects.", bg: "bg-purple-500" },
          { title: "Instant Auto-Grading", text: "Receive immediate feedback during your learning journey.", bg: "bg-red-500" },
          { title: "Job Ready Program", text: "Connected with 150+ hiring partners to help you land a job.", bg: "bg-indigo-500" }
        ].map((item, index) => (
          <div key={index} className={`p-6 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ${item.bg}`}>
            <h3 className="text-2xl font-bold">{item.title}</h3>
            <p className="mt-2">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Get in Touch Section */}
      <div className="mt-16 text-center bg-purple-600 py-12 rounded-lg shadow-lg">
        <ContactUs />
      </div>
    </div>
  );
};

export default AboutUs;
