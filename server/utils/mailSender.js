const nodemailer = require("nodemailer");
const dotenv=require("dotenv");
dotenv.config();
const mailSender = async (email, title, body) => {
    console.log("jjndfnjdjnv i am un mailsednder")
    try{
            let transporter = nodemailer.createTransport({
                host:process.env.MAIL_HOST,
                auth:{
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASSWORD,
                }
            })


            let info = await transporter.sendMail({
                from: process.env.MAIL_HOST,
                to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
            })
            console.log(info);
            return info;
    }
    catch(error) {
        console.log(error.message);
    }
}


module.exports = mailSender;