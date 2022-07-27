export enum MediaPlayerEvent {
    play = "play",
    pause = "pause",
    "play-pause" = "play-pause",
    stop = "stop",
    status = "status",
    volume = "volume"
}

export interface MediaPlayerConfig {
    value: number
}