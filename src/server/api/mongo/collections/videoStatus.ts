import type { VideoStatus } from "~/models/videoStatus";
import type { Collection, Db } from "mongodb";
import { nashDb } from "../client"

let databasePromise: Promise<Db>
let collection: Collection<VideoStatus>

const collectionName = "videoStatus"
const getCollection = async () => {
    if (collection) {
        return collection
    }

    if (!databasePromise) {
        databasePromise = nashDb();
    }

    const db = await databasePromise

    collection = db.collection<VideoStatus>(collectionName)
    return collection
}

export const getOneVideoStatus = async (id: string) => {
    const collection = await getCollection()
    return await collection.findOne<VideoStatus>({ _id: id })
}

export const getAllVideoStatuses = async () => {
    const collection = await getCollection()
    return await collection.find().toArray()
}

export const deleteAllVideoStatuses = async () => {
    const collection = await getCollection()
    return await collection.deleteMany({})
}