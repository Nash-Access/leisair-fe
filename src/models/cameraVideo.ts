import {type ObjectId } from "mongodb";

export const vesselTypes =  ['SUP', 'Kayak Or Canoe', 'Rowing Boat', 'Yacht', 'Sailing Dinghy', 'Narrow Boat', 'Uber Boat', ' Class V Passenger', 'RIB', 'RNLI', 'Pleasure Boat', 'Small Powered', 'Workboat', 'Tug', 'Tug - Towing', 'Tug - Pushing', 'Large Shipping', 'Fire', 'Police', 'Not Vessel'] as const
export const vesselDirections = ['East', 'West', 'North', 'South', 'North East', 'North West', 'South East', 'South West'] as const

export type VesselType = (typeof vesselTypes)[number]
export type VesselDirection = (typeof vesselDirections)[number]

export interface CameraVideo {
    _id?: ObjectId;        // Corresponds to 'file_id' in Python, MongoDB ObjectId as a string
    locationId: string;     // Corresponds to 'location_id' in Python, MongoDB ObjectId as a string
    filename: string;      // Name of the video file
    startTime: string;     // ISO string of start datetime
    endTime?: string;       // ISO string of end datetime
    vesselsDetected: Record<string, VesselDetected[]> // Dictionary of vessel detections, keyed by frame number
}

export interface VesselDetected {
    vesselId: string;
    type: VesselType,
    confidence: number,
    speed?: number,
    direction?: VesselDirection,
    bbox: {
        x1: number,
        y1: number,
        x2: number,
        y2: number
    }
}

export interface LowConfidenceFramesProjection {
    locationId: string;
    filename: string;
    startTime: Date;
    frame: number;
    type: string;
    vesselId: string;
    confidence: number;
    speed: number;
    bbox: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    };
    direction: string;
}

export interface CameraFilters {
    locationIds: string[];
    startDate: Date;
    endDate: Date;
    confidenceThreshold?: string;
}

export default CameraVideo;
