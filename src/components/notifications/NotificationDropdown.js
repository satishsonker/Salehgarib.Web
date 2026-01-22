import React, { useEffect, useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationStatus } from '../../contexts/NotificationContext';
import NotificationListItem from './NotificationListItem';
import { useNavigate } from 'react-router-dom';

/**
 * Notification Dropdown Component
 * Displays list of notifications in a dropdown
 */
const NotificationDropdown = ({ onClose }) => {
    const {
        notifications,
        statistics,
        isLoading,
        fetchNotifications,
        markAsRead
    } = useNotifications();
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all'); // all, pending, failed, processing, sent
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch notifications when dropdown opens
        fetchNotifications({ PageSize: 10 });
    }, [fetchNotifications]);

    useEffect(() => {
        // Filter notifications based on active filter
        if (activeFilter === 'all') {
            // Show pending and failed first, then others
            const pendingFailed = notifications.filter(
                n => n.CurrentStatus === NotificationStatus.Pending || n.CurrentStatus === NotificationStatus.Failed
            );
            const others = notifications.filter(
                n => n.CurrentStatus !== NotificationStatus.Pending && n.CurrentStatus !== NotificationStatus.Failed
            );
            setFilteredNotifications([...pendingFailed, ...others]);
        } else {
            const statusMap = {
                pending: NotificationStatus.Pending,
                failed: NotificationStatus.Failed,
                processing: NotificationStatus.Processing,
                sent: NotificationStatus.Sent
            };
            setFilteredNotifications(
                notifications.filter(n => n.CurrentStatus === statusMap[activeFilter])
            );
        }
    }, [notifications, activeFilter]);

    const handleViewAll = () => {
        markAsRead();
        navigate('/notifications');
        onClose();
    };

    const handleMarkAsRead = () => {
        markAsRead();
    };

    const getStatusCount = (status) => {
        switch (status) {
            case 'pending':
                return statistics.PendingCount || 0;
            case 'failed':
                return statistics.FailedCount || 0;
            case 'processing':
                return statistics.ProcessingCount || 0;
            case 'sent':
                return statistics.SentCount || 0;
            default:
                return 0;
        }
    };

    return (
        <div
            className="dropdown-menu dropdown-menu-end notification-dropdown show"
            style={{
                width: '400px',
                maxHeight: '600px',
                overflowY: 'auto',
                padding: 0,
                position: 'absolute',
                top: '100%',
                right: 0,
                zIndex: 1050,
                display: 'block',
                marginTop: '0.125rem'
            }}
        >
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                <h6 className="mb-0" style={{ fontSize: 'var(--app-font-size)' }}>
                    Notifications
                </h6>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-sm btn-link text-decoration-none p-0"
                        onClick={handleMarkAsRead}
                        style={{ fontSize: '0.85rem' }}
                    >
                        Mark as read
                    </button>
                    <button
                        className="btn btn-sm btn-link text-decoration-none p-0"
                        onClick={onClose}
                        style={{ fontSize: '0.85rem' }}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="d-flex border-bottom" style={{ fontSize: '0.85rem' }}>
                <button
                    className={`flex-fill btn btn-sm ${activeFilter === 'all' ? 'btn-primary' : 'btn-link'} border-0 rounded-0`}
                    onClick={() => setActiveFilter('all')}
                    style={{ fontSize: '0.85rem' }}
                >
                    All
                </button>
                <button
                    className={`flex-fill btn btn-sm ${activeFilter === 'pending' ? 'btn-primary' : 'btn-link'} border-0 rounded-0 position-relative`}
                    onClick={() => setActiveFilter('pending')}
                    style={{ fontSize: '0.85rem' }}
                >
                    Pending
                    {getStatusCount('pending') > 0 && (
                        <span className="badge bg-warning text-dark ms-1" style={{ fontSize: '0.65rem' }}>
                            {getStatusCount('pending')}
                        </span>
                    )}
                </button>
                <button
                    className={`flex-fill btn btn-sm ${activeFilter === 'failed' ? 'btn-primary' : 'btn-link'} border-0 rounded-0 position-relative`}
                    onClick={() => setActiveFilter('failed')}
                    style={{ fontSize: '0.85rem' }}
                >
                    Failed
                    {getStatusCount('failed') > 0 && (
                        <span className="badge bg-danger ms-1" style={{ fontSize: '0.65rem' }}>
                            {getStatusCount('failed')}
                        </span>
                    )}
                </button>
            </div>

            {/* Notifications List */}
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {isLoading ? (
                    <div className="text-center p-4">
                        <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="text-center p-4 text-muted">
                        <i className="bi bi-inbox" style={{ fontSize: '2rem' }}></i>
                        <p className="mt-2 mb-0">No notifications</p>
                    </div>
                ) : (
                    filteredNotifications.map((notification) => (
                        <NotificationListItem
                            key={notification.Id}
                            notification={notification}
                        />
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="border-top p-2 text-center">
                <button
                    className="btn btn-sm btn-link text-decoration-none"
                    onClick={handleViewAll}
                    style={{ fontSize: '0.85rem' }}
                >
                    View All Notifications
                </button>
            </div>
        </div>
    );
};

export default NotificationDropdown;

