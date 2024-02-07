// UploadVideoPage.js
import React, { useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '~/containers/DashboardLayout';
import FileUpload from '~/components/FileDrop/FileUpload';

const UploadVideoPage = () => {


    return (
        <>
            <Head>
                <title>Upload Video Files</title>
            </Head>
            <DashboardLayout sectionTitle="Upload Videos">
                <FileUpload/>
            </DashboardLayout>
        </>
    );
};

export default UploadVideoPage;
