import { Lights } from "../../utils/lights/types"
import { getHashFieldValues, storeHashValues } from "../redis"

export const initializeLightsConfig = async () => {
    try {
        for (let light in Lights) {
            const key = Lights[light as keyof typeof Lights]
            const fields = ["lightState", "brightness"]
            const values = await getHashFieldValues(key, fields)

            for(let index = 0; index < fields.length; index++) {
                const field = fields[index]
                const value = values[index]

                if(value !== null)
                    continue

                await storeHashValues(key, {
                    [field]: 0
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
}