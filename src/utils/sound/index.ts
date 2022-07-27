import playerctl from "../playerctl"
import { MediaPlayerEvent } from "../types"
import { playMedia } from "../vlc"
import { SoundEffect } from "./constants"

export const playSoundEffect = async (sound: SoundEffect) => {
    const spawn = playMedia(sound, {
        playAndExit: true,
        noVideo: true
    })

    playerctl(MediaPlayerEvent.volume, {
        value: 80
    })

    spawn.addListener("close", () => {
        console.log("Sound effect playing has stopped")
    })
}