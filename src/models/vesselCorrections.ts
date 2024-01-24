import { ObjectId } from "mongodb";

export interface VesselCorrection {
    _id?: ObjectId;
    locationId: string;
    filename: string;
    frame: number;
    type: string;
    confidence: number;
    speed: number;
    direction: string;
    image: string;
    bbox: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    };

}