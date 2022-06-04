import express from "express"
import cors from "cors"

import { config } from "dotenv"
import { writeFileSync } from "fs"

import network from "./routes/network"
import { getDeviceSerialNumber } from "./utils/systemctl"
import { configureHotspotSSID, createHostapdConf, restartHotspot } from "./utils/network/access_point"
import { execute } from "./utils/execute"
import { createDnsMasqConf } from "./utils/network/dnsmasq"

config()

const port = process.env.port || 5000
const app = express()

app.use(cors())
app.use("/network", network)

app.listen(port, async () => {
    const { stdout } = await getDeviceSerialNumber()
    const serialNumber = stdout.replace(/\s/, "") || []

    const last_4_characters = /\w{4}\b/
    const [id] = last_4_characters.exec(serialNumber) || []

    const { stdout: hostapdConf } = await execute("cat /etc/hostapd/hostapd.conf")
    const [ssid] = /(?<=ssid=)\w+/.exec(hostapdConf) || []
    const [currentId] = last_4_characters.exec(ssid) || []

    if (id && id !== currentId) {
        const hostapdConf = createHostapdConf({ ssid: await configureHotspotSSID() })
        const dnsMasqConf = createDnsMasqConf()

        writeFileSync("/etc/dnsmasq.conf", dnsMasqConf)
        writeFileSync("/etc/hostapd/hostapd.conf", hostapdConf)
        restartHotspot()
    }

    console.log(`> Ready on http://localhost:${port}`);
})