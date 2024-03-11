import type { VideoStatus } from "~/models/videoStatus";
import type { Collection, Db } from "mongodb";
import { nashDb } from "../client"

let databasePromise: Promise<Db>
let collection: Collection<MlModel>

const collectionName = "mlModels"
const getCollection = async () => {
    if (collection) {
        return collection
    }

    if (!databasePromise) {
        databasePromise = nashDb();
    }

    const db = await databasePromise

    collection = db.collection<MlModel>(collectionName)
    return collection
}

export const getOneMLModel = async (id: string) => {
    const collection = await getCollection()
    return await collection.findOne<MlModel>({ _id: id })
}

export const getAllMLModels = async () => {
    const collection = await getCollection()
    return await collection.find().toArray()
}

export const deleteAllMLModels = async () => {
    const collection = await getCollection()
    return await collection.deleteMany({})
}

export const deleteOneMLModel = async (id: string) => {
    const collection = await getCollection()
    return await collection.deleteOne({ _id: id })
}

export const selectOneMLModel = async (id: string) => {
    const collection = await getCollection()
    return await collection.findOneAndUpdate({ _id: id }, { $set: { selected: true } })
}

export const selectDefaultMLModel = async () => {
    const collection = await getCollection()
    return await collection.findOneAndUpdate({ selected: true }, { $set: { selected: false } })
}