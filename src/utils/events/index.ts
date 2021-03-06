import { execute } from "../execute"

const dockerContainer = "event-scheduler"
const dockerImage = "restnode/event-scheduler"

export const runEventSchedulerContainer = async (timezone: string) => {
    const env = timezone ? `-e TZ=${timezone} ` : ""

    try {
        await execute(`sudo docker run -p 1880:1880 -v events:/data --restart=always --name ${dockerContainer} ${env}${dockerImage}`)
    } catch (error) {
        throw error
    }
}

export const removeEventSchedulerContainer = async () => {
    try {
        await execute(`sudo docker stop ${dockerContainer}`)
        await execute(`sudo docker container rm ${dockerContainer}`)
    } finally {}
}

export const checkIfEventSchedulerExists = async () => {
    try {
        const { stdout, stderr } = await execute(`sudo docker ps -q -f ${dockerContainer}`)

        return { stdout, stderr }
    } catch (error) {
        throw error
    }
}