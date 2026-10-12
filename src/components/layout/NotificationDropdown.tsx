import React, { useState, useEffect, useRef } from 'react';
import { Popover, Spin } from 'antd';
import {
    Bell,
    CheckCheck,
    MessageSquare,
    Calendar,
    ClipboardList,
    Sparkles,
    ExternalLink,
    ArrowRight,
    Inbox,
    Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
    useGetNotificationsQuery,
    useReadSingleNotificationMutation,
    useReadAllNotificationsMutation,
    INotificationItem,
} from '../../redux/apiSlices/notificationSlice';
import { getSocket } from '../../utils/socket';
import { getImageUrl } from '../../utils/getImageUrl';

interface NotificationDropdownProps {
    currentUserId?: string;
    routeRole: string;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
    currentUserId,
    routeRole,
}) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [hasNewAlert, setHasNewAlert] = useState(false);

    // Fetch latest notifications
    const { data: responseData, isLoading, refetch } = useGetNotificationsQuery(
        { limit: 15 },
        { pollingInterval: 60000 }
    );

    const [readSingleNotification] = useReadSingleNotificationMutation();
    const [readAllNotifications, { isLoading: isMarkingAll }] = useReadAllNotificationsMutation();

    const notifications: INotificationItem[] = responseData?.data?.data || [];
    const unreadCount = responseData?.data?.unreadCount || 0;

    const processedNotifsRef = useRef<Set<string>>(new Set());

    // Real-time socket listener (single event + deduplicated toaster)
    useEffect(() => {
        if (!currentUserId) return;

        const socket = getSocket(currentUserId);

        const handleNewNotification = (notif: any) => {
            if (!notif) return;
            const notifId = String(notif._id || `${notif.title || ''}-${notif.createdAt || Date.now()}`);

            // Deduplicate: If already processed in the last 4 seconds, ignore
            if (processedNotifsRef.current.has(notifId)) {
                return;
            }
            processedNotifsRef.current.add(notifId);
            setTimeout(() => {
                processedNotifsRef.current.delete(notifId);
            }, 4000);

            console.log('[Socket] Received new notification:', notif);
            refetch();
            setHasNewAlert(true);
            setTimeout(() => setHasNewAlert(false), 4000);

            // Toast alert with unique toast id to prevent duplicate stacks
            toast.info(notif.title || 'New Notification', {
                id: `notif-${notifId}`,
                description: notif.message || notif.text || 'You have received a new update.',
                icon: <Bell className="w-4 h-4 text-emerald-500" />,
                action: {
                    label: 'View',
                    onClick: () => {
                        handleNotificationClick(notif);
                    },
                },
            });
        };

        const eventKey = `getNotification::${currentUserId}`;
        socket.on(eventKey, handleNewNotification);

        return () => {
            socket.off(eventKey, handleNewNotification);
        };
    }, [currentUserId, refetch]);

    const handleMarkAllRead = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await readAllNotifications().unwrap();
            toast.success('All notifications marked as read');
        } catch {
            toast.error('Failed to mark notifications as read');
        }
    };

    const handleNotificationClick = async (item: INotificationItem) => {
        setOpen(false);

        // Mark as read if not already
        if (!item.seen && !item.read) {
            try {
                await readSingleNotification(item._id).unwrap();
            } catch (err) {
                console.warn('Failed to mark notification as read:', err);
            }
        }

        // Navigate based on type / path
        if (item.type === 'MESSAGE' || item.path === '/chat' || item.path?.includes('chat')) {
            const chatId = item.refId;
            navigate(chatId ? `/${routeRole}/chat?chatId=${chatId}` : `/${routeRole}/chat`);
            return;
        }

        if (item.path && item.path !== '/' && !item.path.startsWith('http')) {
            navigate(item.path);
            return;
        }

        // Default: navigate to full notifications page
        navigate(`/${routeRole}/notifications`);
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

    const getTypeIcon = (type?: string) => {
        switch (type?.toUpperCase()) {
            case 'MESSAGE':
                return <MessageSquare className="w-4 h-4 text-emerald-600" />;
            case 'ASSIGNMENT':
                return <ClipboardList className="w-4 h-4 text-amber-600" />;
            case 'CLASS':
            case 'EVENT':
            case 'SCHEDULE':
                return <Calendar className="w-4 h-4 text-blue-600" />;
            default:
                return <Sparkles className="w-4 h-4 text-emerald-600" />;
        }
    };

    const filteredNotifications = notifications.filter((item) => {
        if (filter === 'unread') {
            return !item.seen && !item.read;
        }
        return true;
    });

    const popoverContent = (
        <div className="w-[360px] sm:w-[400px] -mx-4 -my-3 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[520px]">
            {/* Popover Header */}
            <div className="px-4 py-3.5 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-base tracking-tight text-white">Notifications</span>
                    {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-2xs">
                            {unreadCount} new
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            disabled={isMarkingAll}
                            className="inline-flex items-center gap-1 text-xs font-medium text-emerald-200 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                            title="Mark all as read"
                        >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Mark all read</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="px-4 py-2 border-b border-gray-100 bg-gray-50/70 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            filter === 'all'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                        }`}
                    >
                        All ({notifications.length})
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            filter === 'unread'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                        }`}
                    >
                        Unread ({unreadCount})
                    </button>
                </div>

                <span className="text-[11px] text-gray-400 font-medium">Recent Activity</span>
            </div>

            {/* Notifications Scrollable List */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                {isLoading ? (
                    <div className="p-8 flex flex-col items-center justify-center gap-2 text-gray-400">
                        <Spin size="small" />
                        <span className="text-xs">Loading notifications...</span>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="py-12 px-6 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                            <Inbox className="w-6 h-6 stroke-[1.5]" />
                        </div>
                        <h4 className="font-semibold text-gray-800 text-sm mb-1">
                            {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                        </h4>
                        <p className="text-xs text-gray-400 max-w-[240px]">
                            {filter === 'unread'
                                ? "You're completely caught up! We'll alert you when there is new activity."
                                : "Activity updates, chat messages, and schedule announcements will appear here."}
                        </p>
                    </div>
                ) : (
                    filteredNotifications.slice(0, 10).map((item) => {
                        const isUnread = !item.seen && !item.read;
                        const sender = item.sender;
                        const senderName = sender?.name || 'Share Network';
                        const avatarUrl = sender?.image ? getImageUrl(sender.image) : '';

                        return (
                            <div
                                key={item._id}
                                onClick={() => handleNotificationClick(item)}
                                className={`px-4 py-3 flex items-start gap-3 transition-colors cursor-pointer relative group ${
                                    isUnread
                                        ? 'bg-emerald-50/50 hover:bg-emerald-50'
                                        : 'hover:bg-gray-50'
                                }`}
                            >
                                {/* Left Icon / Avatar */}
                                <div className="relative shrink-0 mt-0.5">
                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt={senderName}
                                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-black/5"
                                        />
                                    ) : (
                                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs ring-1 ring-emerald-600/10">
                                            {getTypeIcon(item.type)}
                                        </div>
                                    )}

                                    {/* Unread Accent Dot */}
                                    {isUnread && (
                                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
                                    )}
                                </div>

                                {/* Content Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1 mb-0.5">
                                        <span className="font-semibold text-xs text-gray-900 truncate">
                                            {item.title}
                                        </span>
                                        <span className="text-[10px] text-gray-400 shrink-0 flex items-center gap-1 font-medium">
                                            <Clock className="w-3 h-3 text-gray-300" />
                                            {formatRelativeTime(item.createdAt)}
                                        </span>
                                    </div>

                                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-1">
                                        {item.message || item.text || 'Click to view details.'}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                                            {item.type || 'Update'}
                                        </span>
                                        <span className="text-[11px] text-emerald-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                            Open <ArrowRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Popover Footer: View All */}
            <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <button
                    onClick={() => {
                        setOpen(false);
                        navigate(`/${routeRole}/notifications`);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-white hover:bg-emerald-600 text-gray-700 hover:text-white border border-gray-200 hover:border-emerald-600 font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer group"
                >
                    <span>View all notifications</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
                </button>
            </div>
        </div>
    );

    return (
        <Popover
            content={popoverContent}
            trigger="click"
            open={open}
            onOpenChange={setOpen}
            placement="bottomRight"
            arrow={false}
            overlayInnerStyle={{ padding: 0, borderRadius: 16 }}
        >
            <button
                type="button"
                className={`relative p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-200 cursor-pointer shadow-2xs group ${
                    hasNewAlert ? 'ring-2 ring-emerald-400 animate-bounce' : ''
                }`}
                title="Notifications"
            >
                <Bell
                    className={`w-5 h-5 text-emerald-100 group-hover:text-white transition-transform ${
                        unreadCount > 0 ? 'group-hover:rotate-12' : ''
                    }`}
                />

                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-rose-500 text-white font-bold text-[11px] flex items-center justify-center border-2 border-emerald-900 shadow-md">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>
        </Popover>
    );
};

export default NotificationDropdown;
