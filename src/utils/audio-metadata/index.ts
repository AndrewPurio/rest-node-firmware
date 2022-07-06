import { parseFile } from "music-metadata"

export const parseAudioMetadata = async (filePath: string) => {
    try {
        const metadata = await parseFile(filePath)

        return metadata
    } catch (error) {
        throw error
    }
}