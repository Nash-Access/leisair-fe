import type { Collection, Db, ObjectId } from "mongodb";
import { nashDb } from "../client"
import type { VesselCorrection } from "~/models/vesselCorrections";

let databasePromise: Promise<Db>
let collection: Collection<VesselCorrection>

const collectionName = "vesselCorrections"
const getCollection = async () => {
    if (collection) {
        return collection
    }

    if (!databasePromise) {
        databasePromise = nashDb();
    }

    const db = await databasePromise

    collection = db.collection<VesselCorrection>(collectionName)
    return collection
}

export const getOneVesselCorrection = async (id: ObjectId) => {
    const collection = await getCollection()
    return await collection.findOne<VesselCorrection>({ _id: id })
}

export const getVesselCorrectionsByLocationId = async (locationId: string) => {
    const collection = await getCollection()
    return await collection.find<VesselCorrection>({ locationId: locationId }).toArray()
}

export const getAllVesselCorrections = async () => {
    const collection = await getCollection()
    return await collection.find().toArray()
}

export const getAllVesselCorrectionsWithoutImages = async () => {
    const collection = await getCollection()
    return await collection.find({}, { projection: { image: 0 } }).toArray()
}

export const insertVesselCorrection = async (vesselCorrection: VesselCorrection) => {
    const collection = await getCollection()
    return await collection.insertOne(vesselCorrection)
}