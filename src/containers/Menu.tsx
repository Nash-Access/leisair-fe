import React from 'react';

interface MenuProps {
    menuList: MenuListItem[];
}

const Menu = ({ menuList }: MenuProps) => {

    return (
        <nav className="flex items-center justify-between flex-wrap bg-blue-900 p-6">
            <img className='pr-4' src="/img/nash-logo-light.svg" width="100" alt="LOGO HERE" />
            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto gap-6 px-6">
                {menuList.map((item) => {
                    return (
                        <a href={item.href} className="block mt-4 lg:inline-block lg:mt-0 text-gray-200 font-bold text-3xl hover:text-white mr-4">
                            {item.name}
                        </a>
                    )
                })}

            </div>
        </nav>
    );
};

export default Menu;


export interface MenuListItem {
    href: string;
    name: string;
}


