import express from "express"
import cors from "cors"

import { config } from "dotenv"

import network from "./routes/network"

config()

const port = process.env.port || 5000
const app = express()

app.use(cors())
app.use("/network", network)

app.listen(port, () => {
    console.log("App listening at port:", port)
})