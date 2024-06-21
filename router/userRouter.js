import express from "express"
import { addNewAdmin, addNewDoctor, getAllDoctors, getUserDetails, logOutAdmin, logOutPatient, login, patientRegister } from "../controller/userController.js"
import { isAdminAuthenticated,isPatientAuthenticated } from "../middleware/auth.js"

const router = express.Router()

router.post('/patient/register', patientRegister)
router.post('/login', login)
router.post('/admin/addnew',isAdminAuthenticated, addNewAdmin)
router.get('/doctors',getAllDoctors)
router.get('/admin/me', isAdminAuthenticated, getUserDetails)
router.get('/patient/me', isPatientAuthenticated, getUserDetails)
router.get('/admin/logout', isAdminAuthenticated, logOutAdmin)
router.get('/patient/logout', isPatientAuthenticated,logOutPatient)
router.post('/doctor/addnew', isAdminAuthenticated, addNewDoctor)


export default router