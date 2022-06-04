import { Router } from "express";
import { restartHotspot, stopWifiHotspot } from "../../../utils/network/access_point";

import { staticIpAddress } from "../../../utils/network/access_point/config"
import { updateDHCPCDConfig } from "../../../utils/network/dhcpcd";
import { NetworkState } from "../../../utils/network/dhcpcd/types";
import { disableFirewall } from "../../../utils/network/firewall";
import { killWpaSupplicant } from "../../../utils/network/wifi";

const router = Router()

router.use("/", async (request, response) => {
    const dhcpcdConfig = {
        staticIpAddress
    }

    try {
        await stopWifiHotspot()
        await updateDHCPCDConfig(NetworkState.ACCESS_POINT, dhcpcdConfig)


        await killWpaSupplicant()

    } catch (e) {
        const error = e as Error

        console.log(error)
    } finally {
        response.json("Success")

        await disableFirewall()
        restartHotspot()
    }
})

export default router