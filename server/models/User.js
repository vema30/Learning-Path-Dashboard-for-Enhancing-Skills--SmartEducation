const mongoose = require("mongoose");
const { resetPasswordToken } = require("../controllers/ResetPassword");
const Schema = mongoose.Schema;
const userSchema = new Schema({
       firstName:{
        type:String,
        required:true,
        trim:true
       },
       lastName:{
        type:String,
        required:true,
        trim:true
       },
       email:{
        type:String,
        required:true,
        trim:true
       },
       password:{
        type:String,
        required:true,
        //trim:true
       },
       accountType:{
        type:String,
        required:true,
        enum:['Admin','User','Instructor'],
       },
       additonalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile",
        required:true
       },
       courses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
       }],
       image:{
        type:String,
        required:true
       },
       token:{
              type:String,
             // required:true
       },
       resetPasswordExpires:{
           type:Date
       }
       ,
       courseProgress:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"CourseProgress"
       }]
});

const User = mongoose.model("User", userSchema);
module.exports = User;