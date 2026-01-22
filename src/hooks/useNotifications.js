import { useNotificationContext } from '../contexts/NotificationContext';

/**
 * Custom hook to access notification context
 * @returns {Object} Notification context values and functions
 */
export const useNotifications = () => {
    return useNotificationContext();
};

/**
 * Custom hook for notification statistics
 * @returns {Object} Statistics and related functions
 */
export const useNotificationStats = () => {
    const { statistics, unreadCount, fetchStatistics, lastFetchTime } = useNotificationContext();
    
    return {
        statistics,
        unreadCount,
        fetchStatistics,
        lastFetchTime
    };
};

