// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "react-hot-toast";
// import { IoAddCircleOutline } from "react-icons/io5";
// import { MdNavigateNext } from "react-icons/md";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";

// import {
//   createSection,
//   updateSection,
// } from "../../../../../services/operations/courseDetailsAPI";
// import {
//   setCourse,
//   setEditCourse,
//   setStep,
// } from "../../../../../slices/courseSlice";
// import IconBtn from "../../../../common/IconBtn";
// import NestedView from "./NestedView";

// const CREATE_TEST_API = "http://localhost:4000/api/test/create";

// // Function to handle test creation
// async function createTest(data, token) {
//   const toastId = toast.loading("Adding test question...");
//   let result = null;
//   try {
//     const response = await axios.post(CREATE_TEST_API, data, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     result = response.data;
//     toast.success("Test created successfully");
//   } catch (error) {
//     console.error("CREATE TEST ERROR:", error);
//     toast.error("Failed to create test");
//   }
//   toast.dismiss(toastId);
//   return result;
// }

// export default function CourseBuilderForm() {
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm();

//   const { course } = useSelector((state) => state.course);
//   const { token } = useSelector((state) => state.auth);
//   const [loading, setLoading] = useState(false);
//   const [editSectionName, setEditSectionName] = useState(null);
//   const dispatch = useDispatch();

//   // Test Creation State
//   const [questions, setQuestions] = useState([
//     { question: "", options: ["", "", "", ""], correctOption: "" },
//   ]);

//   // Section Form Submit
//   const onSubmit = async (data) => {
//     setLoading(true);
//     let result;

//     if (editSectionName) {
//       result = await updateSection(
//         {
//           sectionName: data.sectionName,
//           sectionId: editSectionName,
//           courseId: course._id,
//         },
//         token
//       );
//     } else {
//       result = await createSection(
//         {
//           sectionName: data.sectionName,
//           courseId: course._id,
//         },
//         token
//       );
//     }

//     if (result) {
//       dispatch(setCourse(result));
//       setEditSectionName(null);
//       setValue("sectionName", "");
//     }

//     setLoading(false);
//   };

//   const cancelEdit = () => {
//     setEditSectionName(null);
//     setValue("sectionName", "");
//   };

//   const handleChangeEditSectionName = (sectionId, sectionName) => {
//     if (editSectionName === sectionId) {
//       cancelEdit();
//       return;
//     }
//     setEditSectionName(sectionId);
//     setValue("sectionName", sectionName);
//   };

//   const goToNext = () => {
//     if (!Array.isArray(course?.sections) || course.sections.length === 0) {
//       toast.error("Please add at least one section");
//       return;
//     }

//     const anyEmpty = course.sections.some(
//       (section) =>
//         !Array.isArray(section?.subSections) || section.subSections.length === 0
//     );
//     if (anyEmpty) {
//       toast.error("Please add at least one lecture in each section");
//       return;
//     }

//     dispatch(setStep(3));
//   };

//   const goBack = () => {
//     dispatch(setStep(1));
//     dispatch(setEditCourse(true));
//   };

//   // Handle adding multiple questions
//   const handleAddQuestion = () => {
//     setQuestions([
//       ...questions,
//       { question: "", options: ["", "", "", ""], correctOption: "" },
//     ]);
//   };

//   const handleQuestionChange = (index, field, value) => {
//     const newQuestions = [...questions];
//     newQuestions[index][field] = value;
//     setQuestions(newQuestions);
//   };

//   const handleOptionChange = (index, optionIndex, value) => {
//     const newQuestions = [...questions];
//     newQuestions[index].options[optionIndex] = value;
//     setQuestions(newQuestions);
//   };

//   const handleCorrectOptionChange = (index, value) => {
//     const newQuestions = [...questions];
//     newQuestions[index].correctOption = value;
//     setQuestions(newQuestions);
//   };

//   // Function that will handle creating the test on button click
//   const handleCreateTest = async () => {
//     const isValid = questions.every(
//       (q) =>
//         q.question.trim() !== "" &&
//         q.options.every((opt) => opt.trim() !== "") &&
//         q.correctOption !== ""
//     );

//     if (!isValid) {
//       toast.error("Please fill all fields for each question");
//       return;
//     }

//     for (const question of questions) {
//       const payload = {
//         courseId: course._id,
//         question: question.question,
//         options: question.options,
//         correctOption: Number(question.correctOption),
//       };

//       const res = await createTest(payload, token);
//       if (res?.success) {
//         toast.success("Test created successfully!");
//       }
//     }

//     // Reset after submitting
//     setQuestions([
//       { question: "", options: ["", "", "", ""], correctOption: "" },
//     ]);
//   };

//   return (
//     <div className="space-y-8 rounded-md border border-richblack-700 bg-richblack-800 p-6">
//       <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>

//       {/* Section Form */}
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div className="flex flex-col space-y-2">
//           <label className="text-sm text-richblack-5" htmlFor="sectionName">
//             Section Name <sup className="text-pink-200">*</sup>
//           </label>
//           <input
//             id="sectionName"
//             disabled={loading}
//             placeholder="Add a section to build your course"
//             {...register("sectionName", { required: true })}
//             className="form-style w-full"
//           />
//           {errors.sectionName && (
//             <span className="ml-2 text-xs tracking-wide text-pink-200">
//               Section name is required
//             </span>
//           )}
//         </div>

//         <div className="flex items-end gap-x-4">
//           <IconBtn
//             type="submit"
//             disabled={loading}
//             text={editSectionName ? "Edit Section Name" : "Create Section"}
//             outline={true}
//             onclick={handleSubmit(onSubmit)}
//           >
//             <IoAddCircleOutline size={20} className="text-yellow-50" />
//           </IconBtn>
//           {editSectionName && (
//             <button
//               type="button"
//               onClick={cancelEdit}
//               className="text-sm text-richblack-300 underline"
//             >
//               Cancel Edit
//             </button>
//           )}
//         </div>
//       </form>

//       {/* Section View */}
//       {course?.sections?.length > 0 && (
//         <div>
//           <NestedView
//             handleChangeEditSectionName={handleChangeEditSectionName}
//           />
//         </div>
//       )}

//       {/* Test Creation */}
//       <div className="mt-8 border-t border-richblack-700 pt-6">
//         <p className="text-xl font-semibold text-richblack-5 mb-4">
//           Add Test Questions
//         </p>

//         <form className="space-y-4">
//           {questions.map((question, index) => (
//             <div key={index} className="space-y-4">
//               <div className="flex flex-col space-y-2">
//                 <label className="text-sm text-richblack-5">Question</label>
//                 <input
//                   className="form-style"
//                   value={question.question}
//                   onChange={(e) =>
//                     handleQuestionChange(index, "question", e.target.value)
//                   }
//                   placeholder={`Enter question ${index + 1}`}
//                 />
//               </div>

//               {question.options.map((opt, optionIndex) => (
//                 <div key={optionIndex} className="flex items-center space-x-2">
//                   <input
//                     className="form-style w-full"
//                     value={opt}
//                     onChange={(e) =>
//                       handleOptionChange(index, optionIndex, e.target.value)
//                     }
//                     placeholder={`Option ${optionIndex + 1}`}
//                   />
//                   <input
//                     type="radio"
//                     name={`correctOption-${index}`}
//                     checked={question.correctOption === String(optionIndex)}
//                     onChange={() => handleCorrectOptionChange(index, String(optionIndex))}
//                   />
//                   <label className="text-sm text-richblack-5">Correct</label>
//                 </div>
//               ))}
//             </div>
//           ))}

//           <div className="flex items-center gap-x-4">
//             <button
//               type="button"
//               onClick={handleAddQuestion}
//               className="flex items-center gap-x-2 text-sm font-semibold text-richblack-5"
//             >
//               <IoAddCircleOutline size={20} />
//               <span>Add Another Question</span>
//             </button>

//             <IconBtn type="button" text="Create Test" onclick={handleCreateTest} />
//           </div>
//         </form>
//       </div>

//       {/* Next Prev Button */}
//       <div className="flex justify-end gap-x-3">
//         <button
//           onClick={goBack}
//           className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-2 px-5 font-semibold text-richblack-900"
//         >
//           Back
//         </button>
//         <IconBtn disabled={loading} text="Next" onclick={goToNext}>
//           <MdNavigateNext />
//         </IconBtn>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetailsAPI";
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../../slices/courseSlice";
import IconBtn from "../../../../common/IconBtn";
import NestedView from "./NestedView";

export default function CourseBuilderForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [editSectionName, setEditSectionName] = useState(null);
  const dispatch = useDispatch();

  // Section Form Submit
  const onSubmit = async (data) => {
    setLoading(true);
    let result;

    if (editSectionName) {
      console.log("course",course._id);
      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        },
        token
      );
    } else {
      result = await createSection(
        {
          sectionName: data.sectionName,
          courseId: course._id,
        },
        token
      );
    }

    if (result) {
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName", "");
    }

    setLoading(false);
  };

  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "");
  };

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };

  const goToNext = () => {
    if (!Array.isArray(course?.sections) || course.sections.length === 0) {
      toast.error("Please add at least one section");
      return;
    }

    const anyEmpty = course.sections.some(
      (section) =>
        !Array.isArray(section?.subSections) || section.subSections.length === 0
    );
    if (anyEmpty) {
      toast.error("Please add at least one lecture in each section");
      return;
    }

    dispatch(setStep(3));
  };

  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  };

  return (
    <div className="space-y-8 rounded-md border border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>

      {/* Section Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="sectionName">
            Section Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="sectionName"
            disabled={loading}
            placeholder="Add a section to build your course"
            {...register("sectionName", { required: true })}
            className="form-style w-full"
          />
          {errors.sectionName && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Section name is required
            </span>
          )}
        </div>

        <div className="flex items-end gap-x-4">
          <IconBtn
            type="submit"
            disabled={loading}
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline={true}
            onclick={handleSubmit(onSubmit)}
          >
            <IoAddCircleOutline size={20} className="text-yellow-50" />
          </IconBtn>
          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Section View */}
      {course?.sections?.length > 0 && (
        <div>
          <NestedView
            handleChangeEditSectionName={handleChangeEditSectionName}
          />
        </div>
      )}

      {/* Next Prev Button */}
      <div className="flex justify-end gap-x-3">
        <button
          onClick={goBack}
          className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-2 px-5 font-semibold text-richblack-900"
        >
          Back
        </button>
        <IconBtn disabled={loading} text="Next" onclick={goToNext}>
          <MdNavigateNext />
        </IconBtn>
      </div>
    </div>
  );
}
