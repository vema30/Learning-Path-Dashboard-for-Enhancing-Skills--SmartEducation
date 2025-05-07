const express = require("express");
const router = express.Router();

const { createTestQuestion } = require("../controllers/TestController");
const { auth } = require("../middlewares/auth");

// POST /api/test/create
router.post("/create", auth, createTestQuestion);

module.exports = router;
