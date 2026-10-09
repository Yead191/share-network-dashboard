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
        <div className="w-full bg-white border-b border-slate-200/80 shadow-2xs py-2.5">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-9 w-28 rounded-xl bg-slate-100 animate-pulse shrink-0" />
                    ))}
                </div>
            </div>
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
        const normalizedRole = role.toUpperCase();

        switch (normalizedRole) {
            case 'SUPER_ADMIN':
            case 'ADMIN':
                return adminSidebarItems;
            case 'TEACHER':
                return teacherSidebarItems;
            case 'COORDINATOR':
            case 'MENTOR-COORDINATOR':
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
        <nav className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs relative z-40 transition-colors">
            <div className="container mx-auto px-4 sm:px-6 py-2">
                <ul className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
                    {sidebarItems.map((item: TSidebarItem) => {
                        const active = isActive(item.path);

                        return (
                            <li key={item.key} className="shrink-0">
                                <Link
                                    to={`/${item.path}`}
                                    className={`group flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm tracking-tight transition-all duration-200 select-none whitespace-nowrap
                                        ${
                                            active
                                                ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/90 shadow-2xs'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-semibold border border-transparent'
                                        }`}
                                >
                                    <span
                                        className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                                            active ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-700'
                                        }`}
                                    >
                                        {item.icon}
                                    </span>
                                    <span>{item.label}</span>

                                    {active && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-xs ml-0.5 shrink-0" />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
};

export default Sidebar;
