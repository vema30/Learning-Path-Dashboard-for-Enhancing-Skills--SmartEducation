import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "video-react/dist/video-react.css";
import { BigPlayButton, Player } from "video-react";
import VideoSelectionSidebar from './VideoSelectionSidebar';
import { toggleProgressRefresh } from "../../../slices/profileSlice";
import {
  setCourseSectionData,
  setEntireCourseData,
  setCompletedLectures,
  setTotalCompletedLectures,
  updateCompletedLectures,
} from "../../../slices/viewCourseSlice";
import {
  fetchCourseDetails,
  markLectureAsComplete,
} from "../../../services/operations/courseDetailsAPI";
import IconBtn from "../../common/IconBtn";

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const playerRef = useRef(null);
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const { courseSectionData, courseEntireData, completedLectures } = useSelector((state) => state.viewCourse);
  const [videoData, setVideoData] = useState(null);
  const [previewSource, setPreviewSource] = useState("");
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;
      try {
        const result = await fetchCourseDetails(courseId);
        if (result?.success) {
          const courseData = result.data;
          const totalLectures = courseData.sections?.reduce(
            (acc, curr) => acc + (curr.subSections?.length || 0),
            0
          );
          dispatch(setCourseSectionData(courseData.sections || []));
          dispatch(setEntireCourseData(courseData));
          dispatch(setCompletedLectures([]));
          dispatch(setTotalCompletedLectures(totalLectures));
        }
      } catch (err) {
        console.error("Error fetching course details:", err);
      }
    };
    fetchCourseData();
  }, [courseId, token, dispatch]);

  useEffect(() => {
    const loadVideoData = () => {
      if (!courseSectionData.length || !sectionId || !subSectionId) return;
      const section = courseSectionData.find((sec) => sec._id === sectionId);
      if (!section) return navigate("/dashboard/enrolled-courses");
      const video = section.subSections.find((sub) => sub._id === subSectionId);
      if (!video) return navigate("/dashboard/enrolled-courses");
      setVideoData(video);
      setPreviewSource(courseEntireData?.thumbnail || "");
      setVideoEnded(false);
    };
    loadVideoData();
  }, [courseSectionData, courseEntireData, sectionId, subSectionId, navigate, location.pathname]);

  const handleLectureCompletion = async () => {
    try {
      setLoading(true);
      const success = await markLectureAsComplete(
        { courseId, subsectionId: subSectionId },
        token
      );
      console.log("API success:", success);
  
      if (success) {
        console.log("Dispatching updateCompletedLectures with", subSectionId);
  
        dispatch(updateCompletedLectures(subSectionId));
        dispatch(setTotalCompletedLectures(completedLectures.length)); // <-- This line is where the issue occurred
  
        try {
          await markLectureAsComplete({ courseId, subsectionId: subSectionId }, token);
          navigate("/dashboard/enrolled-courses");
          dispatch(toggleProgressRefresh());

        } catch (error) {
          console.error("Failed to mark complete:", error);
          // Optional: rollback state if needed
        }
      }
    } catch (error) {
      console.error("Error marking lecture complete:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const isFirstVideo = () => {
    const sectionIndex = courseSectionData.findIndex((s) => s._id === sectionId);
    const subIndex = courseSectionData[sectionIndex]?.subSections.findIndex((s) => s._id === subSectionId);
    return sectionIndex === 0 && subIndex === 0;
  };

  const isLastVideo = () => {
    const sectionIndex = courseSectionData.findIndex((s) => s._id === sectionId);
    const subSectionList = courseSectionData[sectionIndex]?.subSections || [];
    const subIndex = subSectionList.findIndex((s) => s._id === subSectionId);
    return sectionIndex === courseSectionData.length - 1 && subIndex === subSectionList.length - 1;
  };

  const goToNextVideo = () => {
    const sectionIndex = courseSectionData.findIndex((s) => s._id === sectionId);
    const currentSubIndex = courseSectionData[sectionIndex]?.subSections.findIndex((s) => s._id === subSectionId);
    const currentSection = courseSectionData[sectionIndex];
  
    if (currentSubIndex < currentSection.subSections.length - 1) {
      const nextSubId = currentSection.subSections[currentSubIndex + 1]._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubId}`);
    } else if (sectionIndex < courseSectionData.length - 1) {
      const nextSection = courseSectionData[sectionIndex + 1];
      if (nextSection?.subSections?.length > 0) {
        const nextSubId = nextSection.subSections[0]._id;
        navigate(`/view-course/${courseId}/section/${nextSection._id}/sub-section/${nextSubId}`);
      } else {
        console.warn("Next section has no subsections");
      }
    }
  };
  
  const goToPrevVideo = () => {
    const sectionIndex = courseSectionData.findIndex((s) => s._id === sectionId);
    const currentSubIndex = courseSectionData[sectionIndex].subSections.findIndex((s) => s._id === subSectionId);

    if (currentSubIndex > 0) {
      const prevSubId = courseSectionData[sectionIndex].subSections[currentSubIndex - 1]._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubId}`);
    } else if (sectionIndex > 0) {
      const prevSection = courseSectionData[sectionIndex - 1];
      const lastSubIndex = prevSection.subSections.length - 1;
      const prevSubId = prevSection.subSections[lastSubIndex]._id;
      navigate(`/view-course/${courseId}/section/${prevSection._id}/sub-section/${prevSubId}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-[22%] min-w-[280px] bg-gray-900 text-white p-4 border-r border-gray-700 overflow-y-auto">
        <VideoSelectionSidebar />
      </aside>

      <main className="flex-1 p-6">
        <div className="flex flex-col gap-6">
          {!videoData ? (
            <div className="flex items-center justify-center h-[400px] bg-gray-800 text-white text-lg rounded-md">
              Loading video...
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <Player
                ref={playerRef}
                aspectRatio="16:9"
                playsInline
                onEnded={() => setVideoEnded(true)}
                src={videoData.videoUrl}
              >
                <BigPlayButton position="center" />
                {videoEnded && (
                  <div className="absolute inset-0 z-10 grid place-content-center bg-black/60 text-center">
                    <div className="flex flex-wrap justify-center items-center gap-4 px-4">
                      {!completedLectures.includes(subSectionId) && (
                        <IconBtn
                          disabled={loading}
                          onclick={handleLectureCompletion}
                          text={loading ? "Loading..." : "Mark As Completed"}
                          customClasses="text-lg px-6 py-2 bg-green-500 hover:bg-green-600 rounded-md text-white font-semibold"
                        />
                      )}
                      <IconBtn
                        disabled={loading}
                        onclick={() => {
                          if (playerRef.current) {
                            playerRef.current.seek(0);
                            setVideoEnded(false);
                          }
                        }}
                        text="Rewatch"
                        customClasses="text-lg px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-semibold"
                      />
                    </div>
                  </div>
                )}
              </Player>
            </div>
          )}

          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{videoData?.title}</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">{videoData?.description}</p>
          </div>

          <div className="flex justify-end gap-6 mt-8">
            {!isFirstVideo() && (
              <button
                disabled={loading}
                onClick={goToPrevVideo}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Previous
              </button>
            )}
            {!isLastVideo() && (
              <button
                disabled={loading}
                onClick={goToNextVideo}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoDetails;
