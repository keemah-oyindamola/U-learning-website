const express = require("express")
const router = express.Router()
const {adminsignup, adminlogin} = require('../controller/admincontroller')

router.post("/adminlogin", adminlogin)
router.post("/adminsignup", adminsignup)

module.exports = router