import Mustache from "mustache"
import { restartDHCPCD, updateDHCPCDConfig } from "../dhcpcd"
import { disableProcess, enableProcess, getDeviceSerialNumber, restartProcess, startProcess, stopProcess } from "../../systemctl"
import { DHCPCDHostapdConfig } from "./types"
import { createDnsMasqConf } from "../dnsmasq"
import { writeFileSync } from "fs"
import { execute } from "../../execute"
import { createHostsFile, updateHostname } from "../avahi"
import { NetworkState } from "../dhcpcd/types"
import { killWpaSupplicant } from "../wifi"
import { staticIpAddress } from "./config"

export const initializeHotspot = async () => {
    try {
        const { stdout: serialNumber } = await getDeviceSerialNumber()

        const last_4_characters = /\w{4}\b/
        const [id] = last_4_characters.exec(serialNumber) || []

        const { stdout: hostapd } = await execute("cat /etc/hostapd/hostapd.conf")
        const [ssid] = /(?<=ssid=)\w+/.exec(hostapd) || []
        const [currentId] = last_4_characters.exec(ssid) || []

        if (!id || id === currentId)
            return
        
        const hostapdConf = createHostapdConf({ ssid: await configureHotspotSSID() })
        const dnsMasqConf = createDnsMasqConf()
        
        const hostname = `restnode${id}`
        const hostsFile = createHostsFile(`restnode${id}`)

        await updateHostname(hostname)

        console.log("Hostapd Conf:", hostapdConf)

        writeFileSync("/etc/hosts", hostsFile)
        writeFileSync("/etc/dnsmasq.conf", dnsMasqConf)
        writeFileSync("/etc/hostapd/hostapd.conf", hostapdConf)
    } catch (error) {
        throw error
    }
}

export const createDHCPCDConfigForHostapd = (config: DHCPCDHostapdConfig) => {
    const template = `hostname
clientid
persistent

option rapid_commit
option domain_name_servers, domain_name, domain_search, host_name
option classless_static_routes
option interface_mtu

require dhcp_server_identifier

slaac private
interface wlan0
static ip_address={{staticIpAddress}}/24
nohook wpa_supplicant`

    return Mustache.render(template, config)
}

export const createHostapdConf = (config: {
    ssid: string
}) => {
    const template = `ssid={{ssid}}
wpa_passphrase=rest_node

interface=wlan0
driver=nl80211
hw_mode=g
channel=7
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP`

    return Mustache.render(template, config)
}

export const startDnsMasq = async () => {
    const { stdout, stderr } = await startProcess("dnsmasq")

    return {
        stdout, stderr
    }
}

export const stopDnsMasq = async () => {
    const { stdout, stderr } = await stopProcess("dnsmasq")

    return {
        stdout, stderr
    }
}

export const enableHostapd = async () => {
    const { stdout, stderr } = await startProcess("dnsmasq")

    return {
        stdout, stderr
    }
}

export const startHostapd = async () => {
    const { stdout, stderr } = await startProcess("hostapd")

    return {
        stdout, stderr
    }
}

export const stopHostapd = async () => {
    const { stdout, stderr } = await stopProcess("hostapd")

    return {
        stdout, stderr
    }
}

export const disableAvahid = async () => {
    const { stdout, stderr } = await disableProcess("avahi-daemon")

    return {
        stdout, stderr
    }
}

export const stopAvahid = async () => {
    const { stdout, stderr } = await stopProcess("avahi-daemon")

    return {
        stdout, stderr
    }
}

export const enableAvahid = async () => {
    const { stdout, stderr } = await enableProcess("avahi-daemon")

    return {
        stdout, stderr
    }
}

export const startAvahid = async () => {
    const { stdout, stderr } = await startProcess("avahi-daemon")

    return {
        stdout, stderr
    }
}

export const restartAvahid = async () => {
    const { stdout, stderr } = await restartProcess("avahi-daemon")

    return {
        stdout, stderr
    }
}

export const stopWifiHotspot = async () => {
    await stopDnsMasq()
    await stopHostapd()
}

export const configureHotspotSSID = async () => {
    const { stdout } = await getDeviceSerialNumber()

    const serialNumber = stdout.replace(/\s/, "")

    const last_4_characters = /\w{4}\b/
    const id = last_4_characters.exec(serialNumber)

    console.log("Serial Number:", serialNumber)

    if (!id)
        throw new Error("Failed to get the device serial number")

    const ssid = `Rest_Node_${id[0]}`

    return ssid
}

export const restartHotspot = async () => {
    try {
        await restartDHCPCD()
        await startDnsMasq()
        await enableHostapd()
        await startHostapd()
    } catch (error) {
        console.log("Restart Hotspot Error:", error)
    }
}

export const resetHotspotConfig = async () => {
    const dhcpcdConfig = {
        staticIpAddress
    }
    
    try {
        await stopWifiHotspot()
        updateDHCPCDConfig(NetworkState.ACCESS_POINT, dhcpcdConfig)
        
        await killWpaSupplicant()
    } catch (error) {
        throw error
    }
}