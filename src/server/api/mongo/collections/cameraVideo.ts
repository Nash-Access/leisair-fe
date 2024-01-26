import { type Collection, type Db, type ObjectId } from "mongodb";
import { nashDb } from "../client"
import CameraVideo, { LowConfidenceFramesProjection } from "~/models/cameraVideo";

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

export const getLowConfidenceDetections = async (confidenceThreshold: number): Promise<LowConfidenceFramesProjection[]> => {
    const db: Db = await nashDb();
    const collection = db.collection("cameraVideo");

    const pipeline = [
        // Match to filter videos as needed
        // {
        //     $match: {}
        // },
        // Convert 'vesselsDetected' into an array of {frame, detections}
        {
            $project: {
                locationId: 1,
                filename: 1,
                startTime: 1,
                detectionsArray: {
                    $objectToArray: "$vesselsDetected"
                }
            }
        },
        // Unwind the array to normalize data
        {
            $unwind: "$detectionsArray"
        },
        // Unwind detections for each frame
        {
            $unwind: "$detectionsArray.v"
        },
        // Match detections with low confidence
        {
            $match: {
                "detectionsArray.v.confidence": { $lt: confidenceThreshold }
            }
        },
        // Project the required shape
        {
            $project: {
                _id: 0,
                locationId: 1,
                filename: 1,
                startTime: 1,
                frame: "$detectionsArray.k",
                type: "$detectionsArray.v.type",
                confidence: "$detectionsArray.v.confidence",
                bbox: "$detectionsArray.v.bbox",
                speed: "$detectionsArray.v.speed",
                direction: "$detectionsArray.v.direction",
            }
        }
    ];

    const cursor = collection.aggregate(pipeline);
    return cursor.toArray() as Promise<LowConfidenceFramesProjection[]>;
};