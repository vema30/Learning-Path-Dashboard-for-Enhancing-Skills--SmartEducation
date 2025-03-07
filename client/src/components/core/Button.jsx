import React from 'react'

export const Button = ({children,active,linkto,arrow}) => {
  return (
    <div className={`text-center text-[13px] px-6 py-3 rounded-md font-bold ${active?"bg-yellow-50 text-black border-r-yellow-100 border-b-yellow-100" :"bg-richblack-800 text-white border-r-pure-greys-300  border-b-pure-greys-300"} cursor-pointer hover:scale-95 transition-all duration-200`}>{children}</div>
  )
}
