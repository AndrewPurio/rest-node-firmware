import { platform } from "os"
import { Gpio } from "pigpio"
import { WIFI_CONNECTED } from "../../database/keys"
import { storeValue } from "../../database/redis"
import { removeEventSchedulerContainer } from "../events"
import { InputsGPIOPin } from "../lights/types"
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

    console.log("Reset Button Initialized...")

    const resetButton = new Gpio(InputsGPIOPin.RESET, {
        mode: Gpio.INPUT,
        pullUpDown: Gpio.PUD_UP,
        alert: true
    })
    
    resetButton.glitchFilter(10000)

    resetButton.on("alert", (level, tick) => {
        console.log("Button State:", level, tick, new Date())
    })
}