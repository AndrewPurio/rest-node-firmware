import { Router } from "express"

import folders from "./[folder]"
import player from "./player"
import staticFiles from "./files"

const router = Router()

router.use("/static", staticFiles)
router.use("/folder", folders)
router.use("/player", player)

export default router