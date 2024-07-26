const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const adminmodel = require("../model/adminmodel")

const adminsignup = async (req, res)=>{
    try {
        console.log(req.body, "body");
        const{username, email, password} = req.body
        if (username == "" || password == "" || email == "") {
           res.status(402).send({message:"input fields can't be empty", status:false}) 
        }

        const existinguser = await adminmodel.findOne({email:email})
        console.log(existinguser);
        if (existinguser) {
            res.status(405).send({message:"admin already exist", status:false})
        }


        const user = await adminmodel.create({username, email, password})
        if (!user) {
            res.status(400).send({message:"unable to sign admin", status:false})
        }
        return res.status(200).send({message:"signup successful", status:true})


    } catch (error) {
        console.log(error);
        if (error) {
            res.status(407).send({message:error.message})  
        }
        return res(500).send({message:"internal server error", status:false})
    }
}

const adminlogin = async(req,res)=>{
   try {
    const{email, password} = req.body
    if (email == "" || password == "") {
      return  res.status(407).send({message:"input fields can't be empty", status:false})
    }
    const loggeduser = await adminmodel.findOne({email:email})
    console.log(loggeduser);
    if (!loggeduser) {
       return res.status(402).send({message:"Admin doesn't exist", status:false})
    }

    const hashpassword = await bcrypt.compare(password, loggeduser.password)
    if (!hashpassword) {
       return res.status(409).send({message:"invalid password", status:false})
    }

    const loggeduseremail = loggeduser.email
    return res.status(200).send({message:"Adminlogin successful", status:true,loggeduseremail, userid:loggeduser._id})
   } catch (error) {
        console.log(error);
       return res.status(500).send({message:"internal server error", status:false})
   } 
}
module.exports = {adminsignup, adminlogin};