const mongoose = require('mongoose')
const {cloudinary} = require("../utils/cloudinary")
const coursemodel = require("../model/coursemodel")

// const cloudinary = require("cloudinary").v2

// cloudinary.config({
//     cloud_name: 'de7zf09m8',
//     api_key: '393211751517818',
//     api_secret: '1oXDrdiDvo0ZM95qySXjDHJGNEg'
// })


const getcourseinfo = async (req, res) => {
    try {
        const { course_title, course_desc, course_price, course_requirement, instructor, category } = req.body;

        if (!course_title || !course_price || !course_desc || !course_requirement || !instructor || !category) {
            return res.status(402).send({ message: "Input fields can't be empty", status: false });
        }

        // Check if the course already exists
        const existingCourse = await coursemodel.findOne({ course_title: course_title });
        if (existingCourse) {
            return res.status(404).send({ message: "Course already exists", status: false });
        }

        // Make sure req.files is defined and course_img is uploaded
        if (!req.files || !req.files.course_img) {
            return res.status(400).send({ message: "No file uploaded", status: false });
        }

        const file = req.files.course_img;
        console.log(file);
        console.log(cloudinary.uploader);
        // console.log(cloudinary.uploader.upload_stream);



        // Check if file upload has a temp file path
        if (!file.tempFilePath) {
            return res.status(500).send({ message: "File not properly uploaded", status: false });
        }

        // Upload the image to Cloudinary
        const uploader = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'course_images'
        });
        const img = uploader.secure_url;

        // Create the course with the uploaded image URL
        const course = await coursemodel.create({
            course_title,
            course_desc,
            course_price,
            instructor,
            course_requirement,
            category,
            course_img: img
        });

        if (!course) {
            return res.status(400).send({ message: "Unable to create course", status: false });
        }

        return res.status(200).send({ message: "Course created successfully", status: true, course });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal server error", status: false });
    }
};



// const uploadimg = async (req, res) => {
//     try {
//         const { course_img, title } = req.body
//         console.log(course_img);
//         const uploader = await cloudinary.uploader.upload(course_img)
//         console.log(uploader.secure_url);
//         const img = uploader.secure_url

//         if (!uploader) {
//             return res.status(403).send({ message: "Error occured", status: true })
//         }

//         const profileimage = await coursemodel.findOneAndUpdate(
//             { title: title },
//             { $set: { course_img: img } },
//             {new:true}
//         )

//         if (!profileimage) {
//             res.status(405).send({ message: "unable to update profile", status: false })
//         }

//         return res.status(200).send({ message: "upload successful", status: true, img })

//     } catch (error) {
//         console.log(error);
//         if (error) {
//             res.status(407).send({ message: error.message })
//         }
//         return res.status(500).send({ message: "internal server error", status: false })

//     }
// }

const videocontroller = async (req, res) => {
    try {
        const { course_id } = req.body
        console.log(req.body.course_id);
        console.log(course_id);
        
        if (!course_id) {
            return res.status(402).send({ message: "course not found", status: false })
        }

        const course = await coursemodel.findById(course_id)
        if (!course) {
            return res.status(403).send({ message: "Course not found", status: false })
        }

        if (!req.files || !req.files.video) {
            return res.status(400).send({ message: "No video file uploaded", status: false });
        }
        console.log(req.files); // This should show the uploaded file object
  
        const videofile = req.files.video
        if (!videofile.tempFilePath) {
            return res.status(500).send({ message: "Video file not properly uploaded", status: false });
        }

        const uploader = await cloudinary.uploader.upload(videofile.tempFilePath, {
            folder: "course_videos",
            resource_type: "video"
        })
        const videoUrl = uploader.secure_url
        course.course_video.push(videoUrl); // Push the video URL to the course_video array
        // course.course_video = [...course.course_video, videoUrl];
        await course.save();
        return res.status(200).send({ message: "Video uploaded successfully", status: true, course });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal server error", status: false });
    }
}


const getallcourses = async(req,res)=>{
    try {
        const allcourses = await coursemodel.find({})
        return res.status(200).send({ message: "courses gotten", status: true, allcourses })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Failed to fetch users", status: false });
    }
}

const getcourse = async(req,res)=>{
    try {
        const {id} = req.params
        if (!id) {
            return res.status(400).send({ message: "Invalid course ID format", status: false });
        }
        const course = await coursemodel.findById(id)
        if (!course) {
            return res.status(402).send({ message: "course doesn't exist", status: false })
        }

        return res.status(200).send({ message: "course gotten successfully", status: true, course });
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"internal server error", status:false})
    }
}
module.exports = { getcourseinfo , videocontroller, getallcourses, getcourse}