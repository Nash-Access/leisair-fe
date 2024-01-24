import Head from 'next/head';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import DashboardLayout from '~/containers/DashboardLayout';
import { api } from '~/utils/api';
import TableComponent, { TableHeader } from '~/components/Table';
import { LowConfidenceFramesProjection, VesselType, vesselTypes } from '~/models/cameraVideo';
import { VesselCorrection } from '~/models/vesselCorrections';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import useDebouncedCallback from '~/utils/hooks';

interface AssuranceTableRow {
    location: string;
    filename: string;
    frame: number;
    startTime: string;
    confidence: number;
    type: string;
};


const Assurance = () => {
    const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.5);
    const [confidenceThresholdForDb, setConfidenceThresholdForDb] = useState<number>(0.5)
    const cameraFramesFromDb = api.cameraVideos.getAllLowConfidenceDetections.useQuery(confidenceThresholdForDb);
    const cameraLocationsFromDb = api.cameraLocations.getAll.useQuery();
    const vesselCorrectionsFromDb = api.vesselCorrections.getAllWithoutImages.useQuery();
    const insertVesselCorrection = api.vesselCorrections.insertOne.useMutation();
    const [selectedDetection, setSelectedDetection] = useState<LowConfidenceFramesProjection>();
    const [selectedRow, setSelectedRow] = useState<number>();
    const [correctedClassification, setCorrectedClassification] = useState<VesselType>("Not Vessel");
    const [rows, setRows] = useState<LowConfidenceFramesProjection[]>([]);
    const [imageSrc, setImageSrc] = useState('');
    const [disableButtons, setDisableButtons] = useState<boolean>(true);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    
    const debouncedSetConfidenceThreshold = useDebouncedCallback((newThreshold: number) => {
        setConfidenceThresholdForDb(newThreshold);
    }, 1000)


    useEffect(() => {
        const canvas = canvasRef.current;
        const image = imageRef.current;

        if (canvas && image && selectedDetection?.bbox) {
            canvas.width = image.clientWidth;
            canvas.height = image.clientHeight;
            const ctx = canvas.getContext('2d');
            const scaleX = canvas.width / image.naturalWidth;
            const scaleY = canvas.height / image.naturalHeight;

            if (ctx && selectedDetection) {
                const { bbox } = selectedDetection;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const { x1, y1, x2, y2 } = bbox;

                const scaledX1 = x1 * scaleX;
                const scaledY1 = y1 * scaleY;
                const scaledX2 = x2 * scaleX;
                const scaledY2 = y2 * scaleY;


                ctx.strokeStyle = 'red';
                ctx.strokeRect(scaledX1, scaledY1, scaledX2 - scaledX1, scaledY2 - scaledY1);
                ctx.font = '18px Arial';
                ctx.fillStyle = 'white';
                ctx.fillText(selectedDetection.type, scaledX1, scaledY1 - 10);
            }
        }
    }, [selectedDetection, imageSrc]);

    useEffect(() => {
        if (!cameraFramesFromDb.data || !vesselCorrectionsFromDb.data) return;
        const filteredRows = cameraFramesFromDb.data?.filter(
            frame => !vesselCorrectionsFromDb.data?.find(correction => correction.frame === frame.frame && correction.filename === frame.filename)
        )
        setRows(filteredRows)
    }, [vesselCorrectionsFromDb.data, cameraFramesFromDb.data]);

    useEffect(() => {
        console.log("ROWS HAVE CHANGED", selectedRow);
        if (selectedRow !== undefined && rows.length > 0) {
            void handleRowClick(rows[selectedRow]?.frame ?? 0,rows[selectedRow]?.filename ?? "",selectedRow)
        }
    }, [rows]);

    const headers: TableHeader[] = [
        { key: 'location', label: 'Location' },
        { key: 'filename', label: 'Filename' },
        { key: 'frame', label: 'Frame' },
        { key: 'startTime', label: 'Time' },
        { key: 'confidence', label: 'Confidence' },
        { key: 'type', label: 'Vessel Type' },
    ];


    const handleRowClick = async (rowFrame: number, rowFilename:string, index: number) => {
        console.log("row from click: ");
        // console.log("row from function: ", rows);
        setSelectedDetection(rows[index]);
        setSelectedRow(index);
        const response = await fetch(`/api/videos/frames/${rowFrame}?filename=${rowFilename}`);
        const data = await response.text();
        setImageSrc(data);
        setDisableButtons(false);
    };

    const handleAddCorrection = async (correctedClass: string) => {
        setDisableButtons(true);
        if (!selectedDetection || !imageSrc) { toast.error("Error: no selected detection. Please try again"); return; }
        const newCorrection: VesselCorrection = {
            ...selectedDetection,
            image: imageSrc,
            type: correctedClass as VesselType,
        }
        toast.success("Correction added successfully");
        await insertVesselCorrection.mutateAsync(newCorrection);
        void vesselCorrectionsFromDb.refetch();
    }

    const handleConfidenceThresholdChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newThreshold = e.target.valueAsNumber / 100;
        setConfidenceThreshold(newThreshold);
        debouncedSetConfidenceThreshold(newThreshold);
    }

    return (
        <>
            <Head>
                <title>LEISAir - Assurance</title>
                <meta name="LEISAir" content="A platform for vessel detection" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <DashboardLayout sectionTitle="Assurance">
                <div className="flex h-full gap-4">
                    <div className="w-3/5 flex flex-col gap-2 items-start justify-start py-6">
                        <h3 className="text-2xl font-bold mb-4">Frame Preview</h3>
                        <div className='relative'>
                            {imageSrc ?
                                <img ref={imageRef} src={imageSrc} alt='Frame' className="w-full h-auto" />
                                : <div className="w-full h-auto bg-gray-100 flex items-center justify-center text-3xl">No frame selected</div>}
                            <canvas ref={canvasRef} className="absolute top-0 left-0" style={{ pointerEvents: 'none' }} />
                        </div>
                        {selectedDetection && imageSrc &&
                            <div className="flex flex-col gap-4 p-2 border-2 border-gray-500 w-full" style={{ maxWidth: imageRef.current?.naturalWidth }}>
                                <h3 className="text-2xl font-bold">Detection Details for frame {selectedDetection.frame} of video {selectedDetection.filename} </h3>
                                <div className="flex gap-8 p-2 w-full justify-between">

                                    <div className='flex flex-col gap-2'>
                                        <label className="text-lg font-bold">LeisAir Prediction: <span className='font-normal'>{selectedDetection?.type}</span> </label>
                                        <label className="text-lg font-bold">Confidence: <span className='font-normal'>{selectedDetection?.confidence.toFixed(2)}</span></label>
                                    </div>
                                    <div>
                                        <label className="text-lg font-bold">Amend or Accept Classification</label>
                                        <select value={correctedClassification} onChange={(e) => setCorrectedClassification(e.target.value as VesselType)} className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                            {vesselTypes.map((type, index) => (
                                                <option key={index} value={type}>{type}</option>
                                            ))}
                                        </select>
                                        <div className='flex gap-2 '>
                                            <button disabled={disableButtons} onClick={() => { void handleAddCorrection(correctedClassification) }} className={clsx("w-1/2 text-white font-bold py-2 px-4 rounded mt-4", disableButtons ? "bg-gray-500" : "bg-orange-500 hover:bg-orange-700")}>
                                                Amend Classification
                                            </button>
                                            <button disabled={disableButtons} onClick={() => { void handleAddCorrection(selectedDetection.type) }} className={clsx("w-1/2 text-white font-bold py-2 px-4 rounded mt-4", disableButtons ? "bg-gray-500" : "bg-green-500 hover:bg-green-700")}>
                                                Accept Leisair Classification
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>}
                    </div>
                    <div className='w-2/5 flex flex-col justify-start mt-6  h-full'>
                        <div className='mb-10'>
                            <label htmlFor="confidence">Set Confidence Threshold: {confidenceThreshold}</label>
                            <input value={confidenceThreshold * 100} onChange={handleConfidenceThresholdChange} className='w-full' type="range" id="confidence" name="confidence" min="0" max="100" />
                        </div>
                        <div className='relative grow'>
                            <div className="absolute inset-0">
                                <h3 className="text-2xl font-bold">Low Confidence Frames ({rows.length} left)</h3>
                                <div className="py-12 absolute inset-0">
                                    <div className="w-full h-full flex flex-col gap-4">
                                        <div className="flex-1 overflow-hidden pb-12">
                                            <TableComponent
                                                headers={headers}
                                                rows={rows.map(video => ({
                                                    location: cameraLocationsFromDb.data?.find(location => location._id.toString() === video.locationId)?.name,
                                                    filename: video.filename,
                                                    frame: video.frame,
                                                    startTime: new Date(video.startTime).toLocaleString(),
                                                    confidence: Number(video.confidence.toFixed(2)),
                                                    type: video.type,
                                                })) as AssuranceTableRow[]} onRowClick={(row, index) => {
                                                    const rowFrame = row.frame ?? 0;
                                                    const rowFilename = row.filename ?? "";
                                                    void handleRowClick(rowFrame, rowFilename, index)}} selectedRow={selectedRow} />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    )
};

export default Assurance;