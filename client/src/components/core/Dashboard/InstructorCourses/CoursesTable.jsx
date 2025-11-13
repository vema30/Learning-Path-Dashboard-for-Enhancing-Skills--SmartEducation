import { useDispatch } from "react-redux";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import { useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { deleteCourse } from "../../../../services/operations/courseDetailsAPI";
import ConfirmationModal from "../../../common/ConfirmationModal";
import { useState } from "react";
import { useSelector } from "react-redux";
import { formatDate } from "../../../../services/formatDate";
import { useParams } from "react-router-dom";
import { setCourse, setEditCourse } from "../../../../slices/courseSlice";

export default function CoursesTable({ courses, setCourses }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const courseId = useParams();

  const handleCourseDelete = async (courseId) => {
    setLoading(true);
    await deleteCourse({ courseId: courseId }, token);

    // Update courses state after deletion
    setCourses((prevCourses) => prevCourses.filter((course) => course._id !== courseId)); // Remove the deleted course from local state
    setConfirmationModal(null);
    setLoading(false);
  };

  const handleEditClick = (courseId) => {
    navigate(`/dashboard/edit-course/${courseId}`);
  };

  return (
    <>
      <Table className="rounded-xl border border-richblack-800">
        <Thead>
          <Tr className="flex gap-x-10 rounded-t-md border-b border-b-richblack-800 px-6 py-2">
            <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">Courses</Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">Duration</Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">Price</Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {courses.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-richblack-100">No courses found</Td>
            </Tr>
          ) : (
            courses.map((course) => (
              <Tr key={course._id} className="flex gap-x-10 border-b border-richblack-800 px-6 py-8">
                <Td className="flex flex-1 gap-x-4">
                  <img
                    src={course?.thumbnail}
                    alt={course?.courseName}
                    className="h-[148px] w-[220px] rounded-lg object-cover"
                  />
                  <div className="flex flex-col justify-between">
                    <p className="text-lg font-semibold text-richblack-5">{course.courseName}</p>
                    <p className="text-xs text-richblack-300">
                      {course.courseDescription.split(" ").length > 30
                        ? course.courseDescription.split(" ").slice(0, 30).join(" ") + "..."
                        : course.courseDescription}
                    </p>
                    <p className="text-[12px] text-white">Created: {formatDate(course.createdAt)}</p>
                  </div>
                </Td>
                <Td className="text-sm font-medium text-richblack-100">2hr 30min</Td>
                <Td className="text-sm font-medium text-richblack-100">₹{course.price}</Td>
                <Td className="text-sm font-medium text-richblack-100">
                  <button
                    onClick={() => handleEditClick(course._id)}  // Handle edit button click
                    className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                  >
                    <FiEdit2 size={20} />
                    Edit
                  </button>

                  <button
                    disabled={loading}
                    onClick={() => {
                      setConfirmationModal({
                        text1: "Do you want to delete this course?",
                        text2: "All the data related to this course will be deleted",
                        btn1Text: !loading ? "Delete" : "Loading...",
                        btn2Text: "Cancel",
                        btn1Handler: !loading ? () => handleCourseDelete(course._id) : () => {},
                        btn2Handler: !loading ? () => setConfirmationModal(null) : () => {},
                      });
                    }}
                    title="Delete"
                    className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}
