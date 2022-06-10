import { openPromisified } from "i2c-bus"
import { I2CBuses, I2CSlaveAddress } from "./types"

export const setBrightness = async (brightness: number) => {
    try {
        const i2c1 = await openPromisified(I2CBuses.PRIMARY)
        const bufferedData = Buffer.allocUnsafe(1)
        bufferedData.writeIntLE(brightness, 0, bufferedData.length)

        await i2c1.i2cWrite(I2CSlaveAddress.ArduinoUno, bufferedData.length, bufferedData)
    } catch (error) {
        throw error
    }
}