import Mustache from "mustache"

import { writeFileSync } from "fs"
import { getDeviceSerialNumber } from "../../systemctl"

const createRestNodeService = async (name: string = "Rest_Node", creator: string = "Exist_Tribe") => {
    try {
        const { stdout: serial_number } = await getDeviceSerialNumber()

        const config = {
            name,
            creator,
            serial_number: (serial_number as string).replace(/\W+/g, "")
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

export const updateAvahiService = async () => {
    try {
        const data = await createRestNodeService()

        writeFileSync("/etc/avahi/services/http.service", data)
    } catch (error) {
        throw error
    }
}
