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

export const systemSwitch = async () => {
    if (platform() === "win32")
        return

    try {
        const resetButton = new Gpio(7, {
            mode: Gpio.INPUT,
            pullUpDown: Gpio.PUD_DOWN,
            alert: true
        })

        console.log("Reset button initialized...")

        resetButton.glitchFilter(10000)

        resetButton.on("alert", (level, tick) => {
            console.log("Debounced Reset Button State:", level, tick)
        })
    } catch (error) {
        throw error
    }
}