import {type ObjectId } from "mongodb";

export const vesselTypes =  ['Kayak or Canoe', 'Narrow Boat','RIB - General','RIB - Pleasure','RIB - RNLI', 'RIB - Tours','Rowing - 4','Rowing - 8','single scull', 'double scull', 'rowboat other', 'SUP', 'Sailing Dinghy', 'Service - Port Tender or Police', 'Service - Tug','Service - Tug Towing','Service - Tug Pushing','Service - General','Service - Bunker Barge', 'Small Powered - General', 'dayboat',   'pleasure cruiser', 'Service - Workboat',  'patrol vessel', 'Small Powered - Pleasure Boat', 'Small Powered - Tender', 'Yacht - Not Under Sail',   'Yacht - Under Sail','Class V Passenger', 'Uber Boat','Tall Ship','Large Shipping - General','Large Shipping - Cargo','Large Shipping - Dredger','Large Shipping - Warship', 'Not Vessel'] as const
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
