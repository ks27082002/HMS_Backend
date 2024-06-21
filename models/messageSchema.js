import mongoose from "mongoose"
import validator from "validator"

const messageSchema = new mongoose.Schema({
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
  message:{
    type: String,
    required: true,
    minLength: [10, "Message Must Contain atleast 10 Letters"]
  }
})

export const Message = mongoose.model("Message", messageSchema)