
interface CameraVideo {
    _id: string;        // Corresponds to 'file_id' in Python, MongoDB ObjectId as a string
    filename: string;      // Name of the video file
    startTime: string;     // ISO string of start datetime
    endTime: string;       // ISO string of end datetime
    status: string;        // Current status (e.g., "processing", "completed")
    progress: number;      // Processing progress as a float (0 to 100)
    history: string[];     // List of historical statuses
    createdAt: string;     // ISO string of creation datetime
    updatedAt?: string;    // ISO string of last update datetime, optional
}

export default CameraVideo;