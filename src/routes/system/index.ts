import { Router } from "express";

import id from "./id"
import reset from "./reset"

const router = Router()

router.use("/id", id)
router.use("/reset", reset)

export default router