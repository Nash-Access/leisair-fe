import { type Collection, type Db, ObjectId } from "mongodb";
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
    return await collection.findOne<CameraVideo>({ _id: new ObjectId(id) })
}

export const getCameraVideosByLocationId = async (locationId: string) => {
    const collection = await getCollection()
    return await collection.find<CameraVideo>({ locationId: locationId }).toArray()
}

export const getAllCameraVideos = async () => {
    const collection = await getCollection()
    return await collection.find().toArray()
}

export const getAllCameraVideosWithoutFramesProjection = async () => {
    const collection = await getCollection()
    return await collection.find().project({ vesselsDetected: 0 }).toArray() as CameraVideo[]
}

export const deleteAllCameraVideos = async () => {
    const collection = await getCollection()
    return await collection.deleteMany({})
}

export const getCameraVideosForExport = async (
    locationIds: string[],
    startDate: Date,
    endDate: Date,
    confidenceThreshold: number
) => {
    const collection = await getCollection(); // Replace with your actual collection name

    const query = {
        locationId: { $in: locationIds },
        startTime: {
            $gte: startDate,
            $lte: endDate
        }
    };

    const pipeline = [
        { $match: query },
        {
            $project: {
                locationId: 1,
                filename: 1,
                startTime: 1,
                vesselsDetected: { $objectToArray: "$vesselsDetected" }
            }
        },
        { $unwind: "$vesselsDetected" },
        { $unwind: "$vesselsDetected.v" },
        { $match: { "vesselsDetected.v.confidence": { $gte: confidenceThreshold } } },
        {
            $group: {
                _id: {
                    videoId: "$_id",
                    vesselId: "$vesselsDetected.v.vesselId"
                },
                locationId: { $first: "$locationId" },
                filename: { $first: "$filename" },
                startTime: { $first: "$startTime" },
                types: { $addToSet: "$vesselsDetected.v.type" } // Accumulate all types for each unique vesselId
            }
        },
        {
            $group: {
                _id: "$_id.videoId",
                locationId: { $first: "$locationId" },
                filename: { $first: "$filename" },
                startTime: { $first: "$startTime" },
                uniqueVesselIds: { $addToSet: "$_id.vesselId" }, // Collect unique vesselIds
                vesselTypeGroups: { $push: "$types" } // Collect all type groups for each unique vesselId
            }
        },
        {
            $project: {
                _id: 0,
                locationId: 1,
                filename: 1,
                startTime: 1,
                totalUniqueVesselsDetected: { $size: "$uniqueVesselIds" },
                vesselTypes: { 
                    $reduce: { 
                        input: "$vesselTypeGroups",
                        initialValue: "",
                        in: {
                            $concat: [
                                "$$value",
                                { $cond: { if: { $eq: [ "$$value", "" ] }, then: "", else: ", " } },
                                { $reduce: { // Convert array of types to string
                                    input: "$$this",
                                    initialValue: "",
                                    in: { $concat: [ "$$value", { $cond: { if: { $eq: [ "$$value", "" ] }, then: "", else: ", " } }, "$$this" ] }
                                }}
                            ]
                        }
                    }
                }
            }
        }
    ];

    const results = await collection.aggregate(pipeline).toArray();
    return results;
};

  

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
                vesselId: "$detectionsArray.v.vesselId",
                confidence: "$detectionsArray.v.confidence",
                bbox: "$detectionsArray.v.bbox",
                speed: "$detectionsArray.v.speed",
                direction: "$detectionsArray.v.direction",
            }
        },
        {$limit: 100}
    ];

    const cursor = collection.aggregate(pipeline);
    return cursor.toArray() as Promise<LowConfidenceFramesProjection[]>;
};