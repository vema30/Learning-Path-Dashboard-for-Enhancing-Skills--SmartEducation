import React from 'react';
import { HiOutlineMail, HiOutlineLocationMarker, HiOutlinePhone } from 'react-icons/hi';
import ContactUs from './ContactUs';

const Contact = () => {
  return (
    <div className="px-6 py-12 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Email */}
          <div className="flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-lg">
            <HiOutlineMail className="text-4xl text-blue-400" />
            <h3 className="text-xl font-semibold mt-2">Our friendly team is here to help.</h3>
            <p className="text-gray-400">support@example.com</p>
          </div>

          {/* Location */}
          <div className="flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-lg">
            <HiOutlineLocationMarker className="text-4xl text-green-400" />
            <h3 className="text-xl font-semibold mt-2">Visit Our Office</h3>
            <p className="text-gray-400">1234 Street Name, City, Country</p>
          </div>

          {/* Phone */}
          <div className="flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-lg">
            <HiOutlinePhone className="text-4xl text-red-400" />
            <h3 className="text-xl font-semibold mt-2">Call Us</h3>
            <p className="text-gray-400">Mon-Sat: 8 AM - 5 PM</p>
            <p className="text-gray-400">+12345678900</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <ContactUs />
        </div>
      </div>
    </div>
  );
};

export default Contact;