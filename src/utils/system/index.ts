import { WIFI_CONNECTED } from "../../database/keys"
import { storeValue } from "../../database/redis"
import { removeEventSchedulerContainer } from "../events"
import { initializeHotspot, restartHotspot } from "../network/access_point"

export const resetDevice = async () => {
    try {
        await initializeHotspot()
        await restartHotspot()
        await storeValue(WIFI_CONNECTED, 0)
    } catch (error) {
        throw error
    } finally {
        removeEventSchedulerContainer()
    }
}