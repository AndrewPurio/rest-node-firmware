import { createClient } from "redis"

const client = createClient()

export const connectToClient = async () => {
    client.on("error", (error) => {
        console.log("Redis client error:", error)
    })

    try {
        await client.connect()
    } catch (error) {
        throw error
    }   
}