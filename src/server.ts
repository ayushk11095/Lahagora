require('dotenv').config()
import { App } from "./App"

const hostName: string = '0.0.0.0'
const PORT: number = parseInt(process.env.PORT as string)

const app = new App()
export default app.app

const main = async () => {
    try {
        // call express api object
        app.app.listen(PORT, hostName, () => {
            return console.log(`Project is running on port : `, PORT)
        })
    } catch (error: any) {
        return error
    }
}

main()