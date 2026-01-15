import React from 'react';
import { NotificationStatus } from '../../contexts/NotificationContext';
import { useNotifications } from '../../hooks/useNotifications';
import { toast } from 'react-toastify';

/**
 * Notification List Item Component
 * Displays individual notification item
 */
const NotificationListItem = ({ notification }) => {
    const { retryFailedMessages } = useNotifications();

    const getStatusBadge = (status) => {
        const statusConfig = {
            [NotificationStatus.Pending]: { label: 'Pending', class: 'bg-warning text-dark' },
            [NotificationStatus.Processing]: { label: 'Processing', class: 'bg-info' },
            [NotificationStatus.Sent]: { label: 'Sent', class: 'bg-success' },
            [NotificationStatus.Failed]: { label: 'Failed', class: 'bg-danger' }
        };

        const config = statusConfig[status] || { label: 'Unknown', class: 'bg-secondary' };
        
        return (
            <span className={`badge ${config.class}`} style={{ fontSize: '0.7rem' }}>
                {config.label}
            </span>
        );
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    };

    const handleRetry = async (e) => {
        e.stopPropagation();
        const success = await retryFailedMessages([notification.Id]);
        if (success) {
            toast.success('Message retry initiated');
        }
    };

    return (
        <div
            className={`notification-item p-3 border-bottom ${
                notification.CurrentStatus === NotificationStatus.Failed ||
                notification.CurrentStatus === NotificationStatus.Pending
                    ? 'bg-light'
                    : ''
            }`}
            style={{
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                fontSize: 'var(--app-font-size)'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                    notification.CurrentStatus === NotificationStatus.Failed ||
                    notification.CurrentStatus === NotificationStatus.Pending
                        ? '#f8f9fa'
                        : 'transparent';
            }}
        >
            <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-1">
                        {getStatusBadge(notification.CurrentStatus)}
                        {notification.OrderId && (
                            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                                Order: {notification.OrderId}
                            </span>
                        )}
                    </div>
                    {notification.ToNumber && (
                        <div className="mb-1" style={{ fontSize: '0.9rem' }}>
                            <strong>To:</strong> {notification.ToNumber}
                        </div>
                    )}
                    {notification.MessageTemplate && (
                        <div className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>
                            {notification.MessageTemplate.length > 50
                                ? `${notification.MessageTemplate.substring(0, 50)}...`
                                : notification.MessageTemplate}
                        </div>
                    )}
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center">
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                    <i className="bi bi-clock"></i> {formatDateTime(notification.EnqueueDateTime)}
                </div>
                {notification.CurrentStatus === NotificationStatus.Failed && (
                    <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={handleRetry}
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                    >
                        <i className="bi bi-arrow-clockwise"></i> Retry
                    </button>
                )}
            </div>

            {notification.ErrorMessage && (
                <div className="mt-2 p-2 bg-danger bg-opacity-10 rounded" style={{ fontSize: '0.8rem' }}>
                    <strong className="text-danger">Error:</strong> {notification.ErrorMessage}
                </div>
            )}

            {notification.RetryCount > 0 && (
                <div className="mt-1 text-muted" style={{ fontSize: '0.75rem' }}>
                    Retries: {notification.RetryCount}/{notification.MaxRetries || 3}
                </div>
            )}
        </div>
    );
};

export default NotificationListItem;

