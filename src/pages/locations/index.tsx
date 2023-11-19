import Head from 'next/head';
import { useState } from 'react';
import TableComponent, { TableRow } from '~/components/Table';
import DashboardLayout from '~/containers/DashboardLayout';
import { api } from '~/utils/api';

const Locations = () => {
    const cameraLocationsFromDb = api.cameraLocations.getAll.useQuery();
    const cameraLocationTableHeaders = ['name', 'latitude', 'longitude']
    const cameraLocationTableRows = cameraLocationsFromDb.data?.map((cameraLocation) => {
        return {
            name: cameraLocation.name,
            latitude: cameraLocation.latitude,
            longitude: cameraLocation.longitude
        }
    });

    return (
        <>
            <Head>
                <title>LEISAir - Locations</title>
                <meta name="LEISAir" content="A platform for vessel detection" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <DashboardLayout sectionTitle="Locations">
                <TableComponent headers={cameraLocationTableHeaders} rows={cameraLocationTableRows as TableRow[]}/>
            </DashboardLayout>
        </>
    );
};

export default Locations;