const mongoose = require('mongoose')
const cloudinary = require('cloudinary')

const courseSchema = mongoose.Schema({
    course_title:{type:String, required:true},
    course_desc:{type:String},
    course_price:{type:Number},
    course_img:{type:String},
    category:{type:String},
    instructor:{type:String},
    course_completed:{type:Boolean, default:false},
    subscriber:{type:Number, default:0},
    course_requirement:{type:String},
    createdAt:{type: Date, default:Date.now},
    previewVideo:{type:String},
    course_video: {
        type:[String],
        default :[]
    }
})

const coursemodel = mongoose.model("courses", courseSchema)

module.exports = coursemodel