const express = require("express")
const router = express.Router()
//const { contactUsController } = require("../controllers/ContactUs")

router.post("/contact", ()=>{
    console.log("i have to wite contact use route")
})

module.exports = router