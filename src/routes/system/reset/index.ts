import { Router } from "express";
import { removeEventSchedulerContainer } from "../../../utils/events";
import { resetHotspotConfig, restartHotspot } from "../../../utils/network/access_point";
import { disableFirewall } from "../../../utils/network/firewall";

const router = Router()

router.get("/", async (request, response) => {
    try {
        await removeEventSchedulerContainer()
        await resetHotspotConfig()
    } catch (e) {
        const { message } = e as Error
        response.statusCode = 500

        response.json({
            message
        })
    } finally {
        response.json({
            message: "Successfully resetted configurations"
        })

        await disableFirewall()
        await restartHotspot()
    }
})

export default router