import { Router } from "express"

import { create, deleteTask, findAll, findOne, update, updateStatus } from "../controllers/taskController"
import { listValidator, taskCreateValidator, taskUpdateStatusValidator, taskUpdateValidator } from "../middleware/validator"

const router = Router()

router.post("/add", taskCreateValidator, create)
router.post("/list", listValidator, findAll)
router.get("/detail/:uuid", findOne)
router.put("/update", taskUpdateValidator, update)
router.put("/update-status", taskUpdateStatusValidator, updateStatus)
router.delete("/delete/:uuid", deleteTask)

export default router
