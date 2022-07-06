export const createDnsMasqConf = () => {
    const template = `
interface=wlan0
dhcp-range=192.168.4.2,192.168.4.12,12h
`

    return template
}