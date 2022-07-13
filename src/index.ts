import cors from "cors"
import os from "os"

import { config } from "dotenv"
import { updateAvahiService, updateHostname } from "./utils/network/avahi"
import { app } from "./utils/server"

import dev from "./routes/dev"
import lights from "./routes/lights"
import network from "./routes/network"
import sound from "./routes/sound"
import system from "./routes/system"

import { checkConnectedWifiSSID } from "./utils/network/wifi"
import { getDeviceSerialNumber } from "./utils/systemctl"
import { client, connectToRedis } from "./database/redis"
import { initializeLightsConfig } from "./database/init"
import { io } from "./utils/socketio"
import { createServer } from "http"
import { initializeHotspot, restartHotspot } from "./utils/network/access_point"

config()
connectToRedis(client)

const port = process.env.port || 80
const server = createServer(app)

io.attach(server)
io.listen(5001)

app.use(cors())

app.use("/dev", dev)
app.use("/lights", lights)
app.use("/network", network)
app.use("/sound", sound)
app.use("/system", system)

app.listen(port, async () => {
    console.log(`> Ready on http://localhost:${port}`);

    await initializeLightsConfig()

    if (os.platform() === "win32")
        return

    try {
        await updateAvahiService()
        await initializeHotspot()
    } catch (error) {
        console.log(error)
    }
})