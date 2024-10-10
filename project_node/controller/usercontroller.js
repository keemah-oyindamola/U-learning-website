const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const usermodel = require("../model/usermodel")

const signup = async (req, res) => {
    try {
        console.log(req.body, "body");
        const { username, email, password } = req.body
        if (username == "" || password == "" || email == "") {
            res.status(402).send({ message: "input fields can't be empty", status: false })
        }

        const existinguser = await usermodel.findOne({ email: email })
        console.log(existinguser);
        if (existinguser) {
            res.status(405).send({ message: "user already exist", status: false })
        }


        const user = await usermodel.create({ username, email, password })
        if (!user) {
            res.status(400).send({ message: "unable to sign user", status: false })
        }
        return res.status(200).send({ message: "signup successful", status: true })


    } catch (error) {
        console.log(error);
        if (error) {
            res.status(407).send({ message: error.message })
        }
        return res(500).send({ message: "internal server error", status: false })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (email == "" || password == "") {
            return res.status(407).send({ message: "input fields can't be empty", status: false })
        }
        const loggeduser = await usermodel.findOne({ email: email })
        console.log(loggeduser);
        if (!loggeduser) {
            return res.status(402).send({ message: "user doesn't exist", status: false })
        }

        const hashpassword = await bcrypt.compare(password, loggeduser.password)
        if (!hashpassword) {
            return res.status(409).send({ message: "invalid password", status: false })
        }

        const loggeduseremail = loggeduser.email
        return res.status(200).send({ message: "login successful", status: true, loggeduseremail, userid: loggeduser._id })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "internal server error", status: false })
    }
}

const getalluser = async (req, res) => {
    try {
        // const {username, email} = req.body
        // console.log(req.body);
        const alluser = await usermodel.find({}, 'username email');
        return res.status(200).send({ message: "users gotten", status: true, alluser })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Failed to fetch users", status: false });
    }
}

const deleteuser = async (req, res) => {
    try {
        const userId = req.params.userId
        if (!userId) {
            return res.status(400).send({ message: "Invalid user ID format", status: false });
        }
        const deleteUser = await usermodel.findByIdAndDelete(userId)

        if (!deleteUser) {
            return res.status(402).send({ message: "user doesn't exist", status: false })
        }

        return res.status(200).send({ message: "User deleted successfully", status: true });
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"internal server error", status:false})
        
    }
}
module.exports = { signup, login, getalluser , deleteuser};