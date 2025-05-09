// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const CreateCategory = () => {
//   const [categoryName, setCategoryName] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Reset previous messages
//     setError('');
//     setSuccess('');

//     if (!categoryName) {
//       setError('Category name is required');
//       return;
//     }

//     try {
//       // Sending POST request to the backend API
//       const response = await axios.post('http://localhost:4000/api/categories', { name: categoryName });

//       // On success, display the success message and reset the input
//       setSuccess('Category created successfully');
//       setCategoryName('');
//       // You can redirect to another page (e.g., the categories list page)
//       setTimeout(() => {
//         navigate('/dashboard');  // Change the redirect path as needed
//       }, 2000);
//     } catch (err) {
//       setError('Error creating category, please try again.');
//       console.error(err);
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto p-6 border rounded-md shadow-lg text-black">
//       <h2 className="text-2xl font-semibold mb-4">Create Category</h2>

//       {error && <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>}
//       {success && <div className="bg-green-500 text-white p-2 rounded mb-4">{success}</div>}

//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">Category Name</label>
//           <input
//             type="text"
//             id="categoryName"
//             className="w-full p-2 mt-2 border rounded-md"
//             value={categoryName}
//             onChange={(e) => setCategoryName(e.target.value)}
//             placeholder="Enter category name"
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
//         >
//           Create Category
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateCategory;
const RatingAndReview=require("../models/RatingAndReview")
const Course=require("../models/Course")
exports.createRating=async(req,res)=>{
try{
    const userId=req.user.id;
    const {rating,review,courseId}=req.body;
    const courseDetails=await Course.findOne({_id:courseId,studentsEnrolled:{$elemMatch:{$eq:userId}},})
    if (!courseDetails) {
        return res.status(404).json({
            success: false,
            message: 'Student not enrolled in the course.',
        });
    }
    const alreadyReviewed=await RatingAndReview.findOne({user:userId,course:courseId,})
    if (alreadyReviewed) {
        return res.status(404).json({
            success: false,
            message: 'Course is already revied by the user.',
        });
    }
    const ratingReview=await RatingAndReview.create({rating,review,course:courseId,user:userId})
    const updatedCourseDetails= await Course.findByIdAndUpdate({_id:courseId},{$push:{ratingAndReviews:ratingReview._id}},{new:true})
    console.log(updatedCourseDetails);
    return res.status(200).json({
        success: true,
        message: 'Rating and review created successfully',
    });
}
catch (error) {
    console.log(error);
    return res.status(500).json({
        success: false,
        message: 'Error in creating rating.',
    });
}
}
exports.getAverageRating=async(req,res)=>{
    try{
        const courseId=req.body.courseId;
        const result=await RatingAndReview.aggregate([{
            $match:{course:new mongoose.Types.ObjectId(courseId)}
        },{$group:{_id:null,averageRating:{$avg:"$rating"}}}])
        if(result.length>0){
            return res.status(200).json({
                success: true,
                message:"No rating till now avg is 0",
                averageRating:0,
            });  
        }
        return res.status(200).json({
            success: true,
            averageRating:result[0].averageRating
        }); 
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Error in getting avg rating.',
        });
    }
}
exports.getAllRating=async(req,res)=>{
try{
    const allReviews=await RatingAndReview.find({}).sort({rating:{desc}}).populate({path:"user",
select:"firstName lastName email image"}).populate({path:"course",select:"courseName"}).exec();
return res.status(200).json({
    success: true,
    message:"All reviews fetched successfully",
    data:allReviews
}); 
}
catch (error) {
    console.log(error);
    return res.status(500).json({
        success: false,
        message: 'Error in getting all ratings.',
    });
}
}