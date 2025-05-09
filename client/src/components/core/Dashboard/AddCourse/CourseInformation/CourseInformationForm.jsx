// import { useEffect, useState } from "react"
// import { useForm } from "react-hook-form"
// import { toast } from "react-hot-toast"
// import { HiOutlineCurrencyRupee } from "react-icons/hi"
// import { MdNavigateNext } from "react-icons/md"
// import { useDispatch, useSelector } from "react-redux"

// import {
//   addCourseDetails,
//   editCourseDetails,
//   fetchCourseCategories,
// } from "../../../../../services/operations/courseDetailsAPI"
// import { setCourse, setStep } from "../../../../../slices/courseSlice"
// import { COURSE_STATUS } from "../../../../../utils/constants"
// import IconBtn from "../../../../common/IconBtn"
// import Upload from "../Upload"
// import ChipInput from "./ChipInput"
// import RequirementsField from "./RequirementField"

// export default function CourseInformationForm() {
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     getValues,
//     formState: { errors },
//   } = useForm()

//   const dispatch = useDispatch()
//   const { token } = useSelector((state) => state.auth)
//   const { course, editCourse } = useSelector((state) => state.course)
//   const [loading, setLoading] = useState(false)
//   const [courseCategories, setCourseCategories] = useState([])

//   useEffect(() => {
//     const getCategories = async () => {
//       setLoading(true)
//       const categories = await fetchCourseCategories()
//       if (categories.length > 0) {
//         setCourseCategories(categories)
//       }
//       setLoading(false)
//     }

//     if (editCourse && course) {
//       setValue("courseTitle", course.courseName)
//       setValue("courseShortDesc", course.courseDescription)
//       setValue("coursePrice", course.price)
//       setValue("courseTags", course.tag)
//       setValue("courseBenefits", course.whatYouWillLearn)
//       setValue("courseCategory", course.category?._id)
//       setValue("courseRequirements", course.instructions)
//       setValue("courseImage", course.thumbnail)
//     }

//     getCategories()
//     // eslint-disable-next-line
//   }, [editCourse, course])

//   const isFormUpdated = () => {
//     const currentValues = getValues()

//     return (
//       currentValues.courseTitle !== course.courseName ||
//       currentValues.courseShortDesc !== course.courseDescription ||
//       currentValues.coursePrice !== course.price ||
//       JSON.stringify(currentValues.courseTags) !== JSON.stringify(course.tag) ||
//       currentValues.courseBenefits !== course.whatYouWillLearn ||
//       currentValues.courseCategory !== course.category?._id ||
//       JSON.stringify(currentValues.courseRequirements) !== JSON.stringify(course.instructions) ||
//       currentValues.courseImage !== course.thumbnail
//     )
//   }

//   const onSubmit = async (data) => {
//     const formData = new FormData()

//     const isNewImage =
//       data.courseImage &&
//       typeof data.courseImage !== "string" &&
//       data.courseImage[0] instanceof File

//     // Common fields
//     formData.append("courseName", data.courseTitle)
//     formData.append("courseDescription", data.courseShortDesc)
//     formData.append("price", data.coursePrice)
//     formData.append("tag", JSON.stringify(data.courseTags))
//     formData.append("whatYouWillLearn", data.courseBenefits)
//     formData.append("category", data.courseCategory)
//     formData.append("instructions", JSON.stringify(data.courseRequirements))

//     if (!editCourse) {
//       if (!isNewImage) {
//         toast.error("Thumbnail image is required")
//         return
//       }
//       formData.append("thumbnailImage", data.courseImage[0])
//       formData.append("status", COURSE_STATUS.DRAFT)
//     } else {
//       if (!course || !course._id) {
//         toast.error("Course data is missing or invalid.")
//         return
//       }

//       if (!isFormUpdated() && !isNewImage) {
//         toast.error("No changes made to the form")
//         return
//       }

//       formData.append("courseId", course._id)

//       if (isNewImage) {
//         formData.append("thumbnailImage", data.courseImage[0])
//       }
//     }

//     setLoading(true)
//        console.log("Form Data:", formData)
//     const result = editCourse
//       ? await editCourseDetails(formData, token)
//       : await addCourseDetails(formData, token)

//     if (result) {
//       dispatch(setStep(2))
//       dispatch(setCourse(result))
//     }

//     setLoading(false)
//   }

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
//     >
//       {/* Course Title */}
//       <div className="flex flex-col space-y-2">
//         <label className="text-sm text-richblack-5" htmlFor="courseTitle">
//           Course Title <sup className="text-pink-200">*</sup>
//         </label>
//         <input
//           id="courseTitle"
//           placeholder="Enter Course Title"
//           {...register("courseTitle", { required: true })}
//           className="form-style w-full text-black"
//         />
//         {errors.courseTitle && (
//           <span className="ml-2 text-xs text-pink-200">Course title is required</span>
//         )}
//       </div>

//       {/* Course Short Description */}
//       <div className="flex flex-col space-y-2">
//         <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
//           Course Short Description <sup className="text-pink-200">*</sup>
//         </label>
//         <textarea
//           id="courseShortDesc"
//           placeholder="Enter Description"
//           {...register("courseShortDesc", { required: true })}
//           className="form-style resize-none min-h-[130px] w-full text-black"
//         />
//         {errors.courseShortDesc && (
//           <span className="ml-2 text-xs text-pink-200">Course Description is required</span>
//         )}
//       </div>

//       {/* Course Price */}
//       <div className="flex flex-col space-y-2">
//         <label className="text-sm text-richblack-5" htmlFor="coursePrice">
//           Course Price <sup className="text-pink-200">*</sup>
//         </label>
//         <div className="relative">
//           <input
//             id="coursePrice"
//             placeholder="Enter Course Price"
//             {...register("coursePrice", {
//               required: true,
//               valueAsNumber: true,
//               pattern: { value: /^(0|[1-9]\d*)(\.\d+)?$/ },
//             })}
//             className="form-style w-full !pl-12 text-black"
//           />
//           <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl text-richblack-400" />
//         </div>
//         {errors.coursePrice && (
//           <span className="ml-2 text-xs text-pink-200">Course Price is required</span>
//         )}
//       </div>

//       {/* Course Category */}
//       <div className="flex flex-col space-y-2">
//         <label className="text-sm text-richblack-5" htmlFor="courseCategory">
//           Course Category <sup className="text-pink-200">*</sup>
//         </label>
//         <select
//           {...register("courseCategory", { required: true })}
//           defaultValue=""
//           id="courseCategory"
//           className="form-style w-full text-black"
//         >
//           <option value="" disabled>Choose a Category</option>
//           {!loading &&
//             courseCategories.map((category, i) => (
//               <option key={i} value={category._id}>
//                 {category.name}
//               </option>
//             ))}
//         </select>
//         {errors.courseCategory && (
//           <span className="ml-2 text-xs text-pink-200">Course Category is required</span>
//         )}
//       </div>

//       {/* Tags */}
//       <ChipInput
//         label="Tags"
//         name="courseTags"
//         placeholder="Enter Tags and press Enter"
//         register={register}
//         errors={errors}
//         setValue={setValue}
//         getValues={getValues}
//       />

//       {/* Course Thumbnail Image */}
//       <Upload
//         name="courseImage"
//         label="Course Thumbnail"
//         register={register}
//         setValue={setValue}
//         errors={errors}
//         editData={editCourse ? course?.thumbnail : null}
//       />

//       {/* Benefits */}
//       <div className="flex flex-col space-y-2">
//         <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
//           Benefits of the course <sup className="text-pink-200">*</sup>
//         </label>
//         <textarea
//           id="courseBenefits"
//           placeholder="Enter benefits of the course"
//           {...register("courseBenefits", { required: true })}
//           className="form-style resize-none min-h-[130px] w-full text-black"
//         />
//         {errors.courseBenefits && (
//           <span className="ml-2 text-xs text-pink-200">Benefits of the course is required</span>
//         )}
//       </div>

//       {/* Requirements */}
//       <RequirementsField
//         name="courseRequirements"
//         label="Requirements/Instructions"
//         register={register}
//         setValue={setValue}
//         errors={errors}
//         getValues={getValues}
//       />

//       {/* Buttons */}
//       <div className="flex justify-end gap-x-2">
//         {editCourse && (
//           <button
//             type="button"
//             onClick={() => dispatch(setStep(2))}
//             disabled={loading}
//             className="flex items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
//           >
//             Continue Without Saving
//           </button>
//         )}
//         <IconBtn
//           disabled={loading}
//           text={!editCourse ? "Next" : "Save Changes"}
//           onclick={handleSubmit(onSubmit)}
//         >
//           <MdNavigateNext />
//         </IconBtn>
//       </div>
//     </form>
//   )
// }

import { useEffect, useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import isEqual from "lodash.isequal"

import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse, setStep } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"
import IconBtn from "../../../../common/IconBtn"
import Upload from "../Upload"
import ChipInput from "./ChipInput"
import RequirementsField from "./RequirementField"

export default function CourseInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm()

  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { course, editCourse } = useSelector((state) => state.course)

  const [loading, setLoading] = useState(false)
  const [courseCategories, setCourseCategories] = useState([])

  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true)
        const categories = await fetchCourseCategories()
        if (categories.length > 0) {
          setCourseCategories(categories)
        }
      } catch (error) {
        toast.error("Failed to load categories")
      } finally {
        setLoading(false)
      }
    }

    if (editCourse) {
      setValue("courseTitle", course.courseName)
      setValue("courseShortDesc", course.courseDescription)
      setValue("coursePrice", course.price)
      setValue("courseTags", course.tag)
      setValue("courseBenefits", course.whatYouWillLearn)
      setValue("courseCategory", course.category?._id)
      setValue("courseRequirements", course.instructions)
      setValue("courseImage", course.thumbnail)
    }

    getCategories()
  }, [])

  const isFormUpdated = () => {
    const currentValues = getValues()

    const original = {
      courseTitle: course.courseName,
      courseShortDesc: course.courseDescription,
      coursePrice: course.price,
      courseTags: course.tag,
      courseBenefits: course.whatYouWillLearn,
      courseCategory: course.category?._id,
      courseRequirements: course.instructions,
      courseImage: course.thumbnail,
    }

    const current = {
      courseTitle: currentValues.courseTitle,
      courseShortDesc: currentValues.courseShortDesc,
      coursePrice: currentValues.coursePrice,
      courseTags: currentValues.courseTags,
      courseBenefits: currentValues.courseBenefits,
      courseCategory: currentValues.courseCategory,
      courseRequirements: currentValues.courseRequirements,
      courseImage: currentValues.courseImage,
    }

    return !isEqual(original, current)
  }

  const onSubmit = async (data) => {
    if (editCourse) {
      if (!course || !course._id) {
        toast.error("Error: Course data is missing or invalid.")
        return
      }

      if (isFormUpdated()) {
        const currentValues = getValues()
        const formData = new FormData()
        formData.append("courseId", course._id)

        if (currentValues.courseTitle !== course.courseName)
          formData.append("courseName", data.courseTitle)

        if (currentValues.courseShortDesc !== course.courseDescription)
          formData.append("courseDescription", data.courseShortDesc)

        if (currentValues.coursePrice !== course.price)
          formData.append("price", data.coursePrice)

        if (
          currentValues.courseTags.toString() !== course.tag.toString()
        )
          formData.append("tag", JSON.stringify(data.courseTags))

        if (currentValues.courseBenefits !== course.whatYouWillLearn)
          formData.append("whatYouWillLearn", data.courseBenefits)

        formData.append("category", data.courseCategory)
        formData.append("instructions", JSON.stringify(data.courseRequirements))

        if (currentValues.courseImage instanceof File) {
          formData.append("thumbnailImage", data.courseImage)
        }

        setLoading(true)
        console.log("formData", formData) ;
        const result = await editCourseDetails(course._id,formData, token)
        setLoading(false)

        if (result) {
          dispatch(setStep(2))
          dispatch(setCourse(result))
        }
      } else {
        toast.error("No changes made to the form")
      }

      return
    }

    const formData = new FormData()
    formData.append("courseName", data.courseTitle)
    formData.append("courseDescription", data.courseShortDesc)
    formData.append("price", data.coursePrice)
    formData.append("tag", JSON.stringify(data.courseTags))
    formData.append("whatYouWillLearn", data.courseBenefits)
    formData.append("category", data.courseCategory)
    formData.append("status", COURSE_STATUS.DRAFT)
    formData.append("instructions", JSON.stringify(data.courseRequirements))
    formData.append("thumbnailImage", data.courseImage)

    setLoading(true)
    const result = await addCourseDetails(formData, token)
    setLoading(false)

    if (result) {
      dispatch(setStep(2))
      dispatch(setCourse(result))
    }
  }

  const renderedCategories = useMemo(
    () =>
      courseCategories.map((category, indx) => (
        <option key={indx} value={category?._id}>
          {category?.name}
        </option>
      )),
    [courseCategories]
  )

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >
      {/* Course Title */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseTitle">
          Course Title <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Enter Course Title"
          {...register("courseTitle", { required: true })}
          className="form-style w-full"
        />
        {errors.courseTitle && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course title is required
          </span>
        )}
      </div>

      {/* Course Short Description */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
          Course Short Description <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Enter Description"
          {...register("courseShortDesc", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.courseShortDesc && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Description is required
          </span>
        )}
      </div>

      {/* Course Price */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="coursePrice">
          Course Price <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="coursePrice"
            placeholder="Enter Course Price"
            {...register("coursePrice", {
              required: true,
              valueAsNumber: true,
              min: 1,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            className="form-style w-full !pl-12"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl text-richblack-400" />
        </div>
        {errors.coursePrice && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Price is required
          </span>
        )}
      </div>

      {/* Course Category */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseCategory">
          Course Category <sup className="text-pink-200">*</sup>
        </label>
        <select
          {...register("courseCategory", { required: true })}
          defaultValue=""
          id="courseCategory"
          className="form-style w-full"
        >
          <option value="" disabled>
            Choose a Category
          </option>
          {!loading && renderedCategories}
        </select>
        {errors.courseCategory && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Category is required
          </span>
        )}
      </div>

      {/* Course Tags */}
      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />

      {/* Course Thumbnail Image */}
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />

      {/* Benefits of the course */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
          Benefits of the course <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Enter benefits of the course"
          {...register("courseBenefits", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full text-black"
        />
        {errors.courseBenefits && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Benefits of the course is required
          </span>
        )}
      </div>

      {/* Requirements/Instructions */}
      <RequirementsField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />

      {/* Buttons */}
      <div className="flex justify-end gap-x-2">
        {editCourse && (
          <button
            type="button"
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className="flex items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
          >
            Continue Without Saving
          </button>
        )}
<button
  onClick={handleSubmit(onSubmit)}
  className="flex items-center gap-x-2 rounded-md bg-yellow-50 py-[8px] px-[20px] font-semibold text-richblack-900 disabled:cursor-not-allowed disabled:bg-richblack-700 disabled:text-richblack-500"
>
  {!editCourse ? "Next" : "Save Changes"}
  <MdNavigateNext />
</button>

      </div>
    </form>
  )
}