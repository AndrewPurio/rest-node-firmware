import { spawn } from "child_process";

export interface PlayMediaConfig {
    loop?: boolean
    noVideo?: boolean
    playAndExit?: boolean
}

/**
 * Play a media file/url
 * @param file The absolute path or url of the media to play
 * @param config Additional parameters when playing the audio
 */
export function playMedia(file: string, config: PlayMediaConfig = {}) {
    const options = [file]
    const { loop, noVideo, playAndExit } = config

    if (loop)
        options.push("--loop")

    if (noVideo)
        options.push("--no-video")

    if (playAndExit)
        options.push("--play-and-exit")

    return spawn("cvlc", options)
}