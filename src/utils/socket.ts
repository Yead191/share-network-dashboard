import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { socketUrl as baseSocketUrl } from '../redux/api/baseApi';

let socketInstance: Socket | null = null;
let currentOnlineUsers: string[] = [];
const onlineSubscribers = new Set<(users: string[]) => void>();

export const getSocketUrl = (): string => {
    if (baseSocketUrl && typeof baseSocketUrl === 'string' && baseSocketUrl.trim() !== '') {
        return baseSocketUrl;
    }
    const envUrl = import.meta.env.VITE_SOCKET_URL;
    if (envUrl) return envUrl;
    // Fallback to local server or origin
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return 'http://localhost:8000';
    }
    return typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8000';
};

export const getSocket = (userId?: string): Socket => {
    if (!socketInstance) {
        const url = getSocketUrl();
        const token = localStorage.getItem('token') || '';

        socketInstance = io(url, {
            transports: ['websocket', 'polling'],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            auth: {
                token,
                userId: userId || undefined,
            },
            query: {
                userId: userId || undefined,
            },
        });

        socketInstance.on('connect', () => {
            console.log('[Socket] Connected:', socketInstance?.id);
            if (userId) {
                socketInstance?.emit('identify', userId);
            }
            socketInstance?.emit('get-online-users');
        });

        socketInstance.on('online-users', (users: string[]) => {
            currentOnlineUsers = Array.isArray(users) ? users : [];
            onlineSubscribers.forEach((cb) => cb(currentOnlineUsers));
        });

        socketInstance.on('disconnect', (reason) => {
            console.log('[Socket] Disconnected:', reason);
        });

        socketInstance.on('connect_error', (err) => {
            console.warn('[Socket] Connection warning:', err.message);
        });
    } else if (userId) {
        if (socketInstance.connected) {
            socketInstance.emit('identify', userId);
            socketInstance.emit('get-online-users');
        }
    }

    return socketInstance;
};

export const joinChatRoom = (chatId: string) => {
    if (socketInstance && chatId) {
        socketInstance.emit('join-chat', chatId);
    }
};

export const leaveChatRoom = (chatId: string) => {
    if (socketInstance && chatId) {
        socketInstance.emit('leave-chat', chatId);
    }
};

export const disconnectSocket = (userId?: string) => {
    if (socketInstance) {
        try {
            socketInstance.emit('user-logout', userId);
            socketInstance.disconnect();
        } catch {
            // ignore
        }
        socketInstance = null;
        currentOnlineUsers = [];
        onlineSubscribers.forEach((cb) => cb([]));
    }
};

/**
 * React hook to observe online users in real-time
 */
export const useOnlineUsers = (currentUserId?: string) => {
    const [onlineUsers, setOnlineUsers] = useState<string[]>(currentOnlineUsers);

    useEffect(() => {
        const socket = getSocket(currentUserId);
        setOnlineUsers(currentOnlineUsers);

        const subscriber = (users: string[]) => {
            setOnlineUsers([...users]);
        };

        onlineSubscribers.add(subscriber);
        socket.emit('get-online-users');

        return () => {
            onlineSubscribers.delete(subscriber);
        };
    }, [currentUserId]);

    return onlineUsers;
};

/**
 * React hook to check if a single target user is online
 */
export const useIsUserOnline = (targetUserId?: string, currentUserId?: string) => {
    const onlineUsers = useOnlineUsers(currentUserId);
    if (!targetUserId) return false;
    return onlineUsers.includes(String(targetUserId));
};
