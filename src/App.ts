require('dotenv').config()
const cron = require('node-cron');
import express, { Application, NextFunction, Request, Response } from 'express'

import { Error } from "./types/common"
import router from "./routes/MainRouter"
import dbCon from './util/database'
import { checkDueTaskJob } from './jobs/checkDueTaskJob';

export class App {
  public app: Application = express()

  constructor() {
    this.app.use(express.static('public'))
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))

    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*")
      res.header("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS")
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      )

      if (req.method !== "OPTIONS") {
        return next()
      }

      res.statusCode = 200
      res.end("OK")
    })
    this.app.get('/', (req: Request, res: Response, next: NextFunction) => {
      res.send('This is karma project')
    })
    
    dbCon()
    this.app.use("/v1/api", router)

    /* CRON JOB*/
    cron.schedule('0 * * * *', async () =>  await checkDueTaskJob());

    // final middleware to handle exceptions
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      if (!err.status) {
        err.status = 500
      }
      if (!err.code) {
        err.code = 'unexpected_error'
      }

      const response = {
        success: false,
        code: err.code,
        message: err.message
      }
      res.status(err.status).json(response)
      next()
    })

  }
}