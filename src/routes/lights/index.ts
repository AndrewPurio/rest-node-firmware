import { Router, json } from "express";
import { platform } from "os";
import { getHashFieldValues, storeHashValues } from "../../database/redis";
import { toggleGpioOutput } from "../../utils/lights";
import { setBrightness } from "../../utils/lights/i2c";
import { Lights, LightsDigitalState, LightsGPIOPin } from "../../utils/lights/types";
import { io } from "../../utils/socketio";

const router = Router()

router.use(json())

router.get("/:light", async (request, response) => {
    const { params, query } = request
    const { light } = params
    const { fields } = query

    const currentLight = Lights[light as keyof typeof Lights]

    if(!currentLight) {
        response.statusCode = 400

        response.json({
            message: "Light param must be one of the following: night, wake"
        })

        return
    }

    if(!fields) {
        response.statusCode = 400

        response.json({
            message: "Missing 'fields' query"
        })

        return
    }

    try {
        const values = await getHashFieldValues(currentLight, fields as string | string[])

        response.json(values)
    } catch (e) {
        const { message } = e as Error
        response.statusCode = 500

        response.json({
            message
        })
    }
})

router.post("/:light", async (request, response) => {
    const { params, body } = request
    const { light } = params
    const { state, brightness, options } = body

    const lights = {
        night: LightsGPIOPin.NIGHT_LIGHT,
        wake: LightsGPIOPin.WAKE_LIGHT
    }

    const lightGpio = lights[light as keyof typeof lights]

    if (!lightGpio) {
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

    if (lightState === undefined) {
        response.statusCode = 400

        response.json({
            message: "state must be one of the following: ON, OFF"
        })

        return
    }

    if (typeof brightness !== "number" || brightness < 0 || brightness > 100) {
        response.statusCode = 400

        response.json({
            message: "Valid brightness values are from 0-100"
        })

        return
    }
   
    try {
        const currentLight = Lights[light as keyof typeof Lights]

        await storeHashValues(currentLight, {
            lightState,
            brightness
        })

        io.sockets.emit(currentLight, {
            lightState, brightness
        })

        if (platform() === "win32") {
            response.json({
                message: `Successfully toggled ${lightGpio} to ${lightState}`
            })
    
            return
        }

        toggleGpioOutput(lightGpio, lightState)
        await setBrightness(brightness)

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