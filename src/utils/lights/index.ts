import { Gpio } from "pigpio"
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