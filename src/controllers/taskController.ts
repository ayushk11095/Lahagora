import { Request, Response, NextFunction } from "express"
import { v4 as uuidv4 } from 'uuid';
const moment = require('moment');
const async = require('async');

const Task = require("../models/taskModel")
const User = require("../models/userModel")
import { getDaysDifference, getTotalPages, sendEmailToUser, setRedisCon } from "../util/Helper";

export default {
    create, update, findOne, findAll, deleteTask
}

// Task create API
export async function create(req: Request, res: any, next: NextFunction) {
    const {title, dueDate, description} = req.body
    try {
        const uuid = uuidv4()

        const task = new Task()
        task.uuid = uuid
        task.title = title
        task.userUUID = res.userId
        task.description = description
        task.dueDate = dueDate
        await task.save()

        const client: any = await setRedisCon()
        client.set(uuid, JSON.stringify(task), {EX: 300});

        return res.status(200).json({
            success: true,
            message: `Task added successfully`,
            data: task
        })
    } catch (error) {
        return next(error)
    }
}

// Task update API
export async function update(req: Request, res: Response, next: NextFunction) {
    const {uuid, title, dueDate, description, status} = req.body
    try {
        const task = await Task.findOne({uuid})
        if (!task) {
            return next({
                status: 404,
                code: `not_found`,
                message: 'Task not found'
            })
        }

        
        task.title = title
        task.description = description
        task.dueDate = dueDate
        await task.save()
        
        const client: any = await setRedisCon()
        await client.set(uuid, JSON.stringify(task), {EX: 300});

        return res.status(200).json({
            success: true,
            message: `Task updated successfully`,
            data: task
        })
    } catch (error) {
        return next(error)
    }
}

// Task detail API
export async function findOne(req: Request, res: Response, next: NextFunction) {
    const uuid = req.params.uuid
    try {
        const client: any = await setRedisCon()
        let data = await client.get(uuid);
        
        if (!data) {
            data = await Task.findOne({uuid})
            if (!data) {
                return next({
                    status: 404,
                    code: `not_found`,
                    message: 'Task not found'
                })
            }

            await client.set(uuid, JSON.stringify(data), {EX: 300});
        }

        return res.status(200).json({
            success: true,
            message: `Task fetched successfully.`,
            data: typeof data === "string" ? JSON.parse(data) : data
        })
    } catch (error) {
        return next(error)
    }
}

// Task list API
export async function findAll(req: Request, res: Response, next: NextFunction) {
    const dataArr: any = req.body
    dataArr.page = dataArr.page != null ? parseInt(dataArr.page) - 1 : 0;
    dataArr.pageSize = dataArr.pageSize != null ? parseInt(dataArr.pageSize) : 10;

    const paginate: any = {};
    // paginate
    if (dataArr.pageSize != 0) {
        paginate.limit = dataArr.pageSize;
        paginate.offset = dataArr.pageSize * dataArr.page;
    }

    try {
        const data = await Task.find().skip(paginate.offset)
        .limit(paginate.limit)

        const count = await Task.count()

        const pageCount = await getTotalPages(count, dataArr.pageSize);

        const result = {
            total: count,
            pageCount: pageCount,
            page: dataArr.page + 1,
            pageSize: dataArr.pageSize,
            data,
          };
        
        return res.status(200).json({
            success: true,
            message: `Task list fetched successfully.`,
            result
        })
    } catch (error) {
        return next(error)
    }
}

// Task delete API
export async function deleteTask(req: Request, res: Response, next: NextFunction) {
    const uuid = req.params.uuid
    try {
        const data = await Task.findOneAndDelete({uuid})
        if (!data) {
            return next({
                status: 404,
                code: `not_found`,
                message: 'Task not found'
            })
        }

        const client: any = await setRedisCon()

        await client.DEL(uuid);
        
        return res.status(200).json({
            success: true,
            message: `Task deleted successfully.`,
        })
    } catch (error) {
        return next(error)
    }
}

// cron function
export async function sendEmailForDueTask() {
    try {
        const data = await Task.find({status: "pending"})

        for (let i = 0; i < data.length; i++) {
            const startDate = new Date(moment(data[i].dueDate).format('YYYY-MM-DD'));
            const endDate = new Date();
            const day = getDaysDifference(endDate, startDate)

            // send email as a reminder for due date within 24 hours
            if (day === 24) {
                const userInfo = await User.findOne({uuid: data[i].userUUID})
                await sendEmailToUser("reminder_email.ejs", "Due task reminder", [userInfo.email], {title: data[i].title})
            }
        }
        
        return true
    } catch (error) {
        console.log(error);
        
    }
}

const taskQueue = async.queue(async (taskData, callback) => {
    try {
      // Simulate some processing time
      await new Promise(resolve => setTimeout(resolve, 100));
  
      // Update task in the database
      const task = await Task.findOne({uuid: taskData.uuid})
      task.status = "completed"
      await task.save()
  
      console.log(`Task marked as completed`);
    } catch (error) {
      console.error(`Error processing task: ${taskData.uuid}`, error);
    } finally {
      // Notify the queue that the task is done
      callback();
    }
  }, 1); // Concurrency: 1 (process one task at a time)

// Task update API
export async function updateStatus(req: Request, res: Response, next: NextFunction) {
    const {uuid} = req.body
    try {
        const task = await Task.findOne({uuid})
        if (!task) {
            return next({
                status: 404,
                code: `not_found`,
                message: 'Task not found'
            })
        }

        const client: any = await setRedisCon()

        await client.set(uuid, JSON.stringify(task), {EX: 300});

        // Add a uuid into queue
        taskQueue.push({ uuid });

        return res.status(200).json({
            success: true,
            message: `Task updated successfully`,
        })
    } catch (error) {
        return next(error)
    }
}