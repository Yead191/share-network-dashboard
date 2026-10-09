import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { api } from '../../redux/api/baseApi';
import { useGetprofileQuery } from '../../redux/apiSlices/students/overview.slice';
import { getImageUrl } from '../../utils/getImageUrl';
import { LogOut, Sparkles, GraduationCap, ShieldCheck, Users } from 'lucide-react';
import { Avatar } from 'antd';

const HeaderDashboard = () => {
    const { data: userResponse } = useGetprofileQuery({});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const role = (localStorage.getItem('role') || '').toLowerCase();

    const userData = userResponse?.data?.data ?? userResponse?.data ?? userResponse;
    const displayName = `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || 'User';

    const roleLabel =
        role === 'super_admin' || role === 'admin'
            ? 'Admin'
            : role === 'teacher'
                ? 'Teacher'
                : role === 'coordinator' || role === 'mentor-coordinator'
                    ? 'Coordinator'
                    : role === 'student'
                        ? 'Student'
                        : role === 'mentor'
                            ? 'Mentor'
                            : 'Admin';

    const routeRole =
        role === 'super_admin' || role === 'admin'
            ? 'admin'
            : role === 'teacher'
                ? 'teacher'
                : role === 'coordinator' || role === 'mentor-coordinator'
                    ? 'mentor-coordinator'
                    : role === 'student'
                        ? 'student'
                        : role === 'mentor'
                            ? 'mentor'
                            : 'admin';

    const profilePath =
        role === 'student'
            ? '/student/profile'
            : role === 'mentor'
                ? '/mentor/setting'
                : role === 'coordinator' || role === 'mentor-coordinator'
                    ? '/mentor-coordinator/profile'
                    : `/${routeRole}/overview`;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        dispatch(api.util.resetApiState());
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const getRoleIcon = () => {
        if (role === 'student') return <GraduationCap className="w-3.5 h-3.5" />;
        if (role === 'mentor') return <Sparkles className="w-3.5 h-3.5" />;
        if (role === 'coordinator' || role === 'mentor-coordinator') return <ShieldCheck className="w-3.5 h-3.5" />;
        return <ShieldCheck className="w-3.5 h-3.5" />;
    };

    const userGroupName = userData?.userGroup?.[0]?.name;

    return (
        <header className="w-full bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 border-b border-emerald-900/30 text-white shadow-sm relative overflow-hidden">
            {/* Subtle Ambient Background Mesh */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 h-20 flex items-center justify-between relative z-10">
                {/* Brand Logo & Platform Title */}
                <div
                    onClick={() => navigate(`/${routeRole}/overview`)}
                    className="flex items-center gap-3.5 cursor-pointer group select-none"
                >
                    <div className="relative">
                        <img
                            src="/logo.png"
                            alt="Share Network Logo"
                            className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-200"
                        />
                    </div>

                    <div className="flex flex-col">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-emerald-100 transition-colors">
                                Share Network
                            </span>

                            {/* Role Badge */}
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-2xs">
                                {getRoleIcon()}
                                <span>{roleLabel}</span>
                            </span>

                            {/* User Group Badge */}
                            {userGroupName && (
                                <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/40 backdrop-blur-md text-emerald-100 border border-white/15">
                                    <Users className="w-3 h-3 text-emerald-300" />
                                    <span>{userGroupName}</span>
                                </span>
                            )}

                            {/* Company / Track Badge */}
                            {userData?.company && (
                                <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 text-emerald-50 border border-white/10">
                                    {userData.company}
                                </span>
                            )}
                        </div>

                        <span className="text-xs text-emerald-100/80 font-medium hidden sm:block">
                            Platform Management Dashboard
                        </span>
                    </div>
                </div>

                {/* Right Side: User Profile Snippet & Logout */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* User Snippet (Clickable to profile) */}
                    <div
                        onClick={() => navigate(profilePath)}
                        className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 hover:border-white/25 cursor-pointer transition-all duration-200 shadow-2xs group"
                        title="View Profile"
                    >
                        <div className="p-0.5 bg-white/30 rounded-xl ring-1 ring-white/40 shrink-0">
                            <Avatar
                                shape="square"
                                size={32}
                                src={getImageUrl(userData?.profile)}
                                className="rounded-lg object-cover bg-emerald-900/50"
                            />
                        </div>

                        <div className="hidden sm:flex flex-col text-left leading-tight pr-1">
                            <span className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-100 transition-colors truncate max-w-[130px]">
                                {displayName}
                            </span>
                            <span className="text-[11px] text-emerald-200/80 font-medium truncate max-w-[130px]">
                                {userData?.email || roleLabel}
                            </span>
                        </div>
                    </div>

                    {/* Log Out Button */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-white/10 hover:bg-rose-500/25 active:scale-95 text-white hover:text-rose-100 backdrop-blur-md border border-white/20 hover:border-rose-400/40 text-xs sm:text-sm font-semibold transition-all duration-200 shadow-2xs group"
                        title="Sign out of your account"
                    >
                        <LogOut className="w-4 h-4 text-emerald-200 group-hover:text-rose-200 group-hover:-translate-x-0.5 transition-transform" />
                        <span className="hidden sm:inline">Log Out</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default HeaderDashboard;
