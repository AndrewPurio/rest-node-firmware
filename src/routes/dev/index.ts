import { Router } from "express";

const router = Router()

router.get("/", (request, response) => {
    response.json({
        message: "Server is running"
    })
})

export default router