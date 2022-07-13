import { Router } from "express";
import { WIFI_CONNECTED } from "../../../database/keys";
import { storeHashValues, storeValue } from "../../../database/redis";
import { removeEventSchedulerContainer } from "../../../utils/events";
import { resetHotspotConfig, restartHotspot } from "../../../utils/network/access_point";
import { disableFirewall } from "../../../utils/network/firewall";

const router = Router()

router.get("/", async (request, response) => {
    try {
        await removeEventSchedulerContainer()
        await resetHotspotConfig()

        response.json({
            message: "Successfully resetted configurations"
        })
    } catch (e) {
        const { message } = e as Error
        response.statusCode = 500

        response.json({
            message
        })

        await storeValue(WIFI_CONNECTED, 0)
    } finally {
        await disableFirewall()
        await restartHotspot()
    }
})

export default router