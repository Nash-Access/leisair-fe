import { ReactNode } from "react";
import Menu, { MenuListItem } from "~/containers/Menu";

interface DashboardLayoutProps {
    sectionTitle?: string;
    children: ReactNode;
}

const DashboardLayout = ({ children, sectionTitle }: DashboardLayoutProps) => {
    return (
        <div className="h-screen w-screen">
            <Menu menuList={menuList} />
            <div className="h-full w-full p-8">
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
        href: '/locations',
        name: 'Locations'
    },
    {
        href: '/tasks',
        name:'Tasks'
    },
    {
        href: '/assurance',
        name: 'Assurance'
    }
]