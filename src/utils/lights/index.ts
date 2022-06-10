import { Gpio } from "pigpio"
import { setBrightness } from "./i2c"
import { LightsDigitalState, LightsGPIOPin } from "./types"

export const toggleGpioOutput = (gpio: LightsGPIOPin, state: LightsDigitalState) => {
    try {
        const led = new Gpio(gpio, {
            mode: Gpio.OUTPUT
        })

        led.digitalWrite(state)
    } catch (error) {
        throw error
    }
}

export const fadeBrightness = async (min: number, max: number, durationInMs: number, tick = 500, controller: AbortController) => {
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
