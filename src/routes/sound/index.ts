import express, { Router } from "express";

import folders from "./[folder]"
import player from "./player"
import staticFiles from "./files"
import { io } from "../../utils/socketio";

const router = Router()

router.use("/static", staticFiles)
router.use("/folder", folders)
router.use("/player", player)

io.on("connection", (socket) => {
    
})

export default router