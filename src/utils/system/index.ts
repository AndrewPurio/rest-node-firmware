import { platform } from "os"
import { Gpio } from "pigpio"
import { WIFI_CONNECTED } from "../../database/keys"
import { storeValue } from "../../database/redis"
import { removeEventSchedulerContainer } from "../events"
import { initializeHotspot, restartHotspot } from "../network/access_point"

export const resetDevice = async () => {
    try {
        await initializeHotspot()
        await restartHotspot()
        await storeValue(WIFI_CONNECTED, 0)

        return
    } catch (error) {
        throw error
    } finally {
        removeEventSchedulerContainer()
    }
}

export const systemSwitch = () => {
    if (platform() === "win32")
        return

    const resetButton = new Gpio(7, {
        mode: Gpio.INPUT,
        pullUpDown: Gpio.PUD_DOWN,
        edge: Gpio.RISING_EDGE
    })

    console.log("Reset button initialized...")

    resetButton.on("interrupt", (level) => {
        console.log("Button State:", level)
    })

}