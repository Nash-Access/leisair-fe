import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '~/containers/DashboardLayout';
import { api } from '~/utils/api';
import { useRouter } from 'next/router';
import TableComponent, { TableHeader, TableRow } from '~/components/Table';

const LocationView = () => {
    const router = useRouter();
    const { locationId } = router.query;
    const cameraVideosFromDb = api.cameraVideos.getAllByLocationId.useQuery((locationId as string) || "");
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // Function to draw bounding boxes on the canvas
        const drawBoundingBoxes = () => {
            const canvas = canvasRef.current;
            const video = videoRef.current;

            if (canvas && video) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');

                // Assuming the frame rate of the video is known
                const frameRate = 15; // For example, 30 fps
                const frameNumber = Math.floor(video.currentTime * frameRate); // Estimate frame number
                console.log(frameNumber);
                const detections = cameraVideosFromDb.data?.find(video => video.filename === videoSrc)?.vesselsDetected[frameNumber.toString()];

                if (ctx && detections) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
                    detections.forEach(detection => {
                        const { x1, y1, x2, y2 } = detection.bbox;
                        ctx.strokeStyle = 'red';
                        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
                        ctx.font = '18px Arial';
                        ctx.fillStyle = 'white';
                        ctx.fillText(detection.type, x1, y1 - 10);
                    });
                }
            }
        };

        if (videoRef.current) {
            videoRef.current.addEventListener('timeupdate', drawBoundingBoxes);
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('timeupdate', drawBoundingBoxes);
            }
        };
    }, [videoSrc, cameraVideosFromDb.data]);

    // Filter videos based on search term
    const filteredVideos = cameraVideosFromDb.data?.filter(video =>
        video.filename.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const headers: TableHeader[] = [
        { key: 'filename', label: 'Filename' },
        { key: 'startTime', label: 'Start Time' },
    ];

    const rows = cameraVideosFromDb.data?.filter(video =>
        video.filename.toLowerCase().includes(searchTerm.toLowerCase())
    ).map(video => ({
        filename: video.filename,
    })) as TableRow[];

    const handleRowClick = (row: TableRow) => {
        if (row.filename) {
            setVideoSrc(row.filename);
        }
    };

    return (
        <>
            <Head>
                <title>LEISAir - Location View</title>
                <meta name="LEISAir" content="A platform for vessel detection" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <DashboardLayout sectionTitle="Location View">
                <div className="flex h-full">
                    <div className="w-3/5 flex flex-col items-center justify-center">
                        {videoSrc && (
                            <>
                                <video
                                    ref={videoRef}
                                    src={`/api/videos/${encodeURIComponent(videoSrc)}`}
                                    controls
                                    className="w-full h-auto"
                                />
                                <canvas ref={canvasRef} className="absolute" style={{ pointerEvents: 'none' }} />
                            </>
                        )}
                    </div>
                    <div className="w-2/5 flex flex-col items-center justify-start">
                        <input
                            type="text"
                            placeholder="Search videos"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mb-4"
                        />
                        <TableComponent headers={headers} rows={rows} onRowClick={handleRowClick} />
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
};

export default LocationView;
