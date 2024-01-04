const mongoose = require("mongoose");

export {
    dbCon
}

export default function dbCon() {
    try {
        mongoose.connect(
            `${process.env.DB_CONNECT_LINK}`,
            {
              useNewUrlParser: true,
              useUnifiedTopology: true
            }
          )

        const db = mongoose.connection
        console.log("Connecting to database...");
        db.on("error", console.error.bind(console, "connection error: "))
        db.once("open", function () {
            console.log("Connected successfully")
        })
    } catch (error) {
        console.log(error)
    }
}