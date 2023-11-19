import { CameraLocation } from "~/models/cameraLocation";
import { BSON, Collection, Db, ObjectId } from "mongodb";
import {dashboardDb} from "../client"

let databasePromise: Promise<Db>
let collection: Collection<CameraLocation>

const collectionName = "cameraLocations"
const getCollection = async () => {
    if (collection){
        return collection
    }

    if (!databasePromise){
        databasePromise = dashboardDb();
    }

    const db = await databasePromise
    void db.createIndex(collectionName, {datasetId: 1})

    collection = db.collection<CameraLocation>(collectionName)
    return collection
}

export const getOneCameraLocation = async (id: string) => {
    const collection = await getCollection()
    return await collection.findOne<CameraLocation>({_id: id})
}

export const getAllCameraLocations = async () => {
    const collection = await getCollection()
    return await collection.find().toArray()
}

export const insertOneDataItem = async (cameraLocation:CameraLocation) => {
    const collection = await getCollection()
    return await collection.insertOne(cameraLocation)
}

export const insertManyDataItems = async (cameraLocations:Array<CameraLocation>) => {
    const collection = await getCollection()
    return await collection.insertMany(cameraLocations)
}

export const replaceDataItem = async (cameraLocation:CameraLocation) => {
    const collection = await getCollection()
    const id = new ObjectId(cameraLocation._id)
    delete cameraLocation._id
    return await collection.replaceOne({cameraLocation: id}, cameraLocation)
}

export const deleteDataItem = async (id: string) => {
    const collection = await getCollection()
    return await collection.deleteOne({_id: id})
}