import { Server } from "socket.io"

const createWebSocketServer = () => {
    const io = new Server({
        cors: {
            origin: "*"
        }
    })

    return io
}

export const io = createWebSocketServer()