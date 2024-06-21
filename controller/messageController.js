import { Message } from "../models/messageSchema.js"
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js"
import ErrorHandler from "../middleware/errorMiddleware.js"

// export const sendMessage = async(req, res, next) => {
//  try {
//   const {firstName, lastName, email, phone, message} = req.body
//   if (!firstName || !lastName || !email || !phone || !message){
//     return res.status(400).json({
//       success: false,
//       message: "Some Values are Missing in Form"
//     })
//   }
//   const newMessage = {
//     firstName,
//     lastName,
//     email,
//     phone,
//     message
//   }

//   await Message.create(newMessage)

//   res.status(200).json({
//     success:true,
//     message: "Message Sent Successfully"
//   })
//  } catch (error) {
//   console.log(error.message)
//   res.status(500).json({
//     success: false,
//     message: `Some error in sending message: ${error.message}`
//   })
//  }
// }
export const sendMessage = catchAsyncErrors(async(req, res, next) => {

   const {firstName, lastName, email, phone, message} = req.body
   if (!firstName || !lastName || !email || !phone || !message){
    //  return res.status(400).json({
    //    success: false,
    //    message: "Some Values are Missing in Form"
    //  })
    return next(new ErrorHandler('Please fill full form', 400))
   }
   const newMessage = {
     firstName,
     lastName,
     email,
     phone,
     message
   }
 
   await Message.create(newMessage)
 
   res.status(200).json({
     success:true,
     message: "Message Sent Successfully"
   })
  
 })


export const getAllMessages = catchAsyncErrors(async(req, res, next) => {
  const message = await Message.find()
  // console.log("in fxn")
  return res.status(200).json({
    success:true,
    message
  })
})