import React from 'react';
import { theme } from 'antd';
import { Outlet } from 'react-router-dom';
import HeaderDashboard from './HeaderDashboard';
import Sidebar from './Sidebar';

const MainLayout: React.FC = () => {
    const {
        token: { borderRadiusLG },
    } = theme.useToken();

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-slate-50/80 antialiased">
            {/* Fixed Header & Navigation Wrapper */}
            <div className="shrink-0 z-50 sticky top-0 shadow-xs">
                <HeaderDashboard />
                <Sidebar />
            </div>

            {/* Scrollable Content Container */}
            <main className="flex-1 overflow-y-auto">
                <div
                    className="container mx-auto px-4 sm:px-6 py-6 w-full"
                    style={{
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
