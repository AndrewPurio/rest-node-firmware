import cors from "cors"
import os from "os"

import { config } from "dotenv"
import { updateAvahiService } from "./utils/network/avahi"
import { app } from "./utils/server"

import dev from "./routes/dev"
import lights from "./routes/lights"
import network from "./routes/network"
import sound from "./routes/sound"
import system from "./routes/system"

import { client, connectToRedis, getValue, storeValue } from "./database/redis"
import { initializeLightsConfig, isVerifiedSerialNumber } from "./database/init"
import { io } from "./utils/socketio"
import { createServer } from "http"
import { DEVICE_CONFIG, WIFI_CONNECTED } from "./database/keys"
import { gpioInit, resetDevice, systemSwitch } from "./utils/system"
import { getDeviceSerialNumber } from "./utils/systemctl"
import { initializeHotspot } from "./utils/network/access_point"
import { playSoundEffect } from "./utils/sound"
import { SoundEffect } from "./utils/sound/constants"

process.on("uncaughtException", (err) => {
    console.error(err)
})

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
    console.log(`> Ready on http://localhost:${port}`)

    if (os.platform() === "win32")
        return

    const isConnectedToWifi = Number(await getValue(WIFI_CONNECTED))
    const { stdout: currentSerialNumber } = await getDeviceSerialNumber()

    const verifiedSerial = await isVerifiedSerialNumber(currentSerialNumber)

    gpioInit()
    systemSwitch()
    
    await initializeLightsConfig()
    await playSoundEffect(SoundEffect.ON_START)

    console.log("Is Connected to Wifi:", !!isConnectedToWifi, isConnectedToWifi)
    console.log("Verified Serial:", verifiedSerial)

    if (verifiedSerial && isConnectedToWifi)
        return

    try {
        await updateAvahiService()
        await storeValue(DEVICE_CONFIG, currentSerialNumber)
        await initializeHotspot()
    } catch (error) {
        console.log(error)
    }
})