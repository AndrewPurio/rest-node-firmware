import { Router, json } from "express";
import { toggleGpioOutput } from "../../utils/lights";
import { setBrightness } from "../../utils/lights/i2c";
import { LightsDigitalState, LightsGPIOPin } from "../../utils/lights/types";
import { scaleRange } from "../../utils/math";

const router = Router()

router.use(json())

router.post("/:light", async (request, response) => {
    const { params, body } = request
    const { light } = params
    const { state, brightness } = body
    
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

    try {
        toggleGpioOutput(lightGpio, lightState)
        const data = Math.round( scaleRange(brightness, 0, 100, 0, 255) )
        
        await setBrightness( data )

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