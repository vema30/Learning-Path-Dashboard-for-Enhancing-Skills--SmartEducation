import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function RequirementsField({
  name,
  label,
  register,
  setValue,
  errors,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course);
  const [requirement, setRequirement] = useState("");
  const [requirementsList, setRequirementsList] = useState([]);

  useEffect(() => {
    if (editCourse && Array.isArray(course?.instructions)) {
      setRequirementsList(course.instructions);
      setValue(name, course.instructions);
    }
  }, [editCourse, course, setValue, name]);

  useEffect(() => {
    register(name, { required: true, validate: (value) => value.length > 0 });
  }, [register, name]);

  useEffect(() => {
    setValue(name, requirementsList);
  }, [requirementsList, setValue, name]);

  const handleAddRequirement = () => {
    if (requirement.trim()) {
      const updatedList = [...requirementsList, requirement.trim()];
      setRequirementsList(updatedList);
      setValue(name, updatedList);
      setRequirement("");
    }
  };

  const handleRemoveRequirement = (index) => {
    const updatedRequirements = requirementsList.filter((_, i) => i !== index);
    setRequirementsList(updatedRequirements);
    setValue(name, updatedRequirements);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>
      <div className="flex flex-col items-start space-y-2">
        <input
          type="text"
          id={name}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          className="form-style w-full"
        />
        <button
          type="button"
          onClick={handleAddRequirement}
          className="font-semibold text-yellow-50"
        >
          Add
        </button>
      </div>
      {requirementsList.length > 0 && (
        <ul className="mt-2 list-inside list-disc">
          {requirementsList.map((requirement, index) => (
            <li key={index} className="flex items-center text-richblack-5">
              <span>{requirement}</span>
              <button
                type="button"
                className="ml-2 text-xs text-pure-greys-300"
                onClick={() => handleRemoveRequirement(index)}
              >
                clear
              </button>
            </li>
          ))}
        </ul>
      )}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
}
