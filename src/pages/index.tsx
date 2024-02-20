import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '~/containers/DashboardLayout';
import { api } from '~/utils/api';
import TableComponent, { type TableHeader, type TableRow } from '~/components/Table';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
import ExportDataButton from '~/components/Home/DataExtractionButton';


const LocationView = () => {
  const cameraVideosFromDb = api.cameraVideos.getAll.useQuery();
  const locationsFromDb = api.cameraLocations.getAll.useQuery();
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<number>();

  const [searchTermVideoFilter, setSearchTermVideoFilter] = useState('');
  const [startDateVideoFilter, setStartDateVideoFilter] = useState<Date>(new Date(1900, 0, 1));
  const [endDateVideoFilter, setEndDateVideoFilter] = useState<Date>(new Date());
  const [selectedLocationIdsVideoFilter, setSelectedLocationIdsVideoFilter] = useState<string[]>([]);

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  console.log(cameraVideosFromDb.data);


  useEffect(() => {
    const drawBoundingBoxes = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (canvas && video) {
        canvas.width = video.clientWidth;
        canvas.height = video.clientHeight;
        const ctx = canvas.getContext('2d');
        const scaleX = canvas.width / video.videoWidth;
        const scaleY = canvas.height / video.videoHeight;

        const frameRate = 15;
        const frameNumber = Math.floor(video.currentTime * frameRate); // Estimate frame number
        const detections = cameraVideosFromDb.data?.find(video => video.filename === videoSrc)?.vesselsDetected[frameNumber.toString()];

        if (ctx && detections) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          detections.forEach(detection => {
            const { x1, y1, x2, y2 } = detection.bbox;

            const scaledX1 = x1 * scaleX;
            const scaledY1 = y1 * scaleY;
            const scaledX2 = x2 * scaleX;
            const scaledY2 = y2 * scaleY;


            ctx.strokeStyle = 'red';
            ctx.strokeRect(scaledX1, scaledY1, scaledX2 - scaledX1, scaledY2 - scaledY1);
            ctx.font = '18px Arial';
            ctx.fillStyle = 'white';
            ctx.fillText(`${detection.type} - #${detection.vesselId}`, scaledX1, scaledY1 - 10);

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

  const headers: TableHeader[] = [
    { key: 'filename', label: 'Filename' },
    { key: 'startTime', label: 'Time' },
  ];

  const rows = cameraVideosFromDb.data?.filter(video =>
    Object.entries(video.vesselsDetected).length > 0 &&
    selectedLocationIdsVideoFilter.length === 0 || selectedLocationIdsVideoFilter.includes(video.locationId) &&
    video.filename.toLowerCase().includes(searchTermVideoFilter.toLowerCase()) &&
    new Date(video.startTime) >= startDateVideoFilter &&
    new Date(video.startTime) <= endDateVideoFilter
  ).map(video => ({
    filename: video.filename,
    startTime: new Date(video.startTime).toLocaleString(),
  })) as TableRow[];

  const handleRowClick = (row: TableRow) => {
    if (typeof row.filename === 'string') {
      setVideoSrc(row.filename);
      setSelectedRow(rows.indexOf(row));
    }
  };

  const handleLocationChangeVideoFilter = (locationId: string) => {
    const currentIndex = selectedLocationIdsVideoFilter.indexOf(locationId);
    const newSelectedLocationIds: string[] = [...selectedLocationIdsVideoFilter];

    if (currentIndex === -1) {
      newSelectedLocationIds.push(locationId);
    } else {
      newSelectedLocationIds.splice(currentIndex, 1);
    }

    setSelectedLocationIdsVideoFilter(newSelectedLocationIds);
  };

  const handleLocationChange = (locationId: string) => {
    const currentIndex = selectedLocationIdsVideoFilter.indexOf(locationId);
    const newSelectedLocationIds: string[] = [...selectedLocationIdsVideoFilter];

    if (currentIndex === -1) {
      newSelectedLocationIds.push(locationId);
    } else {
      newSelectedLocationIds.splice(currentIndex, 1);
    }

    setSelectedLocationIds(newSelectedLocationIds);
  };

  return (
    <>
      <Head>
        <title>LEISAir - Home</title>
        <meta name="LEISAir" content="A platform for vessel detection" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout sectionTitle="Home">
        <div className="flex h-full gap-4">
          <div className="w-3/5 flex flex-col items-start justify-start py-12">
            <h3 className="text-2xl font-semibold mb-4">Video Player</h3>
            {videoSrc ? (
              <div className='relative'>
                <video
                  ref={videoRef}
                  src={`/api/videos/${encodeURIComponent(videoSrc)}`}
                  controls
                  className="w-full h-auto"
                />
                <canvas ref={canvasRef} className="absolute top-0 left-0" style={{ pointerEvents: 'none' }} />
              </div>
            ) : (
              <p className="text-lg">Select a video from the list to play</p>

            )}
          </div>
          <div className='w-2/5'>
            <div className="h-1/2 flex flex-col justify-start py-12">
              <h3 className="text-2xl font-semibold mb-4">Videos</h3>
              <div className='flex gap-2 flex-col border-2 p-4 mb-2'>
                <h3 className="text-xl font-bold">Filters</h3>
                <div className='flex gap-6 justify-start items-center '>
                  <div>
                    <label className="font-bold">
                      Select Locations
                    </label>
                    {locationsFromDb.data?.map((location) => (
                      <label key={location._id.toString()} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedLocationIdsVideoFilter.includes(location._id.toString())}
                          onChange={() => handleLocationChangeVideoFilter(location._id.toString())}
                        />
                        {location.name}
                      </label>
                    ))}
                  </div>
                  <div className='flex flex-col'>
                    <span className="text-md py-2 text-gray-600 font-semibold">Search name</span>
                    <input
                      type="text"
                      placeholder="Search videos"
                      onChange={(e) => setSearchTermVideoFilter(e.target.value)}
                      className="mb-4 border border-gray-300 rounded-md px-4 py-2 w-[215px]"
                    />
                  </div>
                  <div className='flex flex-col'>
                    <span className="text-md py-2 text-gray-600 font-semibold">Date From</span>
                    <DatePicker
                      selected={startDateVideoFilter}
                      onChange={(date: Date) => setStartDateVideoFilter(date)}
                      className="mb-4 border border-gray-300 rounded-md px-4 py-2 w-full"
                    />
                  </div>
                  <div className='flex flex-col'>
                    <span className="text-md py-2 text-gray-600 font-semibold">Date To</span>
                    <DatePicker
                      selected={endDateVideoFilter}
                      onChange={(date: Date) => setEndDateVideoFilter(date)}
                      className="mb-4 border border-gray-300 rounded-md px-4 py-2 w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <TableComponent headers={headers} rows={rows} onRowClick={handleRowClick} selectedRow={selectedRow} />
              </div>
            </div>
            <div className='flex flex-col grow'>
                <h1 className="font-semibold text-2xl mb-4">Export Vessels</h1>
                <div className='flex gap-2 flex-col border-2 p-4'>
                  <h3 className="text-xl font-bold">Filters</h3>

                  <div className='flex gap-12 justify-start items-center '>
                    <div>
                      <label className="font-bold">
                        Select Locations
                      </label>

                      {locationsFromDb.data?.map((location) => (
                        <label key={location._id.toString()} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedLocationIds.includes(location._id.toString())}
                            onChange={() => handleLocationChange(location._id.toString())}
                          />
                          {location.name}
                        </label>
                      ))}
                    </div>

                    <div className='flex flex-col'>
                      <span className="text-md py-2 text-gray-600 font-semibold">Date From</span>
                      <DatePicker
                        selected={startDate}
                        onChange={(date: Date) => setStartDate(date)}
                        className="mb-4 border border-gray-300 rounded-md px-4 py-2 w-full"
                      />
                    </div>
                    <div className='flex flex-col'>
                      <span className="text-md py-2 text-gray-600 font-semibold">Date To</span>
                      <DatePicker
                        selected={endDate}
                        onChange={(date: Date) => setEndDate(date)}
                        className="mb-4 border border-gray-300 rounded-md px-4 py-2 w-full"
                      />
                    </div>
                  </div>
                </div>
                <ExportDataButton filters={{ locationIds: selectedLocationIdsVideoFilter, startDate, endDate }} />
              </div>

          </div>
        </div>
      </DashboardLayout>
    </>
  )
}

export default LocationView;