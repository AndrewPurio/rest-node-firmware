export enum Lights {
    night = "NIGHT_LIGHT",
    wake = "WAKE_LIGHT"
}

export enum InputsGPIOPin {
    RESET = 25
}

export enum LightsGPIOPin {
    NIGHT_LIGHT = 22,
    WAKE_LIGHT = 27
}

export enum LightsDigitalState {
    ON = 1,
    OFF = 0
}

export enum I2CBuses {
    PRIMARY = 1
}

export enum I2CSlaveAddress {
    ArduinoUno = 8
}