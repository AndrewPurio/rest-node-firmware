import { Router, json } from "express";
import { toggleGpioOutput } from "../../utils/lights";
import { LightsDigitalState, LightsGPIOPin } from "../../utils/lights/types";

const router = Router()

router.use(json())

router.post("/:light", async (request, response) => {
    const { params, body } = request
    const { light } = params
    const { state } = body
    
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

    if(!lightState) {
        response.statusCode = 400

        response.json({
            message: "state must be one of the following: ON, OFF"
        })

        return
    }

    try {
        toggleGpioOutput(lightGpio, lightState)
    } catch (e) {
        const { message } = e as Error
        response.statusCode = 500

        response.json({
            message
        })
    }
})

export default router