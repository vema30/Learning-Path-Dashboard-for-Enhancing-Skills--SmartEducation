import { useEffect, useState } from "react";
import { VscAdd } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI";
import IconBtn from "../../common/IconBtn";
import CoursesTable from "./InstructorCourses/CoursesTable";
import { setCourse, setEditCourse } from "../../../slices/courseSlice";

export default function MyCourses() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false); // Added loading state
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    if (!token) return; // Check if the token exists before fetching data

    const fetchCourses = async () => {
      setLoading(true); // Start loading
      setError(null); // Reset error state
      try {
        const result = await fetchInstructorCourses(token);
        console.log("Fetched Courses:", result); // Log the response for debugging

        if (result && Array.isArray(result)) {
          setCourses(result); // Set courses directly if result is an array
        } else {
          setError("No courses found or failed to fetch.");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to fetch courses.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchCourses();
  }, [token]); // Ensure that token changes will refetch the data

  return (
    <div>
      <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
        <IconBtn
          text="Add Course"
          onclick={() => navigate("/dashboard/add-course")}
        >
          <VscAdd />
        </IconBtn>
      </div>

      {/* Loading and Error Handling */}
      {loading && <p>Loading courses...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Displaying courses if available */}
      {courses && !loading && !error && (
        <CoursesTable courses={courses} setCourses={setCourses} />
      )}
    </div>
  );
}
