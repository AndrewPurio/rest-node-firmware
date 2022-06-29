import { json, Router } from "express";
import playerctl from "../../../utils/playerctl";
import { io } from "../../../utils/socketio";
import { playMedia } from "../../../utils/vlc";

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

    playMedia(path, {
        loop: !!loop
    })

    playerctl("volume", {
        value
    })

    const { stdout } = await playerctl("status")


    io.sockets.emit("status", {
        "status": stdout
    })

    response.json({
        message: "Successfully playing media"
    })
})

export default router