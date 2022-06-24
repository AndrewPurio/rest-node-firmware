import { createServer } from "http"
import { Server } from "socket.io"
import { app } from "../server"

const createWebSocketServer = () => {
    const server = createServer(app)
    const io = new Server({
        cors: {
            origin: "*"
        }
    })

    io.attach(server)

    return io
}

export const io = createWebSocketServer()