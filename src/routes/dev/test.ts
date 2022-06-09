const events = {
    night: {
        time: "21:00",
        light: {
            onoffset: -60,
            offoffset: 0,
            onpayload: {
                type: "NIGHT_LIGHT",
                state: "ON"
            },
            offpayload: {
                type: "NIGHT_LIGHT",
                state: "OFF"
            }
        },
        sound: {
            onoffset: -60,
            offoffset: 0,
            onpayload: {
                type: "NIGHT_SOUND",
                state: "PLAYING"
            },
            offpayload: {
                type: "NIGHT_SOUND",
                state: "STOPPED"
            }
        },
        relax: {
            onoffset: -60,
            offoffset: 0,
            onpayload: {
                type: "RELAXATION_SOUND",
                state: "PLAYING"
            },
            offpayload: {
                type: "RELAXATION_SOUND",
                state: "STOPPED"
            }
        }
    },
    wake: {
        time: "7:00",
        light: {
            onoffset: 0,
            offoffset: 60,
            onpayload: {
                type: "WAKE_LIGHT",
                state: "ON"
            },
            offpayload: {
                type: "WAKE_LIGHT",
                state: "OFF",
            }
        },
        sound: {
            onoffset: -45,
            offoffset: 0,
            onpayload: {
                type: "WAKE_SOUND",
                state: "PLAYING"
            },
            offpayload: {
                type: "NIGHT_SOUND",
                state: "STOPPED"
            }
        }
    }
}