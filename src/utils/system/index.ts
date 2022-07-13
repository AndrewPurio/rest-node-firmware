import { WIFI_CONNECTED } from "../../database/keys"
import { storeValue } from "../../database/redis"
import { removeEventSchedulerContainer } from "../events"
import { initializeHotspot, resetHotspotConfig, restartHotspot } from "../network/access_point"
import { disableFirewall } from "../network/firewall"

export const resetDevice = async () => {
    try {
        await removeEventSchedulerContainer()
        await resetHotspotConfig()
        await initializeHotspot()
        await disableFirewall()
        await restartHotspot()

        await storeValue(WIFI_CONNECTED, 0)
    } catch (error) {
        throw error
    }
}