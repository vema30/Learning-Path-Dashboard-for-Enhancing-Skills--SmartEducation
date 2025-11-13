import { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";
import { toggleProgressRefresh } from "../../../slices/profileSlice";

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const refreshProgress = useSelector((state) => state.profile.refreshProgress);

  const getEnrolledCourses = async () => {
    setLoading(true);
    try {
      const res = await getUserEnrolledCourses(token);
      console.log("Fetched Enrolled Courses with updated progress:", res);
      setEnrolledCourses(res);
    } catch (error) {
      console.log("Could not fetch enrolled courses.", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getEnrolledCourses();
  }, [refreshProgress]);

  return (
    <>
      <div className="text-3xl text-richblack-50">Enrolled Courses</div>
      <button
        onClick={() => dispatch(toggleProgressRefresh())}
        className="rounded-md bg-yellow-400 px-4 py-2 text-black hover:bg-yellow-300"
      >
        Refresh Progress
      </button>

      {loading || !enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <p className="text-red-500">Failed to load courses. Please try again later.</p>
          )}
        </div>
      ) : !enrolledCourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not enrolled in any course yet.
        </p>
      ) : (
        <div className="my-8 text-richblack-5">
          <div className="flex rounded-t-lg bg-richblack-500">
            <p className="w-[45%] px-5 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3">Duration</p>
            <p className="flex-1 px-2 py-3">Progress</p>
          </div>

          {enrolledCourses.map((course, i, arr) => {
            const sectionId = course?.sections?.[0]?._id;
            const subSectionId = course?.sections?.[0]?.subSections?.[0]?._id;
            const progress = Number(course?.progressPercentage) || 0;
            console.log(`Course: ${course.courseName}, Progress: ${progress}%`);

            return (
              <div
                key={course._id}
                className={`flex items-center border border-richblack-700 ${
                  i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
                }`}
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
                  <p>
                    Progress: {progress ? `${progress}%` : "No progress yet"}
                  </p>
                  <ProgressBar
                    completed={progress}
                    height="8px"
                    isLabelVisible={false}
                    bgColor="#47D7AC"
                    baseBgColor="#1E293B"
                    animateOnRender
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
