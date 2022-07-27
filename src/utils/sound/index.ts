import { playMedia } from "../vlc"
import { SoundEffect } from "./constants"

export const playSoundEffect = async (sound: SoundEffect) => {
    const result = playMedia(sound, {
        noVideo: true,
        playAndExit: true
    })

    return result
}