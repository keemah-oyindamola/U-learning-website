const mongoose = require("mongoose")
const bcrypt = require ("bcryptjs")

const userschema = mongoose.Schema({
    username:{type:String, required:true},
    email:{type:String, unique:true, required:true},
    password:{type:String, unique:true, required:true}
})

let saltRound = 10
userschema.pre("save", function(next){
    console.log(this.password);
    bcrypt.hash(this.password, saltRound)
    .then((hashpassword)=>{
        console.log(hashpassword);
        this.password=hashpassword
        next()
    })
    .catch((err)=>{
        console.log(err);
    })
})


const usermodel = mongoose.model("user-info", userschema)

module.exports = usermodel