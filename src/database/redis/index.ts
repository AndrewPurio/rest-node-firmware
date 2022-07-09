import { createClient } from "redis"
import { RedisCommandArgument } from "@redis/client/dist/lib/commands"
import { ZMember } from "@redis/client/dist/lib/commands/generic-transformers"

import type { HashFields, ZAddOptions, ZRangeOptions } from "./types"

export const client = createClient()

/**
 * Connects to the redis instance
 * 
 * @param options Redis client options to add such as the url to where the redis instance is located
 * @returns The redis client
 */
export const connectToRedis = async (redisClient: typeof client) => {
    try {
        await redisClient.connect()
    } catch (error) {
        throw error
    }
}

/**
 * Get the associated value to the key stored
 * 
 * @param key The key of the value to get
 * @returns The data stored associated with the key
 */
export const getValue = async (key: RedisCommandArgument) => {
    try {
        const data = await client.get(key)

        return data
    } catch (error) {
        throw error
    }
}

/**
 * Store the value associated with the key
 * 
 * @param key The key of the value to be stored
 * @param value The value paired with the key
 */
export const storeValue = async (key: RedisCommandArgument, value: number | RedisCommandArgument) => {
    try {
        await client.set(key, value)
    } catch (error) {
        throw error
    }
}

/**
 * Removes the specified keys along with their values. A key is ignored if it does not exist.
 * 
 * @param key The key/s and the values associated to be deleted
 * @returns The number of successfully deleted values
 */
export const deleteValues = async (key: RedisCommandArgument | RedisCommandArgument[]) => {
    try {
        const deletedValues = await client.del(key)

        return deletedValues
    } catch (error) {
        throw error
    }
}

/**
 * 
 * 
 * @param key 
 * @param fields 
 * @returns 
 */
export const getHashFieldValues = async (key: RedisCommandArgument, fields: RedisCommandArgument|RedisCommandArgument[]) => {
    try {
        const data = await client.hmGet(key, fields)

        return data
    } catch (error) {
        throw error
    }
}

/**
 * 
 * @param key 
 * @param fields 
 * @returns 
 */
export const storeHashValues = async (key: RedisCommandArgument, fields: HashFields) => {
    try {
        const storedValues = await client.hSet(key, fields)

        return storedValues
    } catch (error) {
        throw error
    }
}

export const deleteHashValues = async (key: RedisCommandArgument, fields: RedisCommandArgument | RedisCommandArgument[]) => {
    try {
        const deletedValues = await client.hDel(key, fields)

        return deletedValues
    } catch (error) {
        throw error
    }
}

/**
 * Adds all the specified members with the specified scores to the sorted set stored at key. It is possible to specify multiple score / member pairs. If a specified member is already a member of the sorted set, the score is updated and the element reinserted at the right position to ensure the correct ordering.
 * If key does not exist, a new sorted set with the specified members as sole members is created, like if the sorted set was empty. If the key exists but does not hold a sorted set, an error is returned.
 * 
 * @param key 
 * @param members 
 * @param options 
 * @returns 
 */
export const addSortedSet = async (key: RedisCommandArgument, members: ZMember | ZMember[], options?: ZAddOptions) => {
    try {
        const valuesAdded = await client.zAdd(key, members, options)        

        return valuesAdded
    } catch (error) {
        throw error
    }
}

/**
 * Returns the number of elements in the sorted set at key with a score between min and max.
 * 
 * The min and max arguments have the same semantic as described for ZRANGEBYSCORE.
 * 
 * Note: the command has a complexity of just O(log(N)) because it uses elements ranks (see ZRANK) to get an idea of the range. Because of this there is no need to do a work proportional to the size of the range
 * 
 * @param key 
 * @param min 
 * @param max 
 * @returns the number of elements in the specified score range
 */
export const getSortedSetMemberCount = async (key: RedisCommandArgument, min: RedisCommandArgument | number, max: RedisCommandArgument | number) => {
    try {
        const values = await client.zCount(key, min, max)

        return values
    } catch (error) {
        throw error
    }
}

/**
 * Returns the specified range of elements in the sorted set stored at <key>.
 * 
 * ZRANGE can perform different types of range queries: by index (rank), by the score, or by lexicographical order.
 * 
 * @param key 
 * @param min 
 * @param max 
 * @param options 
 * @returns 
 */
export const getSortedSetRangeMembers = async (
    key: RedisCommandArgument,
    min: RedisCommandArgument | number, 
    max: RedisCommandArgument | number,
    options?: ZRangeOptions
) => {
    try {
        const members = await client.zRange(key, min, max, options)

        return members
    } catch (error) {
        throw error
    }
}
