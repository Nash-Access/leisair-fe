import { BSON, Collection, Db, ObjectId } from "mongodb";
import { nashDb } from "../client"
import CameraVideo from "~/models/cameraVideo";

let databasePromise: Promise<Db>
let collection: Collection<CameraVideo>

const collectionName = "cameraVideo"
const getCollection = async () => {
    if (collection) {
        return collection
    }

    if (!databasePromise) {
        databasePromise = nashDb();
    }

    const db = await databasePromise

    collection = db.collection<CameraVideo>(collectionName)
    return collection
}

export const getOneCameraVideo = async (id: ObjectId) => {
    const collection = await getCollection()
    return await collection.findOne<CameraVideo>({ _id: id })
}

export const getCameraVideosByLocationId = async (locationId: string) => {
    const collection = await getCollection()
    return await collection.find<CameraVideo>({ locationId: locationId }).toArray()
}

export const getAllCameraVideos = async () => {
    const collection = await getCollection()
    return await collection.find().toArray()
}