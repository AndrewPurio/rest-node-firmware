import { openPromisified } from "i2c-bus"
import { I2CBuses, I2CSlaveAddress } from "./types"

export const setBrightness = async (brightness: number) => {
    try {
        const i2c1 = await openPromisified(I2CBuses.PRIMARY)

        await i2c1.writeByte(I2CSlaveAddress.ArduinoUno, 0, brightness)
    } catch (error) {
        throw error
    }
}