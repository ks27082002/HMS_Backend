import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary"

export const patientRegister = catchAsyncErrors(async(req, res, next) => {

  const {firstName, lastName, email, phone, aadhar, dob, gender, password, role } = req.body
  if (!firstName || !lastName || !email || !phone || !aadhar || !dob || !gender || !password || !role){
    return next(new ErrorHandler("Please Fill Complete Form", 400))
  }

  let user = await User.findOne({email})
  if(user){
    return next(new ErrorHandler("User Already Registered"))
  }
  const newUser = {
    firstName,
    lastName,
    email,
    phone,
    aadhar,
    dob,
    gender,
    password,
    role
  }
  user = await User.create(newUser)
  generateToken(user, "User Registered!", 200, res)
  // return res.status(200).json({
  //   success: true,
  //   message: "User Registered!"
  // })

})

export const login = catchAsyncErrors(async(req, res, next) => {

  const { email, password, confirmPassword, role } = req.body
  if ( !email || !password || !confirmPassword || !role){
    return next(new ErrorHandler("Please Provide All Details", 400))
  }

  if(password !== confirmPassword){
    return next(new ErrorHandler("Password and Confirm Password Does Not Match", 400))
  }

  const user = await User.findOne({email}).select("+password")
  if (!user){
    return next(new ErrorHandler("User Not Found", 400))
  }

  const isPasswordMatched = await user.comparePassword(password)
  if (!isPasswordMatched){
    return next(new ErrorHandler("Invalid Password", 400))
  }

  if(role !== user.role){
    return next(new ErrorHandler("User with this role not found", 400))
  }
  generateToken(user, "User Login Successfully!", 200, res)
  // res.status(200).json({
  //   success: true,
  //   message: "User LoggedIn successfully"
  // })
})


export const addNewAdmin = catchAsyncErrors(async(req, res, next) => {

  const { firstName, lastName, email, phone, aadhar, dob, gender, password } = req.body;
  if ( !firstName || !lastName || !email || !phone || !aadhar || !dob || !gender || !password ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  let admin = await User.findOne({ email });
  if (admin) {
    return next(new ErrorHandler("Admin With This Email Already Exists!", 400));
  }
  const newAdmin = {firstName, lastName, email, phone, aadhar, dob, gender, password, role:"Admin"}

  admin = await User.create(newAdmin)
  res.status(200).json({
    success: true,
    message: "New Admin Registered",
    admin,
  })
})


export const getAllDoctors = catchAsyncErrors(async(req, res, next) => {
  const doctors = await User.find({role:'Doctor'})
  return res.status(200).json({
    success:true,
    doctors
  })
})


export const getUserDetails = catchAsyncErrors(async(req, res, next) => {
  const user = req.user
  return res.status(200).json({
    success:true,
    user
  })
})


export const logOutAdmin = catchAsyncErrors(async(req, res, next) => {
  res.status(200)
  .cookie("adminToken", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure: true,
    sameSite: "None"
  })
  .json({
    success:true,
    message: "Admin Logged Out Successfully"
  })
})


export const logOutPatient = catchAsyncErrors(async(req, res, next) => {
  res.status(200)
  .cookie("patientToken", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure: true,
    sameSite: "None"
  })
  .json({
    success:true,
    message: "Patient Logged Out Successfully"
  })
})


export const addNewDoctor = catchAsyncErrors(async(req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0){
    return next(new ErrorHandler("Doctor Avatar Required!", 400))
  }
  const { docAvatar } = req.files
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"]
  if (!allowedFormats.includes(docAvatar.mimetype)){
    return next(new ErrorHandler("File Format Not Supported", 400))
  }

  const {firstName, lastName, email, phone, aadhar, dob, gender, password, doctorDepartment} = req.body

  if(!firstName || !lastName || !email || !phone || !aadhar || !dob || !gender || !password || !doctorDepartment){
    return next(new ErrorHandler("Please Fill Full Form", 400))
  }

  const isRegistered = await User.findOne({email})
  if(isRegistered){
    return next(
      new ErrorHandler(`${isRegistered.role} already registered with this email`)
    )
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  )

  if(!cloudinaryResponse || cloudinaryResponse.error){
    console.error(
      "Cloudinary Error",
      cloudinaryResponse.error || "Unknown Cloudinary error")

    return next(
      new ErrorHandler("Failed to Upload Doctor Avatar To Cloudinary", 500))
  }

  const newDoctor = {
    firstName,
    lastName,
    email,
    phone,
    aadhar,
    dob,
    gender,
    password,
    role: "Doctor",
    doctorDepartment,
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  }

  const doctor = await User.create(newDoctor)

  res.status(200).json({
    success:true,
    message: "New Doctor Registered",
    doctor
  })


})
