const express = require("express")
const router = express.Router()
const {signup, login, getalluser, deleteuser} = require("../controller/usercontroller")

router.post("/signup", signup)
router.post("/login", login)
router.get("/getalluser", getalluser)
router.delete("/deleteuser/:userId", deleteuser)

module.exports = router;