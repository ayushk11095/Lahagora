import { sendEmailForDueTask } from "../controllers/taskController"

export async function checkDueTaskJob() {
    console.log(`check due task cron function called`)
    sendEmailForDueTask()
    return true
}