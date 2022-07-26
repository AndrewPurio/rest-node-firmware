import { json, Router } from "express";
import { enableFirewall } from "../../../utils/network/firewall";
import { createWpaSupplicantTemplate, encodeWifiCredentials, extractEncodedPsk, resetWpaSupplicant, scanWifi, setUserTimezone, wifiDHCPCDTemplate } from "../../../utils/network/wifi";
import { writeFileSync } from "fs"
import { runEventSchedulerContainer } from "../../../utils/events";
import { getValue, storeValue } from "../../../database/redis";
import { WIFI_CONNECTED } from "../../../database/keys";
import { DHCPCD_CONF, WPA_SUPPLICANT_CONF } from "../../../config/files";
import { enableProcess } from "../../../utils/systemctl";

const router = Router()

router.use(json())

router.post("/", async (request, response) => {
    const { body } = request

    for (let key in body) {
        if (body[key])
            continue

        response.statusCode = 400
        response.json({
            message: `Missing ${key} in json body`
        })

        return
    }

    const { ssid, password, country, timezone } = body
    const encodedCredentials = await encodeWifiCredentials({ ssid, password })
    const encodedPsk = await extractEncodedPsk(encodedCredentials)
    const wpaSupplicantTemplate = createWpaSupplicantTemplate({
        ssid,
        password: encodedPsk,
        country
    })

    const handleWifiConnection = async (retry = false) => {
        console.log("Retrying Wifi Connection...")

        try {
            await setUserTimezone(timezone)

            writeFileSync(WPA_SUPPLICANT_CONF, wpaSupplicantTemplate)
            writeFileSync(DHCPCD_CONF, wifiDHCPCDTemplate())

            response.json({
                message: "Successfully updated wifi credentials"
            })

            await storeValue(WIFI_CONNECTED, 1)

            console.log("Wifi status updated:", await getValue(WIFI_CONNECTED))

            await enableFirewall()
            await resetWpaSupplicant()
            await runEventSchedulerContainer(timezone)
            await enableProcess("wpa_supplicant")
        } catch (e) {
            if(!retry) {
                setTimeout(() => {
                    handleWifiConnection(true)
                }, 500)

                return
            }

            const { message } = e as Error

            console.log("Wifi Error:", message)
            response.statusCode = 500

            response.json({
                message
            })
        }
    }

    handleWifiConnection()
})

router.get("/scan", async (request, response) => {
    try {
        const wifiList = await scanWifi()

        response.json(wifiList)
    } catch (e) {
        const error = e as Error

        response.status(500)
        response.json(error.message)
    }
})

export default router