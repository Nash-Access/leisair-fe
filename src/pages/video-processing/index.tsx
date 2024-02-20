// UploadVideoPage.js
import React, { useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '~/containers/DashboardLayout';
import FileUpload from '~/components/FileDrop/FileUpload';
import VideoProcessingStatus from '~/components/Tasks/VideoStatus';

const UploadVideoPage = () => {


    return (
        <>
            <Head>
                <title>Upload Video Files</title>
            </Head>
            <DashboardLayout sectionTitle="Video Processing">
                <div className='w-full h-full flex gap-8'>
                    <div className='w-1/2'>
                        <h1 className="font-semibold text-3xl py-6">Upload Video Files</h1>
                        <FileUpload/>
                    </div>
                    <div className='w-1/2'>
                        <h1 className="font-semibold text-3xl py-6">Video Processing Status</h1>
                        <VideoProcessingStatus />
                    </div>
                </div>
                
            </DashboardLayout>
        </>
    );
};

export default UploadVideoPage;
