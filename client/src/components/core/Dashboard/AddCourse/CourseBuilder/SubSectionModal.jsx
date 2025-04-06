import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";

import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import IconBtn from "../../../../common/IconBtn";
import Upload from "../Upload";

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [previewURL, setPreviewURL] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);

  useEffect(() => {
    if (view || edit) {
      setValue("lectureTitle", modalData.title);
      setValue("lectureDesc", modalData.description);
      setValue("lectureVideo", modalData.videoUrl);
      setPreviewURL(modalData.videoUrl || null);
    }
  }, [view, edit, modalData, setValue]);

  const isFormUpdated = () => {
    const currentValues = getValues();
    return (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    );
  };

  const handleEditSubsection = async () => {
    const currentValues = getValues();
    const formData = new FormData();
    formData.append("sectionId", modalData.sectionId);
    formData.append("subSectionId", modalData._id);
    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureTitle);
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", currentValues.lectureDesc);
    }
    if (currentValues.lectureVideo !== modalData.videoUrl) {
      formData.append("video", currentValues.lectureVideo);
    }
    setLoading(true);
    const result = await updateSubSection(formData, token);
    if (result) {
      const updatedCourseContent = (course?.courseContent || []).map((section) =>
        section._id === modalData.sectionId ? result : section
      );
      dispatch(setCourse({ ...course, courseContent: updatedCourseContent }));
    }
    setModalData(null);
    setLoading(false);
  };

  const onSubmit = async (data) => {
    if (view) return;
    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form");
      } else {
        handleEditSubsection();
      }
      return;
    }
  
    const sectionId = modalData?.sectionId || modalData;
    if (!sectionId) {
      toast.error("Section ID not found.");
      return;
    }
  
    const videoFile = data.lectureVideo;
    if (!videoFile) {
      toast.error("Please upload a video.");
      return;
    }
  
    const getVideoDuration = (file) => {
      return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.preload = "metadata";
  
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          resolve(video.duration);
        };
  
        video.onerror = () => {
          reject("Error loading video metadata");
        };
  
        video.src = URL.createObjectURL(file);
      });
    };
  
    try {
      const duration = await getVideoDuration(videoFile);
  
      const formData = new FormData();
      formData.append("sectionId", sectionId);
      formData.append("title", data.lectureTitle);
      formData.append("description", data.lectureDesc);
      formData.append("timeDuration", duration.toFixed(2));
      formData.append("video", videoFile);

      console.log("📤 FormData before sending:", [...formData.entries()]);
  
      setLoading(true);
      const result = await createSubSection(sectionId, formData, token);

      console.log("✅ API Response:", result);

      if (result) {
        console.log("✅ API Response:", result);
      
        const updatedSections = course.sections.map((section) =>
          section._id === sectionId ? result.updatedSection : section
        );
      
        const updatedCourse = { ...course, sections: updatedSections };
        
        dispatch(setCourse(updatedCourse));
        console.log("🔥 Updated Redux Course:", updatedCourse);
      
        toast.success("Subsection added successfully!");
      }
      
      
      setModalData(null);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching video duration:", error);
      toast.error("Failed to get video duration.");
    }
  };
  
  return (
    <div className="fixed inset-0 z-[1000] grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-gray-400 bg-gray-800">
        <div className="flex items-center justify-between rounded-t-lg bg-gray-700 p-5">
          <p className="text-xl font-semibold text-white">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-white" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-8 py-10">
          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            onFileSelect={(file) => {
              if (!pickerOpen) {
                setPickerOpen(true);
                setValue("lectureVideo", file);
                setPickerOpen(false);
                const videoURL = URL.createObjectURL(file);
                setPreviewURL(videoURL);
              }
            }}
          />

          {previewURL && (
            <div className="mt-4">
              <p className="text-sm text-white">Preview:</p>
              <video controls width="100%">
                <source src={previewURL} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          <div className="flex flex-col space-y-2">
            <label className="text-sm text-white">Lecture Title *</label>
            <input
              disabled={view || loading}
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="form-style w-full"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm text-white">Lecture Description *</label>
            <textarea
              disabled={view || loading}
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              className="form-style resize-x-none min-h-[130px] w-full"
            />
          </div>

          {!view && (
            <div className="flex justify-end">
              <IconBtn disabled={loading} text={loading ? "Loading.." : edit ? "Save Changes" : "Save"} type="submit" 
              onclick={handleSubmit(onSubmit)}/>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
