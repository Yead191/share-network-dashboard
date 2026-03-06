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
        <div className=" flex flex-col h-screen ">
            <div className="bg-[#21C45D] h-20 w-full flex-center">
                <HeaderDashboard />
            </div>

            <div className=" flex-center bg-white shadow-2xl">
                <Sidebar />
            </div>

            <div className="overflow-y-scroll bg-[#F6F6F6] min-h-[83vh]">
                <div
                    className="container py-5  w-full"
                    style={{
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
