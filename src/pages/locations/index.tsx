import Head from 'next/head';
import { useRouter } from 'next/router';
import TableComponent, {type TableHeader,type TableRow } from '~/components/Table';
import DashboardLayout from '~/containers/DashboardLayout';
import { api } from '~/utils/api';

const Locations = () => {
    const router = useRouter();
    const cameraLocationsFromDb = api.cameraLocations.getAll.useQuery();
    console.log(cameraLocationsFromDb.data);

    const cameraLocationTableHeaders: TableHeader[] = [
        { key: 'name', label: 'Name' },
        { key: 'latitude', label: 'Latitude' },
        { key: 'longitude', label: 'Longitude' },
    ];

    const cameraLocationTableRows: TableRow[] = cameraLocationsFromDb.data?.map((cameraLocation) => ({
        _id: cameraLocation._id,
        name: cameraLocation.name,
        latitude: cameraLocation.latitude.toFixed(6), // Example of formatting the data
        longitude: cameraLocation.longitude.toFixed(6),
    })) ?? [];

    const handleRowClick = (row: TableRow) => {
        // Assuming the _id is available in the row data
        void router.push(`/locations/${(row._id as string).toString()}`);
    };

    return (
        <>
            <Head>
                <title>LEISAir - Locations</title>
                <meta name="LEISAir" content="A platform for vessel detection" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <DashboardLayout sectionTitle="Locations">
    <div className="flex flex-col h-full">
        {/* Other content here */}
        <div className="flex-1 overflow-hidden"> {/* This div should flexibly fill space */}
            <TableComponent headers={cameraLocationTableHeaders} rows={cameraLocationTableRows} onRowClick={handleRowClick} />
        </div>
    </div>
</DashboardLayout>
        </>
    );
};

export default Locations;