import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
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
  appointment_date:{
    type: String,
    required: true
  },
  department:{
    type: String,
    required: true
  },
  doctor: {
    firstName:{
      type: String,
      requied:true
    },
    lastName:{
      type: String,
      requied:true
    }
  },
  hasVisited:{
    type: Boolean,
    default: false
  },
  doctorId:{
    type: mongoose.Schema.ObjectId,
    required: true
  },
  patientId:{
    type: mongoose.Schema.ObjectId,
    required: true
  },
  address:{
    type: String,
    required: true
  },
  status:{
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending"
  }

})

export const Appointment = mongoose.model("Appointment", appointmentSchema)