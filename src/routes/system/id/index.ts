import { Router } from "express";
import { getDeviceSerialNumber } from "../../../utils/systemctl";

const router = Router()

router.get("/", async (request, response) => {
    try {
       const { stdout: id } = await getDeviceSerialNumber()

       response.json({
           id
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