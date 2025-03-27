import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../../../../services/operations/SettingsAPI";
import IconBtn from "../../../common/IconBtn";

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"];

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitProfileForm = async (data) => {
    console.log("Form Data Submitted:", data);

    try {
      await dispatch(updateProfile(token, data));
      navigate("/dashboard/my-profile");
    } catch (error) {
      console.log("Error in updating profile:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitProfileForm)}>
      {/* Profile Information */}
      <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <h2 className="text-lg font-semibold text-richblack-5">Profile Information</h2>

        {/* First and Last Name */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="firstName" className="lable-style">First Name</label>
            <input
              type="text"
              id="firstName"
              placeholder="Enter first name"
              className="form-style"
              defaultValue={user?.firstName}
              {...register("firstName", { required: "First name is required" })}
            />
            {errors.firstName && <span className="text-yellow-100">{errors.firstName.message}</span>}
          </div>

          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="lastName" className="lable-style">Last Name</label>
            <input
              type="text"
              id="lastName"
              placeholder="Enter last name"
              className="form-style"
              defaultValue={user?.lastName}
              {...register("lastName", { required: "Last name is required" })}
            />
            {errors.lastName && <span className="text-yellow-100">{errors.lastName.message}</span>}
          </div>
        </div>

        {/* Gender and Date of Birth */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="dateOfBirth" className="lable-style">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              className="form-style"
              // Ensure date format is in 'YYYY-MM-DD'
              defaultValue={user?.additionalDetails?.dateOfBirth?.split("T")[0] || ""}
              {...register("dateOfBirth", { required: "Date of Birth is required" })}
            />
            {errors.dateOfBirth && <span className="text-yellow-100">{errors.dateOfBirth.message}</span>}
          </div>

          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="gender" className="lable-style">Gender</label>
            <select
              id="gender"
              className="form-style"
              defaultValue={user?.additionalDetails?.gender}
              {...register("gender", { required: "Gender is required" })}
            >
              {genders.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </select>
            {errors.gender && <span className="text-yellow-100">{errors.gender.message}</span>}
          </div>
        </div>

        {/* Contact Number and About */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="contactNumber" className="lable-style">Contact Number</label>
            <input
              type="tel"
              id="contactNumber"
              placeholder="Enter contact number"
              className="form-style"
              defaultValue={user?.additionalDetails?.contactNumber}
              {...register("contactNumber", {
                required: "Contact number is required",
                minLength: { value: 10, message: "Minimum 10 digits" },
                maxLength: { value: 12, message: "Maximum 12 digits" },
              })}
            />
            {errors.contactNumber && <span className="text-yellow-100">{errors.contactNumber.message}</span>}
          </div>

          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="about" className="lable-style">About</label>
            <input
              type="text"
              id="about"
              placeholder="Enter bio details"
              className="form-style"
              defaultValue={user?.additionalDetails?.about}
              {...register("about", { required: "About information is required" })}
            />
            {errors.about && <span className="text-yellow-100">{errors.about.message}</span>}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => navigate("/dashboard/my-profile")}
          className="rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
        >
          Cancel
        </button>

        {/* Use "type=submit" for proper form submission */}
        <IconBtn onClick={handleSubmit(submitProfileForm)} text="Save" />
      </div>
    </form>
  );
}
