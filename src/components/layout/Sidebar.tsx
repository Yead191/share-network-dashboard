import { Link, useLocation } from 'react-router-dom';
import {
    adminSidebarItems,
    teacherSidebarItems,
    mentorCoordinatorSidebarItems,
    studentSidebarItems,
    mentorSidebarItems,
} from '../../utils/sidebarItems';
import { TSidebarItem } from '../../utils/generateSidebarItems';
import { useEffect, useMemo, useState } from 'react';

const NavbarSkeleton = () => {
    return (
        <div className="container py-2 px-1.5">
            <nav className="w-full bg-white rounded-xl">
                <ul className="flex flex-wrap items-center gap-2 p-2">
                    {[...Array(5)].map((_, i) => (
                        <li key={i}>
                            <div className="h-9 w-28 rounded-lg bg-gray-200 animate-pulse" />
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

const Sidebar = () => {
    const location = useLocation();

    const [role, setRole] = useState<string | null>(localStorage.getItem('role'));

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        setRole(storedRole);
    }, [location.pathname]);

    const sidebarItems = useMemo(() => {
        if (!role) return [];

        switch (role) {
            case 'SUPER_ADMIN':
                return adminSidebarItems;
            case 'TEACHER':
                return teacherSidebarItems;
            case 'COORDINATOR':
                return mentorCoordinatorSidebarItems;
            case 'STUDENT':
                return studentSidebarItems;
            case 'MENTOR':
                return mentorSidebarItems;
            default:
                return [];
        }
    }, [role]);

    if (!role) {
        return <NavbarSkeleton />;
    }

    const isActive = (path?: string) => {
        if (!path) return false;
        return location.pathname === `/${path}` || location.pathname.startsWith(`/${path}/`);
    };

    return (
        <div className="container py-2 px-1.5">
            <nav className="w-full bg-white rounded-xl">
                <ul className="flex flex-wrap items-center gap-2 custom-sidebar-menu px-1 2xl:py-2">
                    {sidebarItems.map((item: TSidebarItem) => {
                        const active = isActive(item.path);

                        return (
                            <li key={item.key}>
                                <Link
                                    to={`/${item.path}`}
                                    className={`flex items-center gap-1 px-2 md:px-2 py-2 transition-all duration-300 rounded-lg text-xs md:text-sm font-semibold
                                        ${active
                                            ? 'text-[#3BB77E] bg-[#3BB77E]/10 border border-[#3BB77E]'
                                            : 'text-[#7A7D85] hover:text-[#3BB77E] hover:bg-[#3BB77E]/10 border border-transparent'
                                        }`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
