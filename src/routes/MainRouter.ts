import { Router } from "express"

import {
    userRouter,
    taskRouter,
} from "."
import { checkToken } from "../util/Helper"

const router = Router()

router.use("/user", userRouter)
router.use("/task", checkToken, taskRouter)

export default router