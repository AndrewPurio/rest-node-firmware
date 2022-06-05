import express from "express"
import cors from "cors"

import { config } from "dotenv"

import network from "./routes/network"
import dev from "./routes/dev"
import { initializeHotspot } from "./utils/network/access_point"
import { updateAvahiService } from "./utils/network/avahi"

config()

const port = process.env.port || 5000
const app = express()

app.use(cors())
app.use("/network", network)
app.use("/dev", dev)

app.listen(port, async () => {
    console.log(`> Ready on http://localhost:${port}`);

    try {
        await updateAvahiService()
        await initializeHotspot()
    } catch (error) {
        console.log(error)
    }
})