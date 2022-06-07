import { Cron } from "croner"

const events = {}

/**
 * Schedule a handler function to trigger based on the scheduled time
 * 
 * @param time The particular state of time when the cronJon will trigger. Leave the particular parameter empty if you want to trigger it in that interval (e.g. if week is undefined, the cronJob schedule will trigger weekly)
 * @returns The pointer to the cron job created
 */
export const cronJob = (time: CronParameters = {}, handler: () => void) => {
    const seconds = time.seconds !== undefined ? time.seconds: "*"
    const minutes = time.minutes !== undefined ? time.minutes: "*"
    const hours = time.hours !== undefined ? time.hours: "*"
    const days = time.days !== undefined ? time.days: "*"
    const months = time.months !== undefined ? time.months: "*"
    const daysOfWeek = time.daysOfWeek !== undefined ? time.daysOfWeek: "*"

    const pattern = `${seconds} ${minutes} ${hours} ${days} ${months} ${daysOfWeek}`

    const cron = new Cron(pattern, () => {
        console.log("Event fired:", new Date(), time)
    })

    return cron
}