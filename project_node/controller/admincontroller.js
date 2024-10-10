const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const adminmodel = require("../model/adminmodel");

const adminsignup = async (req, res) => {
    try {
        console.log(req.body, "body");
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(402).send({ message: "Input fields can't be empty", status: false });
        }

        const existinguser = await adminmodel.findOne({ email: email });
        if (existinguser) {
            return res.status(405).send({ message: "Admin already exists", status: false });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await adminmodel.create({ username, email, password: hashedPassword });

        if (!user) {
            return res.status(400).send({ message: "Unable to sign admin", status: false });
        }

        return res.status(200).send({ message: "Signup successful", status: true });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message || "Internal server error", status: false });
    }
};

const adminlogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(407).send({ message: "Input fields can't be empty", status: false });
        }

        const loggeduser = await adminmodel.findOne({ email: email });
        if (!loggeduser) {
            return res.status(402).send({ message: "Admin doesn't exist", status: false });
        }

        const isPasswordValid = await bcrypt.compare(password, loggeduser.password);
        if (!isPasswordValid) {
            return res.status(409).send({ message: "Invalid password", status: false });
        }

        return res.status(200).send({
            message: "Admin login successful",
            status: true,
            loggeduseremail: loggeduser.email,
            userid: loggeduser._id
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Internal server error", status: false });
    }
};

module.exports = { adminsignup, adminlogin };
