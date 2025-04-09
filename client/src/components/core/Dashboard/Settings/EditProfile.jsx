import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../../../../services/operations/SettingsAPI";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import IconBtn from "../../../common/IconBtn";

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"];

function FormField({ label, id, type = "text", register, validation, defaultValue, error, placeholder }) {
  return (
    <div className="flex flex-col gap-2 lg:w-[48%]">
      <label htmlFor={id} className="text-sm font-semibold text-white">{label}</label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        defaultValue={defaultValue}
        {...register(id, validation)}
        className="w-full p-3 rounded-md bg-richblack-700 text-white border border-richblack-600 focus:border-white focus:outline-none"
      />
      {error && <span className="mt-1 text-sm text-yellow-100">{error.message}</span>}
    </div>
  );
}

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const selectedGender = watch("gender");

  const submitProfileForm = async (data) => {
    console.log("data",data);
    try {
      // Handle custom gender input
      if (data.gender === "Other" && data.customGender) {
        data.gender = data.customGender;
      }
      delete data.customGender;

      // Phone number format cleanup
      data.contactNumber = data.contactNumber.replace(/\D/g, "");

      await dispatch(updateProfile(token, data));
      toast.success("Profile updated successfully");
      navigate("/dashboard/my-profile");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error in updating profile:", error.message);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(submitProfileForm)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div className="my-10 flex flex-col gap-y-6 rounded-md border border-richblack-700 bg-richblack-800 p-8 px-12 text-white">
        <h2 className="text-lg font-semibold text-richblack-5">Profile Information</h2>

        {/* Name */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <FormField
            label="First Name"
            id="firstName"
            defaultValue={user?.firstName}
            register={register}
            validation={{ required: "First name is required" }}
            error={errors.firstName}
            placeholder="Enter first name"
          />
          <FormField
            label="Last Name"
            id="lastName"
            defaultValue={user?.lastName}
            register={register}
            validation={{ required: "Last name is required" }}
            error={errors.lastName}
            placeholder="Enter last name"
          />
        </div>

        {/* Date of Birth & Gender */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <FormField
            label="Date of Birth"
            id="dateOfBirth"
            type="date"
            defaultValue={user?.additionalDetails?.dateOfBirth?.split("T")[0]}
            register={register}
            validation={{ required: "Date of Birth is required" }}
            error={errors.dateOfBirth}
          />
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="gender" className="text-sm font-semibold text-white">Gender</label>
            <select
              id="gender"
              className="w-full p-3 rounded-md bg-richblack-700 text-white border border-richblack-600 focus:border-white focus:outline-none"
              defaultValue={user?.additionalDetails?.gender}
              {...register("gender", { required: "Gender is required" })}
            >
              {genders.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </select>
            {errors.gender && <span className="mt-1 text-sm text-yellow-100">{errors.gender.message}</span>}
            {selectedGender === "Other" && (
              <input
                type="text"
                placeholder="Enter your gender"
                className="mt-2 w-full p-3 rounded-md bg-richblack-700 text-white border border-richblack-600 focus:border-white focus:outline-none"
                {...register("customGender", { required: "Please specify your gender" })}
              />
            )}
          </div>
        </div>

        {/* Contact & About */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <FormField
            label="Contact Number"
            id="contactNumber"
            type="tel"
            defaultValue={user?.additionalDetails?.contactNumber}
            register={register}
            validation={{
              required: "Contact number is required",
              pattern: {
                value: /^[0-9]{10,12}$/,
                message: "Enter a valid contact number (10-12 digits)",
              },
            }}
            error={errors.contactNumber}
            placeholder="Enter contact number"
          />
          <FormField
            label="About"
            id="about"
            defaultValue={user?.additionalDetails?.about}
            register={register}
            validation={{ required: "About is required" }}
            error={errors.about}
            placeholder="Write a short bio"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => navigate("/dashboard/my-profile")}
          className="rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50 hover:bg-richblack-600"
        >
          Cancel
        </button>
        <IconBtn text="Save" onclick={handleSubmit(submitProfileForm)} />
      </div>
    </motion.form>
  );
}
