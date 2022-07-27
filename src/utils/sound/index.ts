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

    console.log("Media Spawn:", spawn)

    try {
        playerctl(MediaPlayerEvent.volume, {
            value: 80
        })
    } catch (error) {
        console.log(error)
    }

    spawn.addListener("close", () => {
        console.log("Sound effect playing has stopped")

        try {
            playerctl(MediaPlayerEvent.volume, {
                value: currentVolume
            })
        } catch (error) {
            console.log(error)
        }
    })
}