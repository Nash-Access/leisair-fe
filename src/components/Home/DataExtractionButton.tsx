import React from 'react';
import queryString from 'query-string'; 
import { CameraFilters } from '~/models/cameraVideo';

interface Props {
    filters: CameraFilters;
}

const ExportDataButton = ({ filters }: Props) => {
    const query = queryString.stringify({
        ...filters,
        startDate: filters.startDate.toISOString(),
        endDate: filters.endDate.toISOString(),
        locationIds: filters.locationIds.join(','),
        confidenceThreshold: filters.confidenceThreshold ?? 0.9,
    });
    const href = `/api/videos/export/csv?${query}`;

    return (
        <a
            href={href}
            className="h-10 flex justify-center gap-2 font-body m-2 p-2 bg-green-500 text-white hover:bg-green-700 font-bold shadow-md">
            <svg className="fill-white" height="22px" width="22px" role="img" viewBox="0 0 576 512">
                <path d="M568.1 303l-80-80c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94L494.1 296H216C202.8 296 192 306.8 192 320s10.75 24 24 24h278.1l-39.03 39.03C450.3 387.7 448 393.8 448 400s2.344 12.28 7.031 16.97c9.375 9.375 24.56 9.375 33.94 0l80-80C578.3 327.6 578.3 312.4 568.1 303zM360 384c-13.25 0-24 10.74-24 24V448c0 8.836-7.164 16-16 16H64.02c-8.836 0-16-7.164-16-16L48 64.13c0-8.836 7.164-16 16-16h160L224 128c0 17.67 14.33 32 32 32h79.1v72c0 13.25 10.74 24 23.1 24S384 245.3 384 232V138.6c0-16.98-6.742-33.26-18.75-45.26l-74.63-74.64C278.6 6.742 262.3 0 245.4 0H63.1C28.65 0-.002 28.66 0 64l.0065 384c.002 35.34 28.65 64 64 64H320c35.2 0 64-28.8 64-64v-40C384 394.7 373.3 384 360 384z"></path>
            </svg>
            Export Data
        </a>
    );
};

export default ExportDataButton;
