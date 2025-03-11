import React, { useState } from "react";
import CTButton from "../common/CTButton";
import countryCodes from "../../data/countrycode.json";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    countryCode: countryCodes[0]?.code || "+1",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Form Submitted:", formData);
    alert("Thank you! Your message has been sent.");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      countryCode: countryCodes[0]?.code || "+1",
      message: "",
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 bg-richblue-700 shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
        Get in Touch
      </h2>
      <p className="text-gray-700 text-center mb-6">
        Have questions? Fill out the form below and we’ll get back to you soon.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First Name & Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="First Name"
            />
            {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Last Name"
            />
            {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your Email"
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Phone Number with Country Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium">Country Code</label>
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              {countryCodes.map((code, index) => (
                <option key={index} value={code.code}>
                  {code.name} ({code.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Phone Number"
            />
            {errors.phoneNumber && <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-gray-700 font-medium">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your Message"
            rows="5"
          ></textarea>
          {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <CTButton active={true} type="submit">Send Message</CTButton>
        </div>
      </form>
    </div>
  );
};

export default ContactUs;
