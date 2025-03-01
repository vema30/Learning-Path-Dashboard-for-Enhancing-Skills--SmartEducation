# Learning-Path-Dashboard-for-Enhancing-Skills--SmartEducation
Construct a learning progress monitoring system that features a dashboard of student’s learning progress and helps teachers formulate individualized learning pathways for students with associated learning materials.


i did revison of backend technologies which i uses  in my project
i did a basic authApp using  JWT & cookies used mvc Model-View-Controller, a software design pattern 

npm packages i installed : express mongoose nodemon  dotenv  cookie-parser nodemailer otp-generator  bcrypt 

created 9 schemas   Courses , CourseProgress ,Otp, Profile , Ratingand review , section ,subsection,tag,otp,and user
for creating models & schemas i used reference from mdn for better clarity 
https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/mongoose

for making relationship : type :mongoose.Schema.Types.ObjectId ref:"someSchema"


for sending mail i used nodemailer and took reference from this medium article 
https://medium.com/coox-tech/send-mail-using-node-js-express-js-with-nodemailer-93f4d62c83ee


created auth used jwt used cokkies i took reference from gfg
https://www.geeksforgeeks.org/json-web-token-jwt/
used this jwt to get data for authentication


created controllers for login , signup , resetpassword, resetpasswordtoken,courses creation by instructor

1 march
todo :
1. shloud write controllers for sections and subsections 
2 should learn razarpay payment intefration  