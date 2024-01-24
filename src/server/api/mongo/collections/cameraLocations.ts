import type { CameraLocation } from "~/models/cameraLocation";
import { type Collection, type Db, ObjectId } from "mongodb";
import { nashDb } from "../client"

let databasePromise: Promise<Db>
let collection: Collection<CameraLocation>

const collectionName = "cameraLocation"
const getCollection = async () => {
    if (collection) {
        return collection
    }

    if (!databasePromise) {
        databasePromise = nashDb();
    }

    const db = await databasePromise

    collection = db.collection<CameraLocation>(collectionName)
    return collection
}

export const getOneCameraLocation = async (id: string) => {
    const collection = await getCollection()
    return await collection.findOne<CameraLocation>({ _id: new ObjectId(id) })
}

export const getAllCameraLocations = async () => {
    const collection = await getCollection()
    return await collection.find().toArray()
}