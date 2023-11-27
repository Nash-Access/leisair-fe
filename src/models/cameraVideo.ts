import { ObjectId } from "mongodb";

type VesselType = 'Kayak or Canoe' | 'RIB' | 'Rowing' | 'SUP' | 'Small Unpowered' | 'Small Powered' | 'Tug' | 'Passenger'

type VesselDirection = 'East' | 'West' | 'North' | 'South' | 'North East' | 'North West' | 'South East' | 'South West'

export interface CameraVideo {
    _id?: ObjectId;        // Corresponds to 'file_id' in Python, MongoDB ObjectId as a string
    locationId: string;     // Corresponds to 'location_id' in Python, MongoDB ObjectId as a string
    filename: string;      // Name of the video file
    startTime: string;     // ISO string of start datetime
    endTime?: string;       // ISO string of end datetime
    vesselsDetected: { [key: string]: VesselDetected[] } // Dictionary of vessel detections, keyed by frame number
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

export default CameraVideo;