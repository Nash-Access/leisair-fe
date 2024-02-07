// pages/api/export/csv.js
import type { NextApiRequest, NextApiResponse } from 'next';
import { CameraFilters } from '~/models/cameraVideo';
import { getAllCameraLocations } from '~/server/api/mongo/collections/cameraLocations';
import { getCameraVideos } from '~/server/api/mongo/collections/cameraVideo';
import { jsonToCSV } from '~/utils/csvHelpers';

interface Query {
    locationIds: string;
    startDate: string;
    endDate: string;
    confidenceThreshold: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { locationIds, startDate, endDate, confidenceThreshold } = req.query;
    
    if (!locationIds || 
        !startDate || 
        !endDate || 
        !confidenceThreshold || 
        typeof locationIds !== 'string' || 
        typeof startDate !== 'string' || 
        typeof endDate !== 'string' ||
        typeof confidenceThreshold !== 'string') {
        return res.status(400).json({ error: 'Invalid request' });
    }
    const locationIdsArray = locationIds.split(',');
    const confidenceThresholdNumber = parseFloat(confidenceThreshold || '0.4');

    const locations = await getAllCameraLocations()

    const locationMap = new Map(locations.map(location => [location._id.toString(), location.name]));

    const data = await getCameraVideos(
        locationIdsArray,
        new Date(startDate),
        new Date(endDate),
        confidenceThresholdNumber
    )

    const formattedData = data.map(video => {
        return {
            ...video,
            locationId: locationMap.get(video.locationId)
        }
    })


    const csv = jsonToCSV(formattedData);

    res.setHeader('Content-Type', 'text/csv');

    const startDateFormatted = new Date(startDate).toISOString().split('T')[0];
    const endDateFormatted = new Date(endDate).toISOString().split('T')[0];
    const locationNames = locations.map(location => location.name).join('_');
    const filename = `${locationNames}_${startDateFormatted}_${endDateFormatted}.csv`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csv);
}
