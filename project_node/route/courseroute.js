const express = require("express")
const router = express.Router()
const {getcourseinfo, videocontroller, getallcourses, getcourse} = require("../controller/coursecontroller")

router.post("/courseupload", getcourseinfo)
router.post("/uploadvideo", videocontroller)
router.get("/getallcourses", getallcourses)
router.get("/getcourse/:id", getcourse)
// router.post("/imgupload", uploadimg)

module.exports = router
