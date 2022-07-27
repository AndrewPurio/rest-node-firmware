import { platform } from "os"
import { CLOCK_PWM, configureClock, Gpio } from "pigpio"
import { WIFI_CONNECTED } from "../../database/keys"
import { storeValue } from "../../database/redis"
import { removeEventSchedulerContainer } from "../events"
import { InputsGPIOPin } from "../lights/types"
import { initializeHotspot, resetHotspotConfig, restartHotspot } from "../network/access_point"
import { disableFirewall } from "../network/firewall"
import { playSoundEffect } from "../sound"
import { SoundEffect } from "../sound/constants"

export const gpioInit = async () => {
    configureClock(1, CLOCK_PWM)
}

export const resetDevice = async () => {
    try {
        await resetHotspotConfig()
        await disableFirewall()
        await restartHotspot()
        await storeValue(WIFI_CONNECTED, 0)
        await playSoundEffect(SoundEffect.ON_RESET)
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

    let fiveSecondPressTimer: NodeJS.Timeout | undefined

    const resetButton = new Gpio(InputsGPIOPin.RESET, {
        mode: Gpio.INPUT,
        pullUpDown: Gpio.PUD_DOWN,
        edge: Gpio.EITHER_EDGE
    })

    resetButton.glitchFilter(10000)

    resetButton.on("interrupt", (level) => {
        console.log("Is Resetting:", !!fiveSecondPressTimer)

        if (level === 0) {
            clearTimeout(fiveSecondPressTimer)
            fiveSecondPressTimer = undefined
            
            return
        }

        if(fiveSecondPressTimer)
            return

        fiveSecondPressTimer = setTimeout(async () => {
            console.log("Resetting the device...")
            try {
                await resetDevice()
            } catch (error) {
                console.log(error)
            }
        }, 5000)
    })
}

export const delay = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}