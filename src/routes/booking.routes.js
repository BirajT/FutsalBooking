import express from "express"
import { create, getAll, getById, remove, update } from "../controllers/booking.controllers.js"
import authenticate from "../middleware/authenticate.middleware.js"
import { USER_ROLE } from "../constants/enums.constants.js"

const router=express.Router()

router.get("/getAll",authenticate([USER_ROLE.USER]),getAll)
router.get("/:id",authenticate([USER_ROLE.USER]),getById)
router.post("/create",authenticate([USER_ROLE.USER]),create)
router.put("/:id",authenticate([USER_ROLE.USER]),update)
router.delete("/:id",authenticate([USER_ROLE.USER]),remove)

export default router