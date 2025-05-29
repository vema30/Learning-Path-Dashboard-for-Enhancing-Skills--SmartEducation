import { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";
import axios from 'axios';
export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth);
 



  const [enrolledCourses, setEnrolledCourses] = useState(null);

  // const getEnrolledCourses = async () => {
  //   try {
  //     const res = await getUserEnrolledCourses(token);
  //     console.log("res",res);
  //     setEnrolledCourses(res);
  //   } catch (error) {
  //     console.log("Could not fetch enrolled courses.");
  //   }
  // };
  async function getCourseProgress(courseId) {
    try {
      const response = await axios.get(
        `http://localhost:4000/user/course-progress/${courseId}`,
        {
          withCredentials: true, // send cookies (auth token)
        }
      );
      return response.data; // expects { progressPercentage, completedCount, totalCount }
    } catch (error) {
      console.error(`Error fetching course progress for course ${courseId}:`, error.response?.data || error.message);
      return null;
    }
  }
  
  // Fetch all enrolled courses and augment each with progress from API
  const getEnrolledCourses = async () => {
    try {
      // Assume this fetches the list of enrolled courses with their IDs
      const enrolledCourses = await getUserEnrolledCourses(token); 
  
      // For each course, fetch the progress using the API
      const coursesWithProgressPromises = enrolledCourses.map(async (course) => {
        const progressData = await getCourseProgress(course._id);
  
        // If no progress data, default to 0
        const progressPercentage = progressData?.progressPercentage || 0;
  
        return {
          ...course,
          progressPercentage,
          // you can add other progress-related data here if you want
        };
      });
  
      const coursesWithProgress = await Promise.all(coursesWithProgressPromises);
  
      setEnrolledCourses(coursesWithProgress);
    } catch (error) {
      console.log("Could not fetch enrolled courses or progress.", error);
    }
  };
  

  useEffect(() => {
    getEnrolledCourses();
  }, []);

  return (
    <>
      <div className="text-3xl text-richblack-50">Enrolled Courses</div>
      {/* <Link to="/dashboard/settings" className="bg-yellow-50 p-5">
        Test Nav
      </Link> */}

      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : !enrolledCourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not enrolled in any course yet.
        </p>
      ) : (
        <div className="my-8 text-richblack-5">
          {/* Headings */}
          <div className="flex rounded-t-lg bg-richblack-500 ">
            <p className="w-[45%] px-5 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3">Duration</p>
            <p className="flex-1 px-2 py-3">Progress</p>
          </div>

          {/* Course Names */}
          {enrolledCourses.map((course, i, arr) => {
            const sectionId = course?.sections?.[0]?._id;
            const subSectionId = course?.sections?.[0]?.subSections?.[0]?._id;
            const handleCertificate = async (courseId) => {
              try {
                const response = await axios.get(`http://localhost:4000/api/v1/course/course-certificate/${courseId}`, {
                  withCredentials: true,
                });
            
                const certificateUrl = response.data?.certificateUrl;
                if (certificateUrl) {
                  window.open(certificateUrl, "_blank");
                } else {
                  alert("Certificate not available yet.");
                }
              } catch (error) {
                console.error("Error fetching certificate:", error.response?.data || error.message);
                alert("Could not fetch certificate.");
              }
            };
            
            // If section or subsection is missing, don't show link
            if (!sectionId || !subSectionId) return null;

            return (
              <div
                className={`flex items-center border border-richblack-700 ${
                  i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
                }`}
                key={i}
              >
                <Link
                  to={`/view-course/${course._id}/section/${sectionId}/sub-section/${subSectionId}`}
                  className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                >
                  <img
                    src={course.thumbnail}
                    alt="course_img"
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div className="flex max-w-xs flex-col gap-2">
                    <p className="font-semibold">{course.courseName}</p>
                    <p className="text-xs text-richblack-300">
                      {course.courseDescription.length > 50
                        ? `${course.courseDescription.slice(0, 50)}...`
                        : course.courseDescription}
                    </p>
                  </div>
                </Link>
                <div className="w-1/4 px-2 py-3">{course?.totalDuration}</div>
                <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                  <p>Progress: {course.progressPercentage || 0}%</p>
                  <ProgressBar
                    completed={course.progressPercentage || 0}
                    height="8px"
                    isLabelVisible={false}
                  />
                    {course.progressPercentage === 100 ? (
    <button
      onClick={() => handleCertificate(course._id)}
      className="mt-2 text-sm text-yellow-400 underline"
    >
      View Certificate
    </button>
  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
