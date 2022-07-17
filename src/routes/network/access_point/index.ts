import { Router } from "express";
import { resetHotspotConfig, restartHotspot, stopWifiHotspot } from "../../../utils/network/access_point";

import { disableFirewall } from "../../../utils/network/firewall";

const router = Router()

router.get("/", async (request, response) => {
    try {
        await resetHotspotConfig()

        response.json({
            message: "Successfully started wifi hotspot"
        })
    } catch (e) {
        const { message } = e as Error
        response.statusCode = 500

        response.json({
            message
        })

        console.log(message)
    } finally {
        await disableFirewall()
        await restartHotspot()
    }
})

export default router