import { Router } from "express";

import id from "./id"

const router = Router()

router.use("/id", id)

export default router