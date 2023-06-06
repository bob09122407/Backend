// const Razorpay =require("razorpay");
const app=require("./app");
const cloudinary= require("cloudinary");
const dotenv=require("dotenv");
const connectDatabase=require("./config/database");

//handle uncaught exception
process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to uncaght exception`);

        process.exit(1);
    
});



//config

dotenv.config({path:"backend/config/config.env"})


//connecting to database
connectDatabase();

//cloudinary
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const server=app.listen(process.env.PORT,()=>{

    console.log(`server is listening on https://localhost:${process.env.PORT}`)

});



//unhandled promise rejection
process.on("unhandledRejection",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled promise rejection`);

    server.close(()=>{
   process.exit(1);
    });
});

// const instance = new Razorpay({
//     key_id: process.env.RAZORPAY_API_KEY,
//     key_secret: process.env.RAZORPAY_APT_SECRET,
//   });

//   module.exports=instance;