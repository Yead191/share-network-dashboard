import React, { useState, useMemo, useEffect } from 'react';
import {
    Bell,
    CheckCheck,
    Trash2,
    Search,
    MessageSquare,
    Calendar,
    ClipboardList,
    Sparkles,
    ShieldAlert,
    ExternalLink,
    RefreshCw,
    CheckCircle2,
    Clock,
    Inbox,
    Layers,
    X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Popconfirm, Pagination, Spin, Tooltip } from 'antd';
import { toast } from 'sonner';
import {
    useGetNotificationsQuery,
    useReadSingleNotificationMutation,
    useReadAllNotificationsMutation,
    useDeleteNotificationMutation,
    useClearAllNotificationsMutation,
    INotificationItem,
} from '../../redux/apiSlices/notificationSlice';
import { useGetprofileQuery } from '../../redux/apiSlices/students/overview.slice';
import { getSocket } from '../../utils/socket';
import { getImageUrl } from '../../utils/getImageUrl';

export const NotificationPage: React.FC = () => {
    const navigate = useNavigate();
    const { data: userResponse } = useGetprofileQuery({});
    const userData = userResponse?.data?.data ?? userResponse?.data ?? userResponse;
    const currentUserId = userData?._id;
    const role = (localStorage.getItem('role') || '').toLowerCase();

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

    // Filters and state
    const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD' | 'MESSAGE' | 'ASSIGNMENT' | 'SCHEDULE' | 'SYSTEM'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;

    // API Query
    const queryParams: any = {
        page: currentPage,
        limit: pageSize,
    };
    if (activeTab === 'UNREAD') queryParams.seen = false;
    else if (activeTab !== 'ALL') queryParams.type = activeTab;
    if (searchQuery.trim()) queryParams.searchTerm = searchQuery.trim();

    const {
        data: responseData,
        isLoading,
        isFetching,
        refetch,
    } = useGetNotificationsQuery(queryParams);

    const [readSingleNotification] = useReadSingleNotificationMutation();
    const [readAllNotifications, { isLoading: isMarkingAll }] = useReadAllNotificationsMutation();
    const [deleteNotification] = useDeleteNotificationMutation();
    const [clearAllNotifications, { isLoading: isClearingAll }] = useClearAllNotificationsMutation();

    const notifications: INotificationItem[] = responseData?.data?.data || [];
    const unreadCount = responseData?.data?.unreadCount || 0;
    const totalItems = responseData?.pagination?.total || notifications.length;

    // Socket listener for live notifications
    useEffect(() => {
        if (!currentUserId) return;
        const socket = getSocket(currentUserId);

        const handleLiveNotification = () => {
            refetch();
        };

        socket.on(`getNotification::${currentUserId}`, handleLiveNotification);
        return () => {
            socket.off(`getNotification::${currentUserId}`, handleLiveNotification);
        };
    }, [currentUserId, refetch]);

    // Action handlers
    const handleMarkAllRead = async () => {
        try {
            await readAllNotifications().unwrap();
            toast.success('All notifications marked as read');
        } catch {
            toast.error('Failed to mark all notifications as read');
        }
    };

    const handleClearAll = async () => {
        try {
            await clearAllNotifications().unwrap();
            toast.success('All notifications cleared successfully');
        } catch {
            toast.error('Failed to clear notifications');
        }
    };

    const handleToggleRead = async (item: INotificationItem, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await readSingleNotification(item._id).unwrap();
            toast.success('Notification updated');
        } catch {
            toast.error('Failed to update notification');
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await deleteNotification(id).unwrap();
            toast.success('Notification removed');
        } catch {
            toast.error('Failed to delete notification');
        }
    };

    const handleItemClick = async (item: INotificationItem) => {
        if (!item.seen && !item.read) {
            try {
                await readSingleNotification(item._id).unwrap();
            } catch (err) {
                console.warn(err);
            }
        }

        if (item.type === 'MESSAGE' || item.path === '/chat' || item.path?.includes('chat')) {
            navigate(`/${routeRole}/chat`);
            return;
        }

        if (item.path && item.path !== '/' && !item.path.startsWith('http')) {
            navigate(item.path);
            return;
        }

        if (item.type === 'ASSIGNMENT') {
            if (role === 'student') navigate('/student/assignment');
            else if (role === 'mentor') navigate('/mentor/students');
            else navigate(`/${routeRole}/overview`);
            return;
        }

        if (item.type === 'SCHEDULE' || item.type === 'CLASS') {
            if (role === 'student') navigate('/student/schedule');
            else if (role === 'admin') navigate('/admin/schdule');
            else navigate(`/${routeRole}/overview`);
            return;
        }
    };

    const getTypeMeta = (type?: string) => {
        switch (type?.toUpperCase()) {
            case 'MESSAGE':
                return {
                    icon: <MessageSquare className="w-5 h-5 text-emerald-600" />,
                    bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
                    label: 'Chat Message',
                };
            case 'ASSIGNMENT':
                return {
                    icon: <ClipboardList className="w-5 h-5 text-amber-600" />,
                    bg: 'bg-amber-50 border-amber-200 text-amber-700',
                    label: 'Assignment',
                };
            case 'CLASS':
            case 'EVENT':
            case 'SCHEDULE':
                return {
                    icon: <Calendar className="w-5 h-5 text-sky-600" />,
                    bg: 'bg-sky-50 border-sky-200 text-sky-700',
                    label: 'Schedule / Class',
                };
            case 'ADMIN':
            case 'ALERT':
                return {
                    icon: <ShieldAlert className="w-5 h-5 text-purple-600" />,
                    bg: 'bg-purple-50 border-purple-200 text-purple-700',
                    label: 'System Alert',
                };
            default:
                return {
                    icon: <Sparkles className="w-5 h-5 text-emerald-600" />,
                    bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
                    label: 'Notification',
                };
        }
    };

    const formatFullTime = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleString([], {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatRelativeTime = (dateStr: string) => {
        if (!dateStr) return '';
        const now = new Date();
        const date = new Date(dateStr);
        const diffSecs = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffSecs < 60) return 'Just now';
        const diffMins = Math.floor(diffSecs / 60);
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    // Filter counts summary
    const stats = useMemo(() => {
        const total = totalItems;
        const unread = unreadCount;
        const messages = notifications.filter((n) => n.type === 'MESSAGE').length;
        const schedules = notifications.filter((n) => ['CLASS', 'EVENT', 'SCHEDULE'].includes(n.type || '')).length;
        return { total, unread, messages, schedules };
    }, [totalItems, unreadCount, notifications]);

    return (
        <div className="space-y-6 pb-12 max-w-7xl mx-auto">
            {/* Top Hero Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-800 text-white p-6 sm:p-8 shadow-xl border border-emerald-700/40">
                {/* Background ambient accents */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 backdrop-blur-md border border-white/20 text-emerald-100">
                            <Bell className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Notification Center</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                            Activity & Alerts
                        </h1>
                        <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
                            Stay up-to-date with your latest class schedules, new chat messages, assignments, and real-time announcements.
                        </p>
                    </div>

                    {/* Quick Stats Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
                        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 text-center shadow-xs">
                            <span className="block text-2xl font-black text-white">{stats.total}</span>
                            <span className="text-xs font-semibold text-emerald-200">Total</span>
                        </div>
                        <div className="bg-white/15 backdrop-blur-md border border-emerald-400/30 rounded-2xl p-3.5 text-center shadow-xs">
                            <span className="block text-2xl font-black text-emerald-200">{stats.unread}</span>
                            <span className="text-xs font-semibold text-white">Unread</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 text-center shadow-xs">
                            <span className="block text-2xl font-black text-white">{stats.messages}</span>
                            <span className="text-xs font-semibold text-emerald-200">Messages</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 text-center shadow-xs">
                            <span className="block text-2xl font-black text-white">{stats.schedules}</span>
                            <span className="text-xs font-semibold text-emerald-200">Classes</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Bar: Filter Tabs, Search & Action Buttons */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2">
                    {[
                        { id: 'ALL', label: 'All', icon: Layers, count: totalItems },
                        { id: 'UNREAD', label: 'Unread', icon: Bell, count: unreadCount },
                        { id: 'MESSAGE', label: 'Messages', icon: MessageSquare },
                        { id: 'SCHEDULE', label: 'Classes & Events', icon: Calendar },
                        { id: 'ASSIGNMENT', label: 'Assignments', icon: ClipboardList },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id as any);
                                    setCurrentPage(1);
                                }}
                                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                    isActive
                                        ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/20'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200/60'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                                {tab.count !== undefined && tab.count > 0 && (
                                    <span
                                        className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold ${
                                            isActive
                                                ? 'bg-white/20 text-white'
                                                : 'bg-emerald-100 text-emerald-700'
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Right Search & Actions */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1 sm:w-64">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search notifications..."
                            className="w-full pl-9 pr-8 py-2 rounded-xl text-xs sm:text-sm bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Refresh */}
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="p-2.5 rounded-xl border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
                        title="Refresh notifications"
                    >
                        <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-emerald-600' : ''}`} />
                    </button>

                    {/* Mark All Read */}
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            disabled={isMarkingAll}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 font-semibold text-xs sm:text-sm transition-all duration-200 shadow-2xs cursor-pointer"
                        >
                            <CheckCheck className="w-4 h-4 text-emerald-600" />
                            <span>Mark all as read</span>
                        </button>
                    )}

                    {/* Clear All */}
                    {notifications.length > 0 && (
                        <Popconfirm
                            title="Clear all notifications?"
                            description="This will permanently delete all your notifications. This action cannot be undone."
                            onConfirm={handleClearAll}
                            okText="Yes, clear all"
                            cancelText="Cancel"
                            okButtonProps={{ danger: true }}
                        >
                            <button
                                disabled={isClearingAll}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs sm:text-sm transition-all duration-200 shadow-2xs cursor-pointer"
                            >
                                <Trash2 className="w-4 h-4 text-rose-600" />
                                <span>Clear all</span>
                            </button>
                        </Popconfirm>
                    )}
                </div>
            </div>

            {/* Main Notifications Feed */}
            <div className="space-y-3">
                {isLoading ? (
                    <div className="bg-white rounded-3xl border border-gray-100 p-16 flex flex-col items-center justify-center gap-3 text-gray-400 shadow-sm">
                        <Spin size="large" />
                        <p className="text-sm font-medium text-gray-500">Loading your notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
                        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50/50">
                            <Inbox className="w-8 h-8 stroke-[1.5]" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                            {activeTab === 'UNREAD' ? 'No unread notifications' : 'No notifications found'}
                        </h3>
                        <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
                            {searchQuery
                                ? `No notifications matching "${searchQuery}". Try searching for something else.`
                                : activeTab === 'UNREAD'
                                    ? "You have reviewed all your alerts! You're completely up to date."
                                    : "You don't have any notifications right now. Activity and class alerts will appear here."}
                        </p>
                        {(searchQuery || activeTab !== 'ALL') && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setActiveTab('ALL');
                                }}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors cursor-pointer shadow-sm"
                            >
                                Reset filters
                            </button>
                        )}
                    </div>
                ) : (
                    notifications.map((item) => {
                        const isUnread = !item.seen && !item.read;
                        const meta = getTypeMeta(item.type);
                        const sender = item.sender;
                        const senderName = sender?.name || 'Share Network';
                        const avatarUrl = sender?.image ? getImageUrl(sender.image) : '';

                        return (
                            <div
                                key={item._id}
                                onClick={() => handleItemClick(item)}
                                className={`group rounded-2xl border transition-all duration-200 cursor-pointer p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs relative overflow-hidden ${
                                    isUnread
                                        ? 'bg-emerald-50/40 hover:bg-emerald-50/80 border-emerald-200/80 shadow-emerald-500/5'
                                        : 'bg-white hover:bg-gray-50/90 border-gray-100'
                                }`}
                            >
                                {/* Left indicator bar for unread */}
                                {isUnread && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500" />
                                )}

                                {/* Left Content: Avatar / Type Icon & Text */}
                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                    {/* Icon / Avatar */}
                                    <div className="relative shrink-0 mt-0.5">
                                        {avatarUrl ? (
                                            <img
                                                src={avatarUrl}
                                                alt={senderName}
                                                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-xs"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center font-bold text-sm shadow-xs ring-1 ring-emerald-600/10">
                                                {meta.icon}
                                            </div>
                                        )}

                                        {isUnread && (
                                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-1 flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-emerald-700 transition-colors">
                                                {item.title}
                                            </span>

                                            {/* Type Badge */}
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${meta.bg}`}
                                            >
                                                {meta.label}
                                            </span>

                                            {/* Relative time */}
                                            <span className="text-xs text-gray-400 font-medium flex items-center gap-1 sm:ml-auto">
                                                <Clock className="w-3.5 h-3.5 text-gray-300" />
                                                <span>{formatRelativeTime(item.createdAt)}</span>
                                            </span>
                                        </div>

                                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                                            {item.message || item.text || 'No additional message details.'}
                                        </p>

                                        <div className="flex items-center gap-3 pt-1 text-[11px] text-gray-400 font-medium">
                                            {sender && <span>From: <strong className="text-gray-700">{senderName}</strong></span>}
                                            <span>•</span>
                                            <span>{formatFullTime(item.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Actions */}
                                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleItemClick(item);
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
                                    >
                                        <span>Open</span>
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </button>

                                    <Tooltip title={isUnread ? 'Mark as read' : 'Marked as read'}>
                                        <button
                                            type="button"
                                            onClick={(e) => handleToggleRead(item, e)}
                                            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                                                isUnread
                                                    ? 'bg-white hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 border-gray-200'
                                                    : 'bg-emerald-50 text-emerald-600 border-emerald-200/60'
                                            }`}
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                        </button>
                                    </Tooltip>

                                    <Tooltip title="Delete">
                                        <button
                                            type="button"
                                            onClick={(e) => handleDelete(item._id, e)}
                                            className="p-2 rounded-xl bg-white hover:bg-rose-50 text-gray-400 hover:text-rose-600 border border-gray-200 hover:border-rose-200 transition-colors cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </Tooltip>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination */}
            {totalItems > pageSize && (
                <div className="flex justify-center pt-4">
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={totalItems}
                        onChange={(page) => setCurrentPage(page)}
                        showSizeChanger={false}
                    />
                </div>
            )}
        </div>
    );
};

export default NotificationPage;
