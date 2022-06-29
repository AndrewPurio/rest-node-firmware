import { Router } from "express";
import { readdir } from "fs/promises";

const router = Router()

router.get("/:folder", async (request, response) => {
    const { params } = request
    const { folder } = params

    console.log("Folder:", folder)

    try {
        const files = await readdir(`static/${folder}`)

        response.json({
            files
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