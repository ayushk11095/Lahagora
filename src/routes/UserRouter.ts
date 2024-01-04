import { Router } from "express"

import { signUp, logIn } from "../controllers/userController"
import { logInValidator, userCreateValidator } from "../middleware/validator"

const router = Router()

router.post("/register", userCreateValidator, signUp)
router.post("/logIn", logInValidator, logIn)

export default router
