import express, { Router } from "express";

import staticFiles from "./static"
import folders from "./[folder]"

const router = Router()

router.use("/static", staticFiles)
router.use("/folder", folders)

export default router