
export type VesselType = 'Fishing' | 'Cargo' | 'Tanker' | 'Passenger' | 'Other';

export interface VesselDetection {
    _id?: string;
    cameraId: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    classification: VesselType;
    timestamp: Date;
    confidence: number;
    direction: "East" | "West" | "North" | "South";
    }