import { useEffect, useState } from 'react';
import { api } from '~/utils/api';

const VideoProcessingStatus = () => {
    const videoStatusesFromDb = api.videoStatuses.getAll.useQuery();
    const [lastUpdated, setLastUpdated] = useState<Date>();

    useEffect(() => {
        const interval = setInterval(() => {
            void videoStatusesFromDb.refetch();
            setLastUpdated(new Date());
        }, 4000); // Poll every 4 seconds
        return () => clearInterval(interval); // Cleanup on unmount
    }, [videoStatusesFromDb]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Video Processing Status</h1>
            <div className="mb-2 text-right">
                <span className="text-sm text-gray-600">
                    Last updated at: {lastUpdated?.toLocaleString()}
                </span>                    
            </div>
            <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Filename</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Progress</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Created At</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Updated At</th>
                    </tr>
                </thead>
                <tbody>
                    {videoStatusesFromDb.data?.map((video, index) => (
                        <tr key={index}>
                            <td className="border border-gray-300 px-4 py-2">{video._id}</td>
                            <td className="border border-gray-300 px-4 py-2">{video.filename}</td>
                            <td className="border border-gray-300 px-4 py-2">{video.status}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                {video.status === 'processing' ? (
                                    <progress value={video.progress} max="100" className="progress-bar" />
                                ) : (
                                    `${video.progress}%`
                                )}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">{new Date(video.createdAt).toLocaleString()}</td>
                            <td className="border border-gray-300 px-4 py-2">{video.updatedAt && new Date(video.updatedAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VideoProcessingStatus;
