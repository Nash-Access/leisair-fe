import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import DashboardLayout from '~/containers/DashboardLayout';
import { api } from '~/utils/api';


interface LocationViewProps {
    id: string;
}

const LocationView: NextPage<LocationViewProps> = ({id}) => {
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const cameraLocationFromDb = api.cameraLocations.getOne.useQuery(id);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const objectURL = URL.createObjectURL(file);
            setVideoSrc(objectURL);
        }
    };
    return (
        <>
                    <Head>
                <title>LEISAir - Locations</title>
                <meta name="LEISAir" content="A platform for vessel detection" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <DashboardLayout 
                sectionTitle="Location View"
            >
                <div className="flex h-full">
                    <div className="w-2/5 flex flex-col items-center justify-start">
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleFileChange}
                            className="mb-4"
                        />
                        {videoSrc && (
                            <video
                                src={videoSrc}
                                controls
                                className="w-full h-auto"
                            />
                        )}
                    </div>
                    <div className="w-3/5 flex flex-col items-center justify-center">

                    </div>
                </div>
            </DashboardLayout>
        </>
    );
};

export default LocationView;