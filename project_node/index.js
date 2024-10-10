const express = require("express")
const mongoose = require("mongoose")
require('dotenv').config()
const app = express()
const cors = require("cors")
// app.use(express.urlencoded({ extended: true }));
const fileUpload = require('express-fileupload');
app.use(fileUpload({
  useTempFiles: true, // Required for using tempFilePath
  tempFileDir: '/tmp/' // Temporary file directory
}));



const userrouter = require("./route/userrouter")
const adminrouter = require("./route/adminrouter")
const courserouter = require("./route/courseroute")

app.use(express.urlencoded({extended:true, limit:"100mb"}))
app.use(express.json({limit:"100mb"}))
app.use(cors({origin:"*"}))
app.use("/user", userrouter)
app.use("/admin", adminrouter)
app.use("/course", courserouter)



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