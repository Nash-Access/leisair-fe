import { useEffect, useState } from 'react';
import { api } from '~/utils/api';

const VideoProcessingStatus = () => {
    const videoStatusesFromDb = api.videoStatuses.getAll.useQuery();
    const [lastUpdated, setLastUpdated] = useState<Date>();

    useEffect(() => {
        const interval = setInterval(() => {
            void videoStatusesFromDb.refetch();
            setLastUpdated(new Date());
        }, 1000); // Poll every 4 seconds
        return () => clearInterval(interval); // Cleanup on unmount
    }, [videoStatusesFromDb]);

    return (
        <div className="relative w-full">
            <div className="mb-2 text-right absolute -top-7 right-0">
                <span className="text-sm text-gray-600">
                    Last updated at: {lastUpdated?.toLocaleString()}
                </span>                    
            </div>
            <div className="w-full text-left border-collapse overflow-x-auto max-h-[calc(100vh-350px)] bg-white relative">
            <table className="w-full h-full text-left border-collapse sticky">
                <thead className=''>
                    <tr className="bg-gray-100">
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
        </div>
    );
};

export default VideoProcessingStatus;
