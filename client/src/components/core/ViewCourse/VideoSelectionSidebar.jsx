import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const VideoSelectionSidebar = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const { courseSectionData } = useSelector((state) => state.viewCourse);

  const handleVideoSelect = (sectionId, subSectionId) => {
    navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${subSectionId}`);
  };

  return (
    <div className=" bg-gray-900 p-6 text-white overflow-y-auto max-h-screen shadow-md border-r border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-white">Course Videos</h2>
      {courseSectionData && courseSectionData.length > 0 ? (
        <ul className="space-y-6">
          {courseSectionData.map((section) => (
            <li key={section._id}>
              <p className="font-semibold text-lg text-gray-300 mb-2 border-b border-gray-700 pb-1">
                {section.sectionName}
              </p>
              {section.subSections && section.subSections.length > 0 ? (
                <ul className="space-y-2 pl-2">
                  {section.subSections.map((subSection) => (
                    <li
                      key={subSection._id}
                      onClick={() => handleVideoSelect(section._id, subSection._id)}
                      className={`cursor-pointer transition-all duration-200 px-3 py-2 rounded-lg text-sm font-medium 
                        ${
                          subSection._id === subSectionId
                            ? "bg-yellow-500 text-black"
                            : "hover:bg-gray-800"
                        }`}
                    >
                      {subSection.title}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 ml-4">No videos in this section.</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">Loading course data...</p>
      )}
    </div>
  );
};

export default VideoSelectionSidebar;
