import { ObjectId } from 'mongodb';


export interface CameraLocation {
    _id?: ObjectId;
    name: string;
    latitude: number;
    longitude: number;
}

