import playerctl from "../playerctl"
import { delay } from "../system"
import { MediaPlayerEvent } from "../types"
import { playMedia } from "../vlc"
import { SoundEffect } from "./constants"

export const playSoundEffect = async (sound: SoundEffect) => {
    let currentVolume = 80

    try {
        const { stdout } = await playerctl(MediaPlayerEvent.volume)

        currentVolume = stdout
    } finally { }

    const spawn = playMedia(sound, {
        playAndExit: true,
        noVideo: true
    })

    playerctl(MediaPlayerEvent.volume, {
        value: 80
    })

    spawn.addListener("close", () => {
        console.log("Sound effect playing has stopped")

        playerctl(MediaPlayerEvent.volume, {
            value: currentVolume
        })
    })
}