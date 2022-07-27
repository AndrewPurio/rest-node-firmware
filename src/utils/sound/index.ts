import playerctl from "../playerctl"
import { delay } from "../system"
import { MediaPlayerEvent } from "../types"
import { playMedia } from "../vlc"
import { SoundEffect } from "./constants"

export const playSoundEffect = async (sound: SoundEffect) => {
    const { stdout: currentVolume } = await playerctl(MediaPlayerEvent.volume)
    const spawn = playMedia(sound, {
        playAndExit: true,
        noVideo: true
    })

    await delay(100)

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