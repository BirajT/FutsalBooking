import express from "express"
import { changePassword, login, logout, register } from "../controllers/auth.controllers.js"
import authenticate from "../middleware/authenticate.middleware.js"
import { USER_ROLE } from "../constants/enums.constants.js"

const router=express.Router()

router.post('/register',register)
router.post('/login',login)
router.post('/logout',logout)
router.post('/changePassword', authenticate([USER_ROLE.USER, USER_ROLE.OWNER, USER_ROLE.ADMIN]), changePassword)

export default router