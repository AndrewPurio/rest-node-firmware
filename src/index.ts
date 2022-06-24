import cors from "cors"
import os from "os"

import { config } from "dotenv"
import { initializeHotspot } from "./utils/network/access_point"
import { updateAvahiService } from "./utils/network/avahi"
import { app } from "./utils/server"

import dev from "./routes/dev"
import lights from "./routes/lights"
import network from "./routes/network"
import sound from "./routes/sound"
import system from "./routes/system"
import { checkConnectedWifiSSID } from "./utils/network/wifi"

config()

const port = process.env.port || 80

app.use(cors())

app.use("/dev", dev)
app.use("/lights", lights)
app.use("/network", network)
app.use("/sound", sound)
app.use("/system", system)

app.listen(port, async () => {
    console.log(`> Ready on http://localhost:${port}`);

    if(os.platform() === "win32")
        return

    try {
        const { stdout } = await checkConnectedWifiSSID()

        console.log("Wifi SSID:", stdout)

        await updateAvahiService()
        // await initializeHotspot()
    } catch (error) {
        console.log(error)
    }
})