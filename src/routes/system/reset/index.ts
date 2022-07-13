import { Router } from "express";
import { resetDevice } from "../../../utils/system";

const router = Router()

router.get("/", async (request, response) => {
    try {
        await resetDevice()

        response.json({
            message: "Successfully resetted configurations"
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