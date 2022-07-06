import { Router } from "express";

import access_point from "./access_point"
import wifi from "./wifi"

const router = Router()

router.use("/access_point", access_point)
router.use("/wifi", wifi)

export default router