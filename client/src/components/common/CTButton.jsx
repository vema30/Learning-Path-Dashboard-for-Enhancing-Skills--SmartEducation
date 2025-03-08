import React from "react";
import { Link } from "react-router-dom";
const Button = ({ children, active,linkto }) => {
  return (
    <Link to={linkto} className={`${active ? "bg-yellow-50 text-black hover:bg-yellow-100 scale-95 transition-all duration-200" : "bg-richblack-500 hover:bg-richblack-400 scale-95 transition-all duration-200"} p-3 rounded-md font-bold text-center`}>
      {children}
    </Link>
  );
};

export default Button;
