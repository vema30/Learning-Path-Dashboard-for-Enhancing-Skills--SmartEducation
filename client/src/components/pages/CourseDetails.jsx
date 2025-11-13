import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BiInfoCircle } from "react-icons/bi";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { setPaymentLoading } from "../../slices/courseSlice";

import ConfirmationModal from "../../components/common/ConfirmationModal";
import Footer from "../../components/common/Footer";
import RatingStars from "../../components/common/RatingStars";
import CourseAccordionBar from "../../components/core/Course/CourseAccordionBar";
import CourseDetailsCard from "../../components/core/Course/CourseDetailsCard";

import { fetchCourseDetails } from "../../services/operations/courseDetailsAPI";
import { BuyCourse } from "../../services/operations/studentFeaturesAPI";
import { getUserDetails } from "../../services/operations/profileAPI";

import { formatDate } from "../../services/formatDate";
import GetAvgRating from "../../utils/avgRating";

function CourseDetails() {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { paymentLoading } = useSelector((state) => state.course);

  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState(null);
  const [instructorImage, setInstructorImage] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
  const [isActive, setIsActive] = useState([]);

  // Fetch course details
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));

    const getCourseDetails = async () => {
      setLoading(true);
      try {
        const res = await fetchCourseDetails(courseId,token);
if (!res.success) {
  throw new Error(res.message);
}

        const data = res.data;
        setCourseData(data);
        setAvgReviewCount(GetAvgRating(data.ratingAndReview || []));

        const totalLectures = data.sections?.reduce(
          (acc, sec) => acc + (sec.subSection?.length || 0),
          0
        );
        setTotalNoOfLectures(totalLectures);
      } catch (err) {
        console.error("Error fetching course:", err);
        toast.error("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    getCourseDetails();
  }, [courseId]);

  // Fetch instructor image
  useEffect(() => {
    const fetchInstructorImage = async () => {
      if (courseData?.instructor?._id) {
        try {
          const res = await getUserDetails(courseData.instructor._id);
          setInstructorImage(res?.data?.image);
        } catch (error) {
          console.error("Failed to fetch instructor image:", error);
        }
      }
    };

    fetchInstructorImage();
  }, [courseData]);

  // Handle Buy Course
  const handleBuyCourse = async () => {
    if (loading || paymentLoading) return;

    if (token) {
      try {
        dispatch(setPaymentLoading(true)); // <-- Correct way!
        await BuyCourse(token, [courseId], user, navigate, dispatch);
        // Navigate to the payment page
        navigate(`/payments/${courseId}`);
      } catch (error) {
        console.error("Error in BuyCourse:", error);
        toast.error("Error processing the payment. Please try again.");
      } finally {
        dispatch(setPaymentLoading(false)); // <-- Correct way!
      }
    } else {
      setConfirmationModal({
        text1: "You are not logged in!",
        text2: "Please login to purchase the course.",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
      });
    }
  };

  const handleActive = (id) => {
    setIsActive((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  if (loading || !courseData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  const {
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    sections,
    ratingAndReview = [],
    instructor,
    studentsEnrolled = [],
    createdAt,
  } = courseData;

  return (
    <>
      {/* Header + Course Card Section */}
      <div className="w-full bg-richblack-800">
        <div className="mx-auto px-4 lg:w-[1260px]">
          <div className="flex flex-col-reverse gap-10 py-8 lg:flex-row">
            {/* Left: Course Info */}
            <div className="flex-1">
              <div className="relative block max-h-[30rem] lg:hidden">
                <img src={thumbnail} alt="course thumbnail" className="w-full aspect-auto" />
              </div>

              <div className="z-30 flex flex-col gap-4 py-5 text-lg text-richblack-5">
                <h1 className="text-4xl font-bold">{courseName}</h1>
                <p className="text-richblack-200">{courseDescription}</p>

                <div className="flex flex-wrap items-center gap-2 text-md">
                  <span className="text-yellow-25">{avgReviewCount}</span>
                  <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                  <span>({ratingAndReview.length} reviews)</span>
                  <span>{studentsEnrolled.length} students enrolled</span>
                </div>

                <p>Created by {`${instructor.firstName} ${instructor.lastName}`}</p>

                <div className="flex flex-wrap gap-5">
                  <p className="flex items-center gap-2">
                    <BiInfoCircle /> Created at {formatDate(createdAt)}
                  </p>
                  <p className="flex items-center gap-2">
                    <HiOutlineGlobeAlt /> English
                  </p>
                </div>
              </div>

              {/* Mobile Buttons */}
              <div className="flex w-full flex-col gap-4 border-y py-4 lg:hidden">
                <p className="pb-4 text-3xl font-semibold">Rs. {price}</p>
                <button
                  className="yellowButton"
                  onClick={handleBuyCourse}
                  disabled={paymentLoading}
                >
                  {paymentLoading ? "Processing..." : "Buy Now"}
                </button>
                <button className="blackButton">Add to Cart</button>
              </div>
            </div>

            {/* Right: Course Details Card */}
            <div className="hidden lg:block w-full max-w-[400px]">
              <CourseDetailsCard
                course={courseData}
                handleBuyCourse={handleBuyCourse}
                setConfirmationModal={setConfirmationModal}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Section */}
      <div className="mx-auto px-4 text-richblack-5 lg:w-[1260px]">
        <div className="mx-auto xl:max-w-[810px]">
          {/* What you'll learn */}
          <div className="my-8 border p-8">
            <h2 className="text-3xl font-semibold">What you'll learn</h2>
            <div className="mt-5">
              <ReactMarkdown>{whatYouWillLearn}</ReactMarkdown>
            </div>
          </div>

          {/* Course Content */}
          <div className="max-w-[830px]">
            <div className="flex flex-col gap-3">
              <h3 className="text-[28px] font-semibold">Course Content</h3>
              <div className="flex flex-wrap justify-between gap-2">
                <div className="flex gap-2">
                  <span>{sections.length} section(s)</span>
                  <span>{totalNoOfLectures} lecture(s)</span>
                </div>
                <button className="text-yellow-25" onClick={() => setIsActive([])}>
                  Collapse all
                </button>
              </div>
            </div>

            <div className="py-4">
              {sections.map((sec, idx) => (
                <CourseAccordionBar
                  key={idx}
                  course={sec}
                  isActive={isActive}
                  handleActive={handleActive}
                />
              ))}
            </div>
          </div>

          {/* Author Section */}
          <div className="mb-12 py-4">
            <h3 className="text-[28px] font-semibold">Author</h3>
            <div className="flex items-center gap-4 py-4">
              <img
                src={
                  instructorImage ||
                  `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
                }
                alt="Author"
                className="h-14 w-14 rounded-full object-cover"
              />
              <p className="text-lg">{`${instructor.firstName} ${instructor.lastName}`}</p>
            </div>
            <p className="text-richblack-50">
              {instructor?.additionalDetails?.about || "No bio available"}
            </p>
          </div>
        </div>
      </div>

      <Footer />

      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}

export default CourseDetails;
