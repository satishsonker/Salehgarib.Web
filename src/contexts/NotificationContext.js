import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getQueueMessages, getStatistics, retryMessages } from '../services/whatsAppMessageQueueService';
import { toast } from 'react-toastify';

const NotificationContext = createContext(null);

export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotificationContext must be used within NotificationProvider');
    }
    return context;
};

/**
 * Notification Status Enum
 */
export const NotificationStatus = {
    Pending: 0,
    Processing: 1,
    Sent: 2,
    Failed: 3
};

/**
 * Notification Provider Component
 * Manages notification state and provides notification-related functions
 */
export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [statistics, setStatistics] = useState({
        PendingCount: 0,
        FailedCount: 0,
        SentCount: 0,
        ProcessingCount: 0,
        TotalCount: 0,
        GeneratedAt: null
    });
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [lastFetchTime, setLastFetchTime] = useState(null);
    const [pollingInterval, setPollingInterval] = useState(null);

    /**
     * Calculate unread count (Pending + Failed messages)
     */
    const calculateUnreadCount = useCallback((stats) => {
        return (stats.PendingCount || 0) + (stats.FailedCount || 0);
    }, []);

    /**
     * Fetch statistics from API
     */
    const fetchStatistics = useCallback(async () => {
        try {
            const response = await getStatistics();
            if (response?.data) {
                const stats = response.data;
                setStatistics(stats);
                const newUnreadCount = calculateUnreadCount(stats);
                
                // Show toast if new messages arrived
                if (unreadCount > 0 && newUnreadCount > unreadCount) {
                    const newMessages = newUnreadCount - unreadCount;
                    toast.info(`${newMessages} new notification${newMessages > 1 ? 's' : ''}`, {
                        position: 'top-right',
                        autoClose: 3000,
                    });
                }
                
                setUnreadCount(newUnreadCount);
                setLastFetchTime(new Date());
            }
        } catch (error) {
            console.error('Error fetching notification statistics:', error);
        }
    }, [unreadCount, calculateUnreadCount]);

    /**
     * Fetch notifications list
     */
    const fetchNotifications = useCallback(async (filters = {}) => {
        setIsLoading(true);
        try {
            const response = await getQueueMessages({
                ...filters,
                PageNo: filters.PageNo || 1,
                PageSize: filters.PageSize || 20
            });
            
            if (response?.data) {
                // Handle both array and paginated response
                const notificationsData = Array.isArray(response.data) 
                    ? response.data 
                    : (response.data.items || response.data.data || []);
                
                setNotifications(notificationsData);
                return notificationsData;
            }
            return [];
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Failed to load notifications');
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Retry failed messages
     */
    const retryFailedMessages = useCallback(async (messageIds) => {
        try {
            const response = await retryMessages(messageIds);
            if (response?.data) {
                toast.success(`Retrying ${messageIds.length} message(s)`);
                // Refresh statistics and notifications
                await fetchStatistics();
                await fetchNotifications();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error retrying messages:', error);
            toast.error('Failed to retry messages');
            return false;
        }
    }, [fetchStatistics, fetchNotifications]);

    /**
     * Start polling for statistics updates
     */
    const startPolling = useCallback((intervalSeconds = 10) => {
        // Clear existing interval
        if (pollingInterval) {
            clearInterval(pollingInterval);
        }

        // Fetch immediately
       // fetchStatistics();

        // Set up polling
        const interval = setInterval(() => {
           // fetchStatistics();
        }, intervalSeconds * 1000);

        setPollingInterval(interval);
    }, []);

    /**
     * Stop polling
     */
    const stopPolling = useCallback(() => {
        setPollingInterval((prevInterval) => {
            if (prevInterval) {
                clearInterval(prevInterval);
            }
            return null;
        });
    }, []);

    /**
     * Mark notifications as read (reset unread count)
     */
    const markAsRead = useCallback(() => {
        setUnreadCount(0);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [pollingInterval]);

    const value = {
        notifications,
        statistics,
        unreadCount,
        isLoading,
        lastFetchTime,
        fetchStatistics,
        fetchNotifications,
        retryFailedMessages,
        startPolling,
        stopPolling,
        markAsRead,
        setNotifications
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

