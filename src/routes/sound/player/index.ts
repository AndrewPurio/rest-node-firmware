import { json, Router } from "express";
import playerctl from "../../../utils/playerctl";
import { io } from "../../../utils/socketio";
import { MediaPlayerEvent } from "../../../utils/types";
import { playMedia } from "../../../utils/vlc";
import { PlayMedia } from "./types";

const router = Router()

router.use(json())

router.post("/", async (request, response) => {
    const { body } = request
    const data = body as PlayMedia

    if (!data.path) {
        response.statusCode = 400
        response.json({
            message: "Missing path parameter for the target media to play"
        })

        return
    }

    if (!data.volume) {
        response.statusCode = 400
        response.json({
            message: "Missing volume parameter for the target media to play"
        })

        return
    }

    const { path, loop, volume } = data
    const value = volume / 100

    try {
        playMedia(path, {
            loop: !!loop
        })

        await playerctl(MediaPlayerEvent.volume, {
            value
        })

        const { stdout: message } = await playerctl(MediaPlayerEvent.status)

        io.sockets.emit("player", {
            "status": message
        })

        response.json({
            message
        })
    } catch (e) {
        const { message } = e as Error
        response.statusCode = 500

        response.json({
            message
        })
    }
})

router.get("/stop", async (request, response) => {
    try {
        const { stdout: message } = await playerctl(MediaPlayerEvent.stop)

        response.json({
            message
        })
    } catch (e) {
        const { message } = e as Error
        response.statusCode = 500

        response.json({
            message
        })
    }
})

export default router