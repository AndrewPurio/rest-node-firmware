import { Router } from "express";
import { resetHotspotConfig, restartHotspot, stopWifiHotspot } from "../../../utils/network/access_point";

import { disableFirewall } from "../../../utils/network/firewall";

const router = Router()

router.get("/", async (request, response) => {
    try {
       await resetHotspotConfig()
    } catch (e) {
        const { message } = e as Error
        response.statusCode = 500

        response.json({
            message
        })

        console.log(message)
    } finally {
        response.json({
            message: "Successfully started wifi hotspot"
        })
        
        await disableFirewall()
        restartHotspot()
    }
})

export default router