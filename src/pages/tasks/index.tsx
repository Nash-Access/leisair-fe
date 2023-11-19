import Head from 'next/head';
import { useState } from 'react';
import VideoStatus from '~/components/Tasks/VideoStatus';
import DashboardLayout from '~/containers/DashboardLayout';

const Tasks = () => {
    return (
        <>
            <Head>
                <title>LEISAir - Locations</title>
                <meta name="LEISAir" content="A platform for vessel detection" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <DashboardLayout sectionTitle="Tasks">
            <VideoStatus/>
            </DashboardLayout>
        </>
    );
};

export default Tasks;