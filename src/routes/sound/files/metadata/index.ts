import { Router } from "express";
import { parseAudioMetadata } from "../../../../utils/audio-metadata";

const router = Router()

router.get("/", async (request, response) => {
    const { query } = request
    const { path } = query

    console.log("Path:", path)

    if(!path) {
        response.statusCode = 400

        response.json({
            message: "Missing file path in query"
        })

        return
    }

    try {
        const metadata = await parseAudioMetadata(path as string)

        response.json({
            metadata
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