import { Request, Response, NextFunction } from "express"
import nodemailer from "nodemailer";
import Path from "path";
import ejs from "ejs";
import { createClient } from 'redis';

import { verifyToken } from "../util/JWT"
import { rootDir } from "./path";
const moment = require('moment');
const User = require("../models/userModel")

export {
  checkToken,
  getTotalPages,
  getDaysDifference,
  sendEmailToUser,
  setRedisCon,
}

const SECRET_KEY = process.env.JWT_SECRET_KEY

// header check by key value pairs
async function checkToken(req: Request, res: any, next: NextFunction) {
  const authHeader = req.header('authorization')
  // if err or token is empty or null
  if (!authHeader) {
    const errMsg = {
      token: {
        msg: 'Authorization header is missing',
        location: ''
      }
    }
    return res.status(400).send(errMsg)
  }

  // replace bearer
  const token: string = authHeader.replace("Bearer ", "")

  //  function verified 
  const decoded = await verifyToken(token, next)

  const userInfo: any = await User.findOne({uuid: decoded.userId})
  if (!userInfo) {
      return next({
          status: 404,
          code: `not_found`,
          message: 'User does not exists'
      })
  }

  res.userId = decoded.userId
  // if token value is wrong
  if (!decoded) {
    return res.status(400).send('Token is not valid')
  }

  return next()
}

function getTotalPages(totalItems: number, itemsPerPage: number) {
  return Math.floor((totalItems + itemsPerPage - 1) / itemsPerPage);
}

function getDaysDifference(startDate, endDate) {
  const startMoment = moment(startDate);
  const endMoment = moment(endDate);

  // Calculate the difference in days
  const daysDifference = endMoment.diff(startMoment, 'hours');

  return daysDifference;
}

async function sendEmailToUser(
  file: string,
  subject: string,
  userEmail: string[],
  dataArr: any,
  lang: any = "en",
) {
  const MAIL_HOST = process.env.MAIL_HOST || "localhost";
  const MAIL_PORT: number = <number>(<any>process.env.MAIL_PORT) || 5432;
  const MAIL_FROM = process.env.MAIL_FROM || "ayushkashyap11095@gmail.com";
  const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
  const MAIL_USERNAME = process.env.MAIL_USERNAME || "ayushkashyap11095@gmail.com";

  const transport = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    auth: {
      user: MAIL_USERNAME,
      pass: MAIL_PASSWORD,
    },
  });

  const filePath = await Path.join(rootDir(), "views", "email", lang, file);
  userEmail.forEach((_email: any) => {
    ejs.renderFile(filePath, dataArr, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        const message = {
          from: MAIL_FROM,
          to: _email,
          subject: subject,
          html: data,
        };
        transport.sendMail(message, function (err, info) {
          console.log('err', err);
          console.log(info);
        });
      }
    });
  });
}

async function setRedisCon() {
  const client: any = await createClient()
        .on('error', err => console.log('Redis Client Error', err))
        .connect();
        console.log("redis connected");
  
  return client
}