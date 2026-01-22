import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationStatus } from '../../contexts/NotificationContext';
import NotificationListItem from './NotificationListItem';
import { retryMessages } from '../../services/whatsAppMessageQueueService';
import { toast } from 'react-toastify';

/**
 * Full Notification Page Component
 * Displays all notifications with filters and pagination
 */
const NotificationPage = () => {
    const {
        notifications,
        statistics,
        isLoading,
        fetchNotifications,
        fetchStatistics
    } = useNotifications();

    const [filters, setFilters] = useState({
        OrderId: '',
        ToNumber: '',
        Status: null,
        FromDate: '',
        ToDate: '',
        PageNo: 1,
        PageSize: 20
    });

    const [selectedMessages, setSelectedMessages] = useState([]);
    const [isRetrying, setIsRetrying] = useState(false);

    useEffect(() => {
        fetchStatistics();
        fetchNotifications(filters);
    }, [filters, fetchStatistics, fetchNotifications]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value,
            PageNo: 1 // Reset to first page on filter change
        }));
    };

    const handleStatusFilter = (status) => {
        handleFilterChange('Status', status === filters.Status ? null : status);
    };

    const handleRetrySelected = async () => {
        if (selectedMessages.length === 0) {
            toast.warn('Please select messages to retry');
            return;
        }

        setIsRetrying(true);
        try {
            const response = await retryMessages(selectedMessages);
            if (response?.data) {
                toast.success(`Retrying ${selectedMessages.length} message(s)`);
                setSelectedMessages([]);
                await fetchStatistics();
                await fetchNotifications(filters);
            }
        } catch (error) {
            toast.error('Failed to retry messages');
        } finally {
            setIsRetrying(false);
        }
    };

    const handleSelectAll = () => {
        const failedMessages = notifications
            .filter(n => n.CurrentStatus === NotificationStatus.Failed)
            .map(n => n.Id);
        setSelectedMessages(
            selectedMessages.length === failedMessages.length ? [] : failedMessages
        );
    };

    const handleSelectMessage = (messageId) => {
        setSelectedMessages(prev =>
            prev.includes(messageId)
                ? prev.filter(id => id !== messageId)
                : [...prev, messageId]
        );
    };

    const getStatusCount = (status) => {
        switch (status) {
            case NotificationStatus.Pending:
                return statistics.PendingCount || 0;
            case NotificationStatus.Failed:
                return statistics.FailedCount || 0;
            case NotificationStatus.Processing:
                return statistics.ProcessingCount || 0;
            case NotificationStatus.Sent:
                return statistics.SentCount || 0;
            default:
                return 0;
        }
    };

    return (
        <div className="container-fluid">
            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">WhatsApp Message Queue Notifications</h5>
                </div>
                <div className="card-body">
                    {/* Statistics Cards */}
                    <div className="row mb-4">
                        <div className="col-md-3">
                            <div className="card bg-warning text-dark">
                                <div className="card-body">
                                    <h6 className="card-title">Pending</h6>
                                    <h3 className="mb-0">{statistics.PendingCount || 0}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-danger text-white">
                                <div className="card-body">
                                    <h6 className="card-title">Failed</h6>
                                    <h3 className="mb-0">{statistics.FailedCount || 0}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-info text-white">
                                <div className="card-body">
                                    <h6 className="card-title">Processing</h6>
                                    <h3 className="mb-0">{statistics.ProcessingCount || 0}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-success text-white">
                                <div className="card-body">
                                    <h6 className="card-title">Sent</h6>
                                    <h3 className="mb-0">{statistics.SentCount || 0}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="card mb-3">
                        <div className="card-body">
                            <h6 className="card-title mb-3">Filters</h6>
                            <div className="row g-3">
                                <div className="col-md-3">
                                    <label className="form-label">Order ID</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={filters.OrderId}
                                        onChange={(e) => handleFilterChange('OrderId', e.target.value)}
                                        placeholder="Order ID"
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">To Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={filters.ToNumber}
                                        onChange={(e) => handleFilterChange('ToNumber', e.target.value)}
                                        placeholder="Phone number"
                                    />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">From Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={filters.FromDate}
                                        onChange={(e) => handleFilterChange('FromDate', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">To Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={filters.ToDate}
                                        onChange={(e) => handleFilterChange('ToDate', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">Status</label>
                                    <select
                                        className="form-select"
                                        value={filters.Status || ''}
                                        onChange={(e) => handleFilterChange('Status', e.target.value ? parseInt(e.target.value) : null)}
                                    >
                                        <option value="">All</option>
                                        <option value={NotificationStatus.Pending}>Pending</option>
                                        <option value={NotificationStatus.Processing}>Processing</option>
                                        <option value={NotificationStatus.Sent}>Sent</option>
                                        <option value={NotificationStatus.Failed}>Failed</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-3">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => fetchNotifications(filters)}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Loading...
                                        </>
                                    ) : (
                                        'Apply Filters'
                                    )}
                                </button>
                                <button
                                    className="btn btn-secondary ms-2"
                                    onClick={() => {
                                        setFilters({
                                            OrderId: '',
                                            ToNumber: '',
                                            Status: null,
                                            FromDate: '',
                                            ToDate: '',
                                            PageNo: 1,
                                            PageSize: 20
                                        });
                                    }}
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Status Filter Buttons */}
                    <div className="mb-3">
                        <div className="btn-group" role="group">
                            <button
                                type="button"
                                className={`btn ${filters.Status === null ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => handleStatusFilter(null)}
                            >
                                All ({statistics.TotalCount || 0})
                            </button>
                            <button
                                type="button"
                                className={`btn ${filters.Status === NotificationStatus.Pending ? 'btn-warning' : 'btn-outline-warning'}`}
                                onClick={() => handleStatusFilter(NotificationStatus.Pending)}
                            >
                                Pending ({getStatusCount(NotificationStatus.Pending)})
                            </button>
                            <button
                                type="button"
                                className={`btn ${filters.Status === NotificationStatus.Failed ? 'btn-danger' : 'btn-outline-danger'}`}
                                onClick={() => handleStatusFilter(NotificationStatus.Failed)}
                            >
                                Failed ({getStatusCount(NotificationStatus.Failed)})
                            </button>
                            <button
                                type="button"
                                className={`btn ${filters.Status === NotificationStatus.Processing ? 'btn-info' : 'btn-outline-info'}`}
                                onClick={() => handleStatusFilter(NotificationStatus.Processing)}
                            >
                                Processing ({getStatusCount(NotificationStatus.Processing)})
                            </button>
                            <button
                                type="button"
                                className={`btn ${filters.Status === NotificationStatus.Sent ? 'btn-success' : 'btn-outline-success'}`}
                                onClick={() => handleStatusFilter(NotificationStatus.Sent)}
                            >
                                Sent ({getStatusCount(NotificationStatus.Sent)})
                            </button>
                        </div>
                    </div>

                    {/* Retry Actions */}
                    {selectedMessages.length > 0 && (
                        <div className="alert alert-info d-flex justify-content-between align-items-center mb-3">
                            <span>{selectedMessages.length} message(s) selected</span>
                            <div>
                                <button
                                    className="btn btn-sm btn-primary me-2"
                                    onClick={handleRetrySelected}
                                    disabled={isRetrying}
                                >
                                    {isRetrying ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Retrying...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-arrow-clockwise"></i> Retry Selected
                                        </>
                                    )}
                                </button>
                                <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => setSelectedMessages([])}
                                >
                                    Clear Selection
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Notifications List */}
                    <div className="card">
                        <div className="card-body">
                            {isLoading ? (
                                <div className="text-center p-4">
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="text-center p-4 text-muted">
                                    <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
                                    <p className="mt-3">No notifications found</p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-2">
                                        <button
                                            className="btn btn-sm btn-link"
                                            onClick={handleSelectAll}
                                        >
                                            {selectedMessages.length === notifications.filter(n => n.CurrentStatus === NotificationStatus.Failed).length
                                                ? 'Deselect All'
                                                : 'Select All Failed'}
                                        </button>
                                    </div>
                                    {notifications.map((notification) => (
                                        <div key={notification.Id} className="d-flex align-items-start mb-2">
                                            {notification.CurrentStatus === NotificationStatus.Failed && (
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input me-2 mt-2"
                                                    checked={selectedMessages.includes(notification.Id)}
                                                    onChange={() => handleSelectMessage(notification.Id)}
                                                />
                                            )}
                                            <div className="flex-grow-1">
                                                <NotificationListItem notification={notification} />
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Pagination */}
                    {notifications.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <div>
                                <span className="text-muted">
                                    Showing page {filters.PageNo} ({notifications.length} items)
                                </span>
                            </div>
                            <div>
                                <button
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => handleFilterChange('PageNo', Math.max(1, filters.PageNo - 1))}
                                    disabled={filters.PageNo === 1 || isLoading}
                                >
                                    Previous
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => handleFilterChange('PageNo', filters.PageNo + 1)}
                                    disabled={notifications.length < filters.PageSize || isLoading}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationPage;

