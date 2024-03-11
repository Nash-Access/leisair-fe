import Image from 'next/image';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { ServiceUpdateInfo, UpdateInfoResponse } from '~/models/appUpdate';
import { api } from '~/utils/api';

interface MenuProps {
    menuList: MenuListItem[];
}


const Menu = ({ menuList }: MenuProps) => {
    const [updateInfo, setUpdateInfo] = useState<UpdateInfoResponse | undefined>();
    const checkForUpdate = api.appUpdate.checkForUpdate.useMutation()
    const updateApplication = api.appUpdate.update.useMutation()
    const clearVideos = api.cameraVideos.deleteAll.useMutation()


    const handleCheckForUpdates = async () => {
        const res = await checkForUpdate.mutateAsync()
        if (res) {
            setUpdateInfo(res);
        }
    };

    const handleClearVideos = async () => {
        await clearVideos.mutateAsync()
    }

    const handleInitiateUpdate = async () => {
        if (updateInfo) {
            // Explicitly typing servicesToUpdate to specify that it is an object
            // with string keys and string values
            const servicesToUpdate: Record<string, string> = {};
            for (const [service, info] of Object.entries(updateInfo)) {
                if (((info as ServiceUpdateInfo).update_available)) {
                    servicesToUpdate[service] = (info as ServiceUpdateInfo).latest_version;
                }
            }

            await updateApplication.mutateAsync({ services: servicesToUpdate }, {
                onSuccess: () => {
                    toast.success('Update initiated!');
                },
            });
        }
    };

    return (
        <nav className="flex items-center justify-between flex-wrap bg-blue-900 p-6 text-white">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <Image className='pr-4 my-4' src="/img/nash-logo-light.svg" width="90" height="50" alt="LOGO HERE" priority />
                <svg className='fill-white' width={16} viewBox="0 0 384 512">
                    <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/>
                </svg>
                <Image className='pr-4' src="/img/brunel-logo.png" width="200" height="100" alt="LOGO HERE" priority />
                <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto gap-6 px-6">
                    {menuList.map((item) => (
                        <a key={item.name} href={item.href} className="block mt-4 lg:inline-block lg:mt-0 text-gray-200 font-bold text-3xl hover:text-white mr-4">
                            {item.name}
                        </a>
                    ))}
                </div>
            </div>
            <div className="lg:flex lg:items-center lg:w-auto gap-6">

                {updateInfo && (
                    <div className="ml-4 text-right">
                        {Object.entries(updateInfo).map(([service, info]) => (
                            <div key={service} className="update-info">
                                <span>{service} - Current: {(info as ServiceUpdateInfo).current_version}, Latest: {(info as ServiceUpdateInfo).latest_version}</span>
                            </div>
                        ))}
                        <button onClick={() => {void handleInitiateUpdate()}} className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-blue-900 hover:bg-white mt-4 lg:mt-0">
                            Initiate Update
                        </button>
                    </div>
                )}
                <button onClick={() => {void handleCheckForUpdates()}} className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-blue-900 hover:bg-white mt-4 lg:mt-0">
                    Check for Updates
                </button>

                <button onClick={() => {void handleClearVideos()}} className="inline-block px-5 py-3 leading-none rounded bg-red-500 text-white font-bold border-white hover:border-transparent hover:text-blue-900 hover:bg-white mt-4 lg:mt-0">
                    Clear Videos
                </button>
            </div>
        </nav>
    );
};

export default Menu;

export interface MenuListItem {
    href: string;
    name: string;
}

