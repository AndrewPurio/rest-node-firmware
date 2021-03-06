import { Gpio } from "pigpio"
import { platform } from "os"
import { setBrightness } from "./i2c"
import { LightsDigitalState, LightsGPIOPin } from "./types"

export const toggleGpioOutput = (gpio: LightsGPIOPin, state: LightsDigitalState) => {
    if (platform() === "win32")
        return

    const led = new Gpio(gpio, {
        mode: Gpio.OUTPUT
    })

    console.log("Light State:", state)

    led.digitalWrite(state)
}

export const fadeBrightness = async (min: number, max: number, durationInMs: number, tick = 500, controller: AbortController) => {
    if (platform() === "win32")
        return

    const increment = (max - min) / (durationInMs / tick)
    let currentBrightness = min

    const fadeInterval = setInterval(async () => {
        await setBrightness(currentBrightness)

        console.log("Brightness:", currentBrightness, increment)

        currentBrightness += increment

        if (currentBrightness >= max)
            clearInterval(fadeInterval)
    }, tick)

    try {
        // @ts-ignore
        controller.signal.addEventListener("abort", () => {
            console.log("Fade aborted!!")

            clearInterval(fadeInterval)
        }, {
            once: true
        })
    } catch (error) {
        throw error
    }
}
