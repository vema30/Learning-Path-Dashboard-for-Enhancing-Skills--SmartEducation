import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { editCourseDetails } from "../../../../../services/operations/courseDetailsAPI";
import { resetCourseState, setStep } from "../../../../../slices/courseSlice";
import { COURSE_STATUS } from "../../../../../utils/constants";
import IconBtn from "../../../../common/IconBtn";

export default function PublishCourse() {
  const { register, handleSubmit, setValue, getValues, watch } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);

  // Watch checkbox state
  const isPublic = watch("public", false);

  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true);
    } else {
      setValue("public", false);
    }
  }, [course, setValue]);

  const goBack = () => {
    dispatch(setStep(2));
  };

  const goToCourses = () => {
    dispatch(resetCourseState());
    navigate("/dashboard/my-courses");
  };

  const handleCoursePublish = async () => {
    if (!course || !course._id) {
      console.error("Error: Course data is missing or not loaded");
      return;
    }
  
    if (
      (course?.status === COURSE_STATUS.PUBLISHED && getValues("public")) ||
      (course?.status === COURSE_STATUS.DRAFT && !getValues("public"))
    ) {
      goToCourses();
      return;
    }

    const formData = new FormData();
    formData.append("courseId", course._id);
    formData.append("status", getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT);

    setLoading(true);
    const result = await editCourseDetails(formData, token);
    if (result) {
      goToCourses();
    }
    setLoading(false);
  };

  const onSubmit = () => {
    handleCoursePublish();
  };

  return (
    <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Publish Settings</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Checkbox for Publish Setting */}
        <div className="my-6">
          <label className="inline-flex items-center text-lg text-richblack-400">
            <input
              type="checkbox"
              {...register("public")}
              checked={isPublic} // Ensures checkbox updates when clicked
              onChange={(e) => setValue("public", e.target.checked)} // Handles state change
              className="h-5 w-5 rounded border-gray-300 bg-richblack-500 text-richblack-400 checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-richblack-5"
            />
            <span className="ml-2">Make this course public</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="ml-auto flex max-w-max items-center gap-x-4">
          <button
            disabled={loading}
            type="button"
            onClick={goBack}
            className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
          >
            Back
          </button>
          <IconBtn disabled={loading} text="Save Changes" onclick={handleSubmit(onSubmit)} />
        </div>
      </form>
    </div>
  );
}
