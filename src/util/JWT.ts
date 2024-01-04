import { NextFunction } from "express"
import JWT from "jsonwebtoken"

export {
  createToken,
  verifyToken
}
const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY as string
function createToken(payload: any) {
  try {
    return JWT.sign(payload, JWT_SECRET_KEY)
  } catch (error: any) {
    return error
  }
}

function verifyToken(token: string, next: NextFunction) {
  try {
    //get token
    return new Promise<any>((resolve, reject) => {
      JWT.verify(token, JWT_SECRET_KEY, (error, decoded) => {
        if (error) {
          next(error)
          return
        }
        resolve(decoded)
      })
    })
  } catch (error: any) {
    return error
  }
}
