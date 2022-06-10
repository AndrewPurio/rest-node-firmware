import { Router, json } from "express";
import { fadeBrightness, toggleGpioOutput } from "../../utils/lights";
import { LightsDigitalState, LightsGPIOPin } from "../../utils/lights/types";

const router = Router()

router.use(json())

router.get("/", (request, response) => {
    response.json({
        message: "Server is running"
    })
})

router.post("/:light", (request, response) => {
    const { body, params } = request
    const { light } = params
    const controller = new AbortController()

    try {
        toggleGpioOutput(LightsGPIOPin.NIGHT_LIGHT, LightsDigitalState.ON)
        fadeBrightness(0, 100, 60000, 500, controller)

        setTimeout(() => {
            controller.abort()
        }, 10000)

        response.json({
            message: "Fading Brightness"
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