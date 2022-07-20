import { Router } from "express";
import { resetHotspotConfig } from "../../../utils/network/access_point";
import { resetDevice } from "../../../utils/system";

const router = Router()

router.get("/", async (request, response) => {
    try {
        await resetHotspotConfig()
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