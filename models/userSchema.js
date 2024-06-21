import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
  firstName:{
    type: String,
    requied: true,
    minLength: [3, "First Name Must Contain atleast 3 Letters"]
  },
  lastName:{
    type: String,
    requied: true,
    minLength: [3, "First Name Must Contain atleast 3 Letters"]
  },
  email:{
    type: String,
    requied: true,
    validate: [validator.isEmail, "Please Provide a Valid Email"]
  },
  phone:{
    type: String,
    requied: true,
    minLength: [10, "Please Provide a Valid Phone Number"],
    maxLength: [10, "Please Provide a Valid Phone Number"]
  },
  aadhar:{
    type: String,
    requied: true,
    minLength: [12, "Please Provide a Valid Aadhar Number"],
    maxLength: [12, "Please Provide a Valid Aadhar Number"]
  },
  dob:{
    type: Date,
    required: [true, "DOB is required"]
  },
  gender:{
    type: String,
    required:true,
    enum:["Male", "Female"],
  },
  password:{
    type: String,
    requied: true,
    minLength: [8, "Password must contain 8 characters"],
    select:false
  },
  role:{
    type: String,
    required: true,
    enum: ["Admin", "Patient", "Doctor"]
  },
  doctorDepartment:{
    type: String
  },
  docAvatar:{
    public_id:String,
    url:String
  }
})

userSchema.pre("save", async function(next){
  if (!this.isModified("password")){
    next()
  }
  this.password= await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.generateJsonWebToken = function(){
  return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  })
}



export const User = mongoose.model("User", userSchema)