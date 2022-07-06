import { Router, json } from "express";
import { platform } from "os";
import { toggleGpioOutput } from "../../utils/lights";
import { setBrightness } from "../../utils/lights/i2c";
import { LightsDigitalState, LightsGPIOPin } from "../../utils/lights/types";

const router = Router()

router.use(json())

router.post("/:light", async (request, response) => {
    const { params, body } = request
    const { light } = params
    const { state, brightness, options } = body

    console.log("Body:", body)

    const lights = {
        night: LightsGPIOPin.NIGHT_LIGHT,
        wake: LightsGPIOPin.WAKE_LIGHT
    }

    const lightGpio = lights[light as keyof typeof lights]

    if(!lightGpio) {
        response.statusCode = 400

        response.json({
            message: "Light param must be one of the following: night, wake"
        })

        return
    }

    const states = {
        "ON": LightsDigitalState.ON,
        "OFF": LightsDigitalState.OFF
    }

    const lightState = states[state as keyof typeof states]
    console.log(states, state, lightState)

    if(lightState === undefined) {
        response.statusCode = 400

        response.json({
            message: "state must be one of the following: ON, OFF"
        })

        return
    }

    if(typeof brightness !== "number" || brightness < 0 || brightness > 100) {
        response.statusCode = 400

        response.json({
            message: "Valid brightness values are from 0-100"
        })

        return
    }

    if(platform() === "win32") {
        response.json({
            message: `Successfully toggled ${lightGpio} to ${lightState}`
        })

        return
    }

    try {
        toggleGpioOutput(lightGpio, lightState)
        await setBrightness( brightness )

        response.json({
            message: `Successfully toggled ${lightGpio} to ${lightState}`
        })
    } catch (e) {
        const { message } = e as Error
        response.statusCode = 500

        response.json({
            message
        })
    }
})

export default router