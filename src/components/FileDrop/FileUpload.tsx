import axios from 'axios';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';


interface FileWithProgress {
    file: File;
    progress: number; // Progress as a percentage
}

const FileUpload = () => {
    const [files, setFiles] = useState<FileWithProgress[]>([])
    const isUploading = files.some(file => file.progress < 100);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const filesWithProgress = acceptedFiles.map(file => ({
            file,
            progress: 0,
        }));
        setFiles(prevFiles => [...prevFiles, ...filesWithProgress]);
    }, []);


    const uploadFile = async (fileWithProgress: FileWithProgress, index:number) => {
        const formData = new FormData();
        formData.append('file', fileWithProgress.file);
    
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 100));
                    // Update the progress for the current file
                    setFiles(prevFiles => prevFiles.map((fp, idx) => idx === index ? { ...fp, progress } : fp));
                },
            });
    
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    const uploadFiles = () => {
         files.forEach((fileWithProgress, index) => void uploadFile(fileWithProgress, index))
    }

    const removeFile = (index: number) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'video/mp4': ['.mp4', '.MP4'] },
    });

    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };
    return (
        <>
            <div className="flex justify-end items-end">
                <button onClick={uploadFiles} className={`block my-4 py-2 px-4 bg-blue-500 text-white font-bold rounded ${files.length === 0 ? 'bg-gray-400 cursor-not-allowed' : ''}`} disabled={files.length === 0}>Upload Files</button>
            </div>
            <div {...getRootProps()} className={`border-2 border-dashed p-4 cursor-pointer text-center mb-4 transition-all duration-300 hover:border-blue-500 hover:animate-pulse ${isDragActive ? 'border-blue-500 animate-pulse' : 'border-gray-300'}`}>
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center">
                    {isDragActive ? (
                        <p className="text-blue-500">Drop the files here ...</p>
                    ) : (
                        <>
                            <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10V3H2v7m12 0v11H2V10m12 0a5 5 0 005-5V5a5 5 0 00-5 5zm-5 5v6m-4 0h8"></path></svg>
                            <p className="mb-2">Drag and drop video files here, or click to select files</p>
                            <p className="text-xs text-gray-500">Only MP4 files supported</p>
                        </>
                    )}
                </div>
            </div>
            <div>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="p-4 border-b-2 border-gray-300"></th>
                            <th className="p-4 border-b-2 border-gray-300">File name</th>
                            <th className="p-4 border-b-2 border-gray-300">Size</th>
                            <th className="p-4 border-b-2 border-gray-300">Progress</th>
                            <th className="p-4 border-b-2 border-gray-300">Remove file</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((fileWithProgress, index) => (
                            <tr key={fileWithProgress.file.name + index}>
                                <td className="p-4 border-b">
                                    <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="24" height="24">
                                        <path d="M320 464c8.8 0 16-7.2 16-16V160H256c-17.7 0-32-14.3-32-32V48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320zM0 64C0 28.7 28.7 0 64 0H229.5c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zM80 288c0-17.7 14.3-32 32-32h96c17.7 0 32 14.3 32 32v16l44.9-29.9c2-1.3 4.4-2.1 6.8-2.1c6.8 0 12.3 5.5 12.3 12.3V387.7c0 6.8-5.5 12.3-12.3 12.3c-2.4 0-4.8-.7-6.8-2.1L240 368v16c0 17.7-14.3 32-32 32H112c-17.7 0-32-14.3-32-32V288z" />
                                    </svg>
                                </td>
                                <td className="p-4 border-b">{fileWithProgress.file.name}</td>
                                <td className="p-4 border-b">{formatBytes(fileWithProgress.file.size)}</td>
                                <td className="p-4 border-b">
                                    <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                                        <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${fileWithProgress.progress}%` }}> {fileWithProgress.progress}% </div>
                                    </div>
                                </td>
                                <td className="p-4 border-b">
                                    <button onClick={() => removeFile(index)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 ml-5 rounded-full">
                                        X
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default FileUpload;