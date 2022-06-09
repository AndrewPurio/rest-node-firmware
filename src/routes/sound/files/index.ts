import express, { Router } from "express";
import { readdir } from "fs/promises";

const router = Router()

router.use(
    express.static("static")
)

router.get("/", async (request, response) => {
    try {
        const files = await readdir("static")

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