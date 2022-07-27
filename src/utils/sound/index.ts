import playerctl from "../playerctl"
import { MediaPlayerEvent } from "../types"
import { playMedia } from "../vlc"
import { SoundEffect } from "./constants"

export const playSoundEffect = async (sound: SoundEffect) => {
    const spawn = playMedia(sound)

    spawn.addListener("close", () => {
        console.log("Sound effect playing has stopped")
    })

    spawn.addListener("error", (error) => {
        console.log("Media play error:", error)
    })
}