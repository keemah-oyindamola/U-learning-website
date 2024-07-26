const express = require("express")
const router = express.Router()
const {adminsignup, adminlogin} = require("../controller/admincontroller")

router.post("/signup", adminsignup)
router.post("/login", adminlogin)

module.exports =router;