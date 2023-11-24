import { useEffect, useState } from 'react';
import CameraVideo from '~/models/cameraVideo';

const VideoStatus = () => {
    const [videoStatuses, setVideoStatuses] = useState<CameraVideo[]>([]);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000/ws");

        ws.onmessage = (event:MessageEvent<string>) => {
            const data = JSON.parse(event.data) as CameraVideo[];
            setVideoStatuses(data);  // Update the state with the latest status
        };

        ws.onerror = (event) => {
            console.error("WebSocket error:", event);
        };

        ws.onclose = () => {
            console.log("Disconnected from WebSocket");
        };

        return () => {
            ws.close();
        };
    }, []);

    return (
        <div>
            <h1>Video Processing Status</h1>
            {videoStatuses.map((video, index) => (
                <div key={index}>
                    <h2>{video._id}</h2>
                    <p>Status: {video.status}</p>
                    <p>Progress: {video.progress}%</p>
                </div>
            ))}
        </div>
    );
};

export default VideoStatus;
