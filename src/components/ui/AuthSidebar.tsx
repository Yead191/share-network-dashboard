import React from 'react';
import { HiOutlineShieldCheck } from 'react-icons/hi2';

interface AuthSidebarProps {
    backgroundImage: string;
}

const AuthSidebar: React.FC<AuthSidebarProps> = ({ backgroundImage }) => {
    return (
        <div
            className="relative h-screen bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-[#8012FF80]" />

            <div className="relative z-10 flex flex-col items-center justify-center h-full px-16 text-white text-center">
                <div className="mb-8 w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <HiOutlineShieldCheck className="text-white text-5xl" />
                </div>

                <div className=" space-y-3">
                    <h2 className="text-4xl font-bold">Share Network App</h2>
                    <p className="text-xl font-medium">Share Network Administration</p>
                    <p className="text-lg max-w-[400px] leading-relaxed mx-auto">
                        Secure access to manage users, content, and platform settings. Monitor analytics and oversee the
                        entire Share Network ecosystem
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthSidebar;
