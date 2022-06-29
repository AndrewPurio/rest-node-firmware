import { json, Router } from "express";
import { enableFirewall } from "../../../utils/network/firewall";
import { createWpaSupplicantTemplate, encodeWifiCredentials, extractEncodedPsk, resetWpaSupplicant, scanWifi, setUserTimezone, wifiDHCPCDTemplate } from "../../../utils/network/wifi";
import { writeFileSync } from "fs"
import { runEventSchedulerContainer } from "../../../utils/events";

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

    try {
        await setUserTimezone(timezone)

        writeFileSync("/etc/wpa_supplicant/wpa_supplicant.conf", wpaSupplicantTemplate)
        writeFileSync("/etc/dhcpcd.conf", wifiDHCPCDTemplate())

        response.json({
            message: "Successfully updated wifi credentials"
        })

        await enableFirewall()
        await resetWpaSupplicant()
        await runEventSchedulerContainer(timezone)
    } catch (e) {
        const { message } = e as Error

        console.log("Wifi Error:", message)
        response.statusCode = 500

        response.json({
            message
        })
    }
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