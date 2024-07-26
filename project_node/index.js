const express = require("express")
const mongoose = require("mongoose")
require('dotenv').config()
const app = express()
const cors = require("cors")

const userrouter = require("./route/userrouter")
const adminrouter = require("./route/adminrouter")

app.use(express.json())
app.use(cors())
app.use("/user", userrouter)
app.use("/admin", adminrouter)



const port =process.env.PORT || 5009
const uri = process.env.MONGODB_URI

const connect = ()=>{
    try {
        const connected = mongoose.connect(uri)
        if (connected) {
           console.log("connected to database"); 
        }
    } catch (error) {
       console.log(error); 
    }
}
connect()

app.listen(port, ()=>{
    console.log(`app started on port ${port}`);
})