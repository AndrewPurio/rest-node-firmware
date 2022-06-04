import { json, Router } from "express";
import { enableAvahid, startAvahid } from "../../../utils/network/access_point";
import { enableFirewall } from "../../../utils/network/firewall";
import { createWpaSupplicantTemplate, encodeWifiCredentials, extractEncodedPsk, resetWpaSupplicant, scanWifi, setUserTimezone, wifiDHCPCDTemplate } from "../../../utils/network/wifi";
import { writeFileSync } from "fs"

const router = Router()

router.use(json())

router.get("/", async (request, response) => {
    const { body } = request
    const { ssid, password, country, timezone } = body

    if (!ssid) {
        response.status(400)
        response.json({
            message: "Missing ssid in json body"
        })

        return
    }

    if (!password) {
        response.status(400)
        response.json({
            message: "Missing password in json body"
        })

        return
    }

    if (!country) {
        response.status(400)
        response.json({
            message: "Missing country in json body"
        })

        return
    }

    if (!timezone) {
        response.status(400)
        response.json({
            message: "Missing timezone in json body"
        })

        return
    }

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

        await enableAvahid()
        await startAvahid()
        await enableFirewall()
        await resetWpaSupplicant()
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