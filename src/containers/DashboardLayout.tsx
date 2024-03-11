import {type ReactNode } from "react";
import Menu, {type MenuListItem } from "~/containers/Menu";

interface DashboardLayoutProps {
    sectionTitle?: string;
    children: ReactNode;
}

const DashboardLayout = ({ children, sectionTitle }: DashboardLayoutProps) => {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <Menu menuList={menuList} />
            <div className="flex-1 overflow-hidden p-8">
                <h1 className="font-bold text-5xl py-6">{sectionTitle}</h1>
                {children}
            </div>
        </div>
    );
}

export default DashboardLayout;


const menuList: MenuListItem[] = [
    {
        href: '/',
        name: 'Home'
    },
    {
        href: '/video-processing',
        name: 'Video Processing'
    },
    {
        href: '/assurance',
        name: 'Assurance'
    },
    {
        href: '/settings',
        name: 'Settings'
    }
]