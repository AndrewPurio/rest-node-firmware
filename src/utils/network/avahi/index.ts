import Mustache from "mustache"

import { writeFileSync } from "fs"
import { getDeviceSerialNumber } from "../../systemctl"
import { execute } from "../../execute"
import { restartAvahid } from "../access_point"

const createRestNodeService = async (name: string = "Rest_Node", creator: string = "Exist_Tribe") => {
    try {
        const { stdout: serial_number } = await getDeviceSerialNumber()

        const config = {
            name,
            creator,
            serial_number
        }

        const template = `<?xml version="1.0" standalone='no'?><!--*-nxml-*-->
<!DOCTYPE service-group SYSTEM "avahi-service.dtd">
<service-group>
<name replace-wildcards="yes">%h</name>
<service>
<type>_http._tcp</type>
<port>80</port>
<txt-record>{{name}}</txt-record>
<txt-record>{{creator}}</txt-record>
<txt-record>{{serial_number}}</txt-record>
</service>
</service-group>
`

        return Mustache.render(template, config)
    } catch (error) {
        throw error
    }
}

export const createHostsFile = (hostname: string) => {
    const config = {
        hostname
    }

    const template = `127.0.0.1       localhost
::1             localhost ip6-localhost ip6-loopback
ff02::1         ip6-allnodes
ff02::2         ip6-allrouters

127.0.1.1       {{hostname}}
`

    return Mustache.render(template, config)
}

export const updateHostname = async (hostname: string) => {
    try {
        await execute(`sudo hostnamectl set-hostname ${hostname}`)
        await restartAvahid()
    } catch (error) {
        throw error
    }
}

export const updateAvahiService = async () => {
    try {
        const data = await createRestNodeService()

        writeFileSync("/etc/avahi/services/http.service", data)
        await restartAvahid()
    } catch (error) {
        throw error
    }
}
