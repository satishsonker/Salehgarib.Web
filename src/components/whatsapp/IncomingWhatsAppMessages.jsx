import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb';
import Inputbox from '../common/Inputbox';
import Dropdown from '../common/Dropdown';
import ButtonBox from '../common/ButtonBox';
import './IncomingWhatsAppMessages.css';

export default function IncomingWhatsAppMessages() {
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [messages, setMessages] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [filters, setFilters] = useState({
        fromNumber: '',
        customerId: '',
        orderId: '',
        status: '',
        fromDate: '',
        toDate: '',
        messageType: ''
    });
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [conversationMessages, setConversationMessages] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [statusNotes, setStatusNotes] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isSendingReply, setIsSendingReply] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [messageDetails, setMessageDetails] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefreshingAll, setIsRefreshingAll] = useState(false);
    const [isRefreshingConversation, setIsRefreshingConversation] = useState(false);
    const [selectedMediaFile, setSelectedMediaFile] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [isUploadingMedia, setIsUploadingMedia] = useState(false);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const statusOptions = [
        { id: '', value: 'All Status' },
        { id: 'New', value: 'New' },
        { id: 'Processed', value: 'Processed' },
        { id: 'Replied', value: 'Replied' },
        { id: 'Failed', value: 'Failed' },
        { id: 'Ignored', value: 'Ignored' }
    ];

    const messageTypeOptions = [
        { id: '', value: 'All Types' },
        { id: 'text', value: 'Text' },
        { id: 'image', value: 'Image' },
        { id: 'document', value: 'Document' },
        { id: 'audio', value: 'Audio' },
        { id: 'video', value: 'Video' }
    ];

    const statusUpdateOptions = [
        { id: 'New', value: 'New' },
        { id: 'Processed', value: 'Processed' },
        { id: 'Replied', value: 'Replied' },
        { id: 'Failed', value: 'Failed' },
        { id: 'Ignored', value: 'Ignored' }
    ];

    useEffect(() => {
        fetchMessages();
    }, [pageNo, pageSize, filters]);

    useEffect(() => {
        if (selectedConversation) {
            loadConversationMessages(selectedConversation.fromNumber);
        }
    }, [selectedConversation]);

    useEffect(() => {
        scrollToBottom();
    }, [conversationMessages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const buildQueryParams = () => {
        const params = new URLSearchParams({
            PageNo: pageNo.toString(),
            PageSize: pageSize.toString()
        });

    if (filters.fromNumber) params.append('FromNumber',common.contactNoEncoder(filters.fromNumber));
        if (filters.customerId) params.append('CustomerId', filters.customerId);
        if (filters.orderId) params.append('OrderId', filters.orderId);
        if (filters.status) params.append('Status', filters.status);
        if (filters.fromDate) params.append('FromDate', filters.fromDate);
        if (filters.toDate) params.append('ToDate', filters.toDate);
        if (filters.messageType) params.append('MessageType', filters.messageType);

        return params.toString();
    };

    const fetchMessages = (showLoading = false) => {
        if (showLoading) setIsRefreshingAll(true);
        const url = `${apiUrls.incomingWhatsAppMessagesController.getAll}?${buildQueryParams()}`;
        Api.Get(url)
            .then(res => {
                setMessages(res.data.data || []);
                setTotalRecords(res.data.totalRecords || 0);
                if (showLoading) {
                    toast.success('Messages refreshed successfully');
                }
            })
            .catch(err => {
                toast.error(toastMessage.loadError);
            })
            .finally(() => {
                if (showLoading) setIsRefreshingAll(false);
            });
    };

    const loadConversationMessages = (fromNumber, showLoading = false) => {
        if (showLoading) setIsRefreshingConversation(true);
        const url = `${apiUrls.incomingWhatsAppMessagesController.getAll}?FromNumber=${common.contactNoEncoder(fromNumber)}&PageSize=100`;
        Api.Get(url)
            .then(res => {
                setConversationMessages(res.data.data || []);
                if (showLoading) {
                    toast.success('Conversation refreshed successfully');
                }
            })
            .catch(err => {
                toast.error('Failed to load conversation');
            })
            .finally(() => {
                if (showLoading) setIsRefreshingConversation(false);
            });
    };

    const handleRefreshAll = () => {
        fetchMessages(true);
    };

    const handleRefreshConversation = () => {
        if (selectedConversation) {
            loadConversationMessages(selectedConversation.fromNumber, true);
            // Also refresh the conversation in the list
            fetchMessages(true);
        }
    };

    const handleRefreshMessage = (message) => {
        // Refresh a specific message by reloading conversation
        if (message.fromNumber) {
            loadConversationMessages(message.fromNumber, true);
        }
    };

    const fetchMessageDetails = (messageId) => {
        Api.Get(apiUrls.incomingWhatsAppMessagesController.getById + messageId)
            .then(res => {
                setMessageDetails(res.data);
                setShowDetailsModal(true);
            })
            .catch(err => {
                toast.error('Failed to load message details');
            });
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
        setPageNo(1);
    };

    const handleMediaSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (max 16MB for WhatsApp)
        const maxSize = 16 * 1024 * 1024; // 16MB
        if (file.size > maxSize) {
            toast.error('File size must be less than 16MB');
            return;
        }

        setSelectedMediaFile(file);

        // Create preview
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMediaPreview({ type: 'image', url: reader.result });
            };
            reader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMediaPreview({ type: 'video', url: reader.result });
            };
            reader.readAsDataURL(file);
        } else {
            setMediaPreview({ type: 'file', name: file.name });
        }
    };

    const handleUploadMedia = () => {
        if (!selectedMediaFile) return;

        setIsUploadingMedia(true);
        const formData = new FormData();
        formData.append('File', selectedMediaFile);
        formData.append('DirectoryPath', 'whatsapp/incoming/replies');
        formData.append('FileName', selectedMediaFile.name);

        Api.FileUploadPost(apiUrls.whatsAppMessageQueueController.uploadMedia, formData)
            .then(res => {
                if (res.data) {
                    const filePath = res.data.filePath || res.data.url || res.data;
                    handleSendReply(filePath);
                }
            })
            .catch(err => {
                toast.error('Failed to upload media');
                setIsUploadingMedia(false);
            });
    };

    const handleSendReply = (mediaUrl = null) => {
        if (!replyText.trim() && !mediaUrl) {
            toast.warning('Please enter a reply message or attach media');
            return;
        }

        if (!selectedConversation) {
            toast.warning('Please select a conversation');
            return;
        }

        setIsSendingReply(true);
        Api.Post(apiUrls.incomingWhatsAppMessagesController.reply, {
            messageId: selectedConversation.id,
            replyText: replyText.trim() || '',
            mediaUrl: mediaUrl
        })
            .then(res => {
                if (res.data.success) {
                    toast.success(res.data.message || 'Reply sent successfully');
                    setReplyText('');
                    setSelectedMediaFile(null);
                    setMediaPreview(null);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                    fetchMessages();
                    if (selectedConversation) {
                        loadConversationMessages(selectedConversation.fromNumber);
                    }
                } else {
                    toast.error(res.data.message || 'Failed to send reply');
                }
            })
            .catch(err => {
                toast.error(err?.response?.data?.message || 'Failed to send reply');
            })
            .finally(() => {
                setIsSendingReply(false);
                setIsUploadingMedia(false);
            });
    };

    const handleRemoveMedia = () => {
        setSelectedMediaFile(null);
        setMediaPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUpdateStatus = (message) => {
        setSelectedMessage(message);
        setSelectedStatus(message.status || 'New');
        setStatusNotes(message.notes || '');
        setShowStatusModal(true);
    };

    const handleSaveStatus = () => {
        if (!selectedStatus) {
            toast.warning('Please select a status');
            return;
        }

        setIsUpdatingStatus(true);
        Api.Put(apiUrls.incomingWhatsAppMessagesController.updateStatus, {
            messageId: selectedMessage.id,
            status: selectedStatus,
            notes: statusNotes.trim() || null
        })
            .then(res => {
                toast.success('Status updated successfully');
                setShowStatusModal(false);
                setSelectedMessage(null);
                setSelectedStatus('');
                setStatusNotes('');
                fetchMessages();
                if (selectedConversation) {
                    loadConversationMessages(selectedConversation.fromNumber);
                }
            })
            .catch(err => {
                toast.error(err?.response?.data?.message || 'Failed to update status');
            })
            .finally(() => {
                setIsUpdatingStatus(false);
            });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'New': { class: 'whatsapp-status-new', icon: 'bi-circle' },
            'Processed': { class: 'whatsapp-status-processed', icon: 'bi-check-circle' },
            'Replied': { class: 'whatsapp-status-replied', icon: 'bi-reply' },
            'Failed': { class: 'whatsapp-status-failed', icon: 'bi-x-circle' },
            'Ignored': { class: 'whatsapp-status-ignored', icon: 'bi-eye-slash' }
        };

        const config = statusConfig[status] || { class: 'whatsapp-status-ignored', icon: 'bi-question-circle' };

        return (
            <span className={`whatsapp-status-badge ${config.class}`}>
                <i className={`bi ${config.icon}`}></i>
                {status}
            </span>
        );
    };

    const getMessageTypeIcon = (type) => {
        const icons = {
            'text': 'bi-chat-text',
            'image': 'bi-image',
            'document': 'bi-file-earmark',
            'audio': 'bi-mic',
            'video': 'bi-camera-video'
        };
        return icons[type] || 'bi-file';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return common.getHtmlDate(date, 'ddmmyyyyhhmmss');
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const getTimeAgo = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

        if (diffInDays > 0) {
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        } else if (diffInHours > 0) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        } else if (diffInMinutes > 0) {
            return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        } else {
            return 'Just now';
        }
    };

    const formatDateLabel = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
        }
    };

    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0]?.[0] || '') + (parts[1]?.[0] || '').toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Group messages by date
    const groupMessagesByDate = (messages) => {
        const grouped = {};
        messages.forEach(msg => {
            const date = formatDateLabel(msg.receivedAt);
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(msg);
        });
        return grouped;
    };

    // Get unique conversations (group by fromNumber)
    const getConversations = () => {
        const conversationMap = new Map();
        messages.forEach(msg => {
            if (!conversationMap.has(msg.fromNumber)) {
                conversationMap.set(msg.fromNumber, msg);
            } else {
                const existing = conversationMap.get(msg.fromNumber);
                if (new Date(msg.receivedAt) > new Date(existing.receivedAt)) {
                    conversationMap.set(msg.fromNumber, msg);
                }
            }
        });
        return Array.from(conversationMap.values()).sort((a, b) => 
            new Date(b.receivedAt) - new Date(a.receivedAt)
        );
    };

    const filteredConversations = getConversations().filter(conv => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            conv.fromNumber?.toLowerCase().includes(search) ||
            conv.customerName?.toLowerCase().includes(search) ||
            conv.messageBody?.toLowerCase().includes(search)
        );
    });

    const groupedMessages = groupMessagesByDate(conversationMessages);

    const breadcrumbOption = {
        title: 'Incoming WhatsApp Messages',
        items: [
            {
                title: "Incoming WhatsApp Messages",
                icon: "bi bi-whatsapp",
                isActive: false,
            }
        ],
        buttons: []
    };

    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Incoming WhatsApp Messages</h6>
            <hr />

            <div className="whatsapp-chat-container">
                {/* Sidebar */}
                <div className="whatsapp-sidebar">
                    <div className="whatsapp-sidebar-header">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <input
                                type="text"
                                className="whatsapp-search-box"
                                placeholder="Search messages..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={handleRefreshAll}
                                disabled={isRefreshingAll}
                                title="Refresh All Messages"
                                style={{ 
                                    padding: '6px 10px',
                                    border: 'none',
                                    background: 'white',
                                    borderRadius: '20px'
                                }}
                            >
                                {isRefreshingAll ? (
                                    <span className="spinner-border spinner-border-sm"></span>
                                ) : (
                                    <i className="bi bi-arrow-clockwise"></i>
                                )}
                            </button>
                        </div>
                        <button
                            className="whatsapp-filters-toggle"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <i className={`bi ${showFilters ? 'bi-chevron-up' : 'bi-chevron-down'} me-2`}></i>
                            {showFilters ? 'Hide' : 'Show'} Filters
                        </button>
                    </div>

                    {/* Filters Panel */}
                    <div className={`whatsapp-filters-panel ${showFilters ? 'show' : ''}`}>
                        <div className="row g-2">
                            <div className="col-12">
                                <Inputbox
                                    label="Phone Number"
                                    name="fromNumber"
                                    value={filters.fromNumber}
                                    onChange={(e) => handleFilterChange('fromNumber', e.target.value)}
                                    placeholder="Filter by phone number"
                                    className="form-control-sm"
                                />
                            </div>
                            <div className="col-6">
                                <Inputbox
                                    label="Customer ID"
                                    name="customerId"
                                    value={filters.customerId}
                                    onChange={(e) => handleFilterChange('customerId', e.target.value)}
                                    placeholder="Customer ID"
                                    type="number"
                                    className="form-control-sm"
                                />
                            </div>
                            <div className="col-6">
                                <Inputbox
                                    label="Order ID"
                                    name="orderId"
                                    value={filters.orderId}
                                    onChange={(e) => handleFilterChange('orderId', e.target.value)}
                                    placeholder="Order ID"
                                    type="number"
                                    className="form-control-sm"
                                />
                            </div>
                            <div className="col-6">
                                <Dropdown
                                    label="Status"
                                    name="status"
                                    value={filters.status}
                                    onChange={(value) => handleFilterChange('status', value)}
                                    options={statusOptions}
                                />
                            </div>
                            <div className="col-6">
                                <Dropdown
                                    label="Message Type"
                                    name="messageType"
                                    value={filters.messageType}
                                    onChange={(value) => handleFilterChange('messageType', value)}
                                    options={messageTypeOptions}
                                />
                            </div>
                            <div className="col-6">
                                <Inputbox
                                    label="From Date"
                                    name="fromDate"
                                    value={filters.fromDate}
                                    onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                                    type="datetime-local"
                                    className="form-control-sm"
                                />
                            </div>
                            <div className="col-6">
                                <Inputbox
                                    label="To Date"
                                    name="toDate"
                                    value={filters.toDate}
                                    onChange={(e) => handleFilterChange('toDate', e.target.value)}
                                    type="datetime-local"
                                    className="form-control-sm"
                                />
                            </div>
                            <div className="col-12">
                                <button
                                    className="btn btn-sm btn-outline-secondary w-100"
                                    onClick={() => {
                                        setFilters({
                                            fromNumber: '',
                                            customerId: '',
                                            orderId: '',
                                            status: '',
                                            fromDate: '',
                                            toDate: '',
                                            messageType: ''
                                        });
                                        setPageNo(1);
                                    }}
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Message List */}
                    <div className="whatsapp-message-list">
                        {filteredConversations.length === 0 ? (
                            <div className="whatsapp-empty-state">
                                <i className="bi bi-inbox whatsapp-empty-state-icon"></i>
                                <p>No messages found</p>
                            </div>
                        ) : (
                            filteredConversations.map((message) => (
                                <div
                                    key={message.id}
                                    className={`whatsapp-message-item ${selectedConversation?.fromNumber === message.fromNumber ? 'active' : ''}`}
                                    onClick={() => setSelectedConversation(message)}
                                >
                                    <div className="whatsapp-avatar">
                                        {getInitials(message.customerName || message.fromNumber)}
                                    </div>
                                    <div className="whatsapp-message-content">
                                        <div className="whatsapp-message-header">
                                            <span className="whatsapp-message-name">
                                                {message.customerName || message.fromNumber}
                                            </span>
                                            <div className="d-flex align-items-center gap-2">
                                                <button
                                                    className="btn btn-sm p-0"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRefreshMessage(message);
                                                    }}
                                                    title="Refresh"
                                                    style={{ 
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: '#667781',
                                                        fontSize: '12px',
                                                        padding: '2px 4px'
                                                    }}
                                                >
                                                    <i className="bi bi-arrow-clockwise"></i>
                                                </button>
                                                <span className="whatsapp-message-time" title={formatTime(message.receivedAt)}>
                                                    {getTimeAgo(message.receivedAt)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="whatsapp-message-preview">
                                            {message.messageType && (
                                                <i className={`bi ${getMessageTypeIcon(message.messageType)}`}></i>
                                            )}
                                            {message.messageBody?.length > 30
                                                ? message.messageBody.substring(0, 30) + '...'
                                                : message.messageBody || 'Media message'}
                                        </div>
                                        <div className="whatsapp-message-status">
                                            {getStatusBadge(message.status || 'New')}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="whatsapp-chat-main">
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="whatsapp-chat-header">
                                <div className="whatsapp-chat-header-info">
                                    <div className="whatsapp-avatar" style={{ width: '40px', height: '40px', fontSize: '16px' }}>
                                        {getInitials(selectedConversation.customerName || selectedConversation.fromNumber)}
                                    </div>
                                    <div>
                                        <div className="fw-semibold">
                                            {selectedConversation.customerName || selectedConversation.fromNumber}
                                        </div>
                                        <small className="text-muted">
                                            {selectedConversation.customerName && selectedConversation.fromNumber}
                                            {selectedConversation.customerName && selectedConversation.orderNumber && ` • `}
                                            {selectedConversation.orderNumber && `Order: ${selectedConversation.orderNumber}`}
                                        </small>
                                    </div>
                                </div>
                                <div className="whatsapp-chat-header-actions">
                                    <button
                                        className="whatsapp-chat-header-btn"
                                        onClick={handleRefreshConversation}
                                        disabled={isRefreshingConversation}
                                        title="Refresh Conversation"
                                    >
                                        {isRefreshingConversation ? (
                                            <span className="spinner-border spinner-border-sm"></span>
                                        ) : (
                                            <i className="bi bi-arrow-clockwise"></i>
                                        )}
                                    </button>
                                    <button
                                        className="whatsapp-chat-header-btn"
                                        onClick={() => fetchMessageDetails(selectedConversation.id)}
                                        title="View Details"
                                    >
                                        <i className="bi bi-info-circle"></i>
                                    </button>
                                    <button
                                        className="whatsapp-chat-header-btn"
                                        onClick={() => handleUpdateStatus(selectedConversation)}
                                        title="Update Status"
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Messages Container */}
                            <div className="whatsapp-messages-container" ref={messagesContainerRef}>
                                {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                                    <React.Fragment key={date}>
                                        <div className="whatsapp-date-divider">
                                            <span className="whatsapp-date-label">{date}</span>
                                        </div>
                                        {dateMessages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className="whatsapp-message-bubble incoming"
                                                style={{ position: 'relative' }}
                                            >
                                                <div className="whatsapp-message-actions">
                                                    <button
                                                        className="whatsapp-message-action-btn"
                                                        onClick={() => handleRefreshMessage(msg)}
                                                        title="Refresh Message"
                                                    >
                                                        <i className="bi bi-arrow-clockwise"></i>
                                                    </button>
                                                    <button
                                                        className="whatsapp-message-action-btn"
                                                        onClick={() => fetchMessageDetails(msg.id)}
                                                        title="View Details"
                                                    >
                                                        <i className="bi bi-eye"></i>
                                                    </button>
                                                    <button
                                                        className="whatsapp-message-action-btn"
                                                        onClick={() => handleUpdateStatus(msg)}
                                                        title="Update Status"
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                </div>
                                                <p className="whatsapp-message-text">{msg.messageBody || '-'}</p>
                                                {msg.mediaUrl && (
                                                    <div className="whatsapp-message-media">
                                                        {msg.messageType === 'image' && (
                                                            <img 
                                                                src={msg.mediaUrl} 
                                                                alt="Message media" 
                                                                style={{ maxWidth: '100%', borderRadius: '4px', marginTop: '8px' }}
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.nextSibling.style.display = 'block';
                                                                }}
                                                            />
                                                        )}
                                                        {msg.messageType === 'video' && (
                                                            <video 
                                                                src={msg.mediaUrl} 
                                                                controls 
                                                                style={{ maxWidth: '100%', borderRadius: '4px', marginTop: '8px' }}
                                                            />
                                                        )}
                                                        {msg.messageType === 'audio' && (
                                                            <audio 
                                                                src={msg.mediaUrl} 
                                                                controls 
                                                                style={{ width: '100%', marginTop: '8px' }}
                                                            />
                                                        )}
                                                        {(msg.messageType === 'document' || !msg.messageType) && (
                                                            <a
                                                                href={msg.mediaUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="btn btn-sm btn-outline-primary mt-2"
                                                            >
                                                                <i className="bi bi-download me-1"></i>
                                                                Download {msg.mediaContentType || 'File'}
                                                            </a>
                                                        )}
                                                        <a
                                                            href={msg.mediaUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-sm btn-outline-secondary mt-2 ms-2"
                                                            style={{ display: msg.messageType === 'document' || !msg.messageType ? 'none' : 'inline-block' }}
                                                        >
                                                            <i className="bi bi-box-arrow-up-right me-1"></i>
                                                            Open
                                                        </a>
                                                    </div>
                                                )}
                                                <div className="whatsapp-message-footer">
                                                    <span className="whatsapp-message-time-footer">
                                                        {formatTime(msg.receivedAt)}
                                                    </span>
                                                    {getStatusBadge(msg.status || 'New')}
                                                </div>
                                            </div>
                                        ))}
                                    </React.Fragment>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Reply Input Area */}
                            <div className="whatsapp-reply-area">
                                {mediaPreview && (
                                    <div className="mb-2 p-2 bg-light rounded" style={{ position: 'relative' }}>
                                        <button
                                            className="btn btn-sm btn-danger position-absolute"
                                            style={{ top: '5px', right: '5px', zIndex: 10 }}
                                            onClick={handleRemoveMedia}
                                        >
                                            <i className="bi bi-x"></i>
                                        </button>
                                        {mediaPreview.type === 'image' && (
                                            <img src={mediaPreview.url} alt="Preview" style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '4px' }} />
                                        )}
                                        {mediaPreview.type === 'video' && (
                                            <video src={mediaPreview.url} controls style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '4px' }} />
                                        )}
                                        {mediaPreview.type === 'file' && (
                                            <div className="d-flex align-items-center gap-2">
                                                <i className="bi bi-file-earmark" style={{ fontSize: '24px' }}></i>
                                                <span>{mediaPreview.name}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="whatsapp-reply-input-container">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleMediaSelect}
                                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                                        style={{ display: 'none' }}
                                    />
                                    <button
                                        className="btn btn-sm"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isSendingReply || isUploadingMedia}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#54656f',
                                            padding: '8px'
                                        }}
                                        title="Attach Media"
                                    >
                                        <i className="bi bi-paperclip"></i>
                                    </button>
                                    <textarea
                                        className="whatsapp-reply-input"
                                        rows="1"
                                        value={replyText}
                                        onChange={(e) => {
                                            setReplyText(e.target.value);
                                            e.target.style.height = 'auto';
                                            e.target.style.height = e.target.scrollHeight + 'px';
                                        }}
                                        placeholder="Type a message..."
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                if (selectedMediaFile && !isUploadingMedia) {
                                                    handleUploadMedia();
                                                } else {
                                                    handleSendReply();
                                                }
                                            }
                                        }}
                                    ></textarea>
                                    <button
                                        className="whatsapp-reply-btn"
                                        onClick={() => {
                                            if (selectedMediaFile && !isUploadingMedia) {
                                                handleUploadMedia();
                                            } else {
                                                handleSendReply();
                                            }
                                        }}
                                        disabled={isSendingReply || isUploadingMedia || (!replyText.trim() && !selectedMediaFile)}
                                    >
                                        {(isSendingReply || isUploadingMedia) ? (
                                            <span className="spinner-border spinner-border-sm"></span>
                                        ) : (
                                            <i className="bi bi-send"></i>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="whatsapp-empty-state">
                            <i className="bi bi-chat-dots whatsapp-empty-state-icon"></i>
                            <h5>Select a conversation</h5>
                            <p>Choose a message from the list to start viewing the conversation</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Status Update Modal */}
            {createPortal(
                <div
                    id="statusModal"
                    className={`modal fade ${showStatusModal ? 'show' : ''}`}
                    tabIndex="-1"
                    role="dialog"
                    style={{
                        display: showStatusModal ? 'block' : 'none',
                        zIndex: 1055
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered" style={{ zIndex: 1056 }}>
                        <div className="modal-content shadow-lg">
                            <div className="modal-header bg-warning text-dark">
                                <h5 className="modal-title">
                                    <i className="bi bi-pencil-square me-2"></i>
                                    Update Message Status
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowStatusModal(false);
                                        setSelectedMessage(null);
                                        setSelectedStatus('');
                                        setStatusNotes('');
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {selectedMessage && (
                                    <>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Status:</label>
                                            <Dropdown
                                                name="status"
                                                value={selectedStatus}
                                                onChange={(value) => setSelectedStatus(value)}
                                                options={statusUpdateOptions}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Notes (Optional):</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={statusNotes}
                                                onChange={(e) => setStatusNotes(e.target.value)}
                                                placeholder="Add any notes about this status update..."
                                            ></textarea>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => {
                                        setShowStatusModal(false);
                                        setSelectedMessage(null);
                                        setSelectedStatus('');
                                        setStatusNotes('');
                                    }}
                                    disabled={isUpdatingStatus}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-warning btn-sm"
                                    onClick={handleSaveStatus}
                                    disabled={isUpdatingStatus || !selectedStatus}
                                >
                                    {isUpdatingStatus ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-circle me-2"></i>
                                            Update Status
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Message Details Modal */}
            {createPortal(
                <div
                    id="detailsModal"
                    className={`modal fade ${showDetailsModal ? 'show' : ''}`}
                    tabIndex="-1"
                    role="dialog"
                    style={{
                        display: showDetailsModal ? 'block' : 'none',
                        zIndex: 1055
                    }}
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered" style={{ zIndex: 1056 }}>
                        <div className="modal-content shadow-lg">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">
                                    <i className="bi bi-info-circle-fill me-2"></i>
                                    Message Details
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setMessageDetails(null);
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {messageDetails && (
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <strong>From:</strong>
                                            <p>{messageDetails.fromNumber}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <strong>To:</strong>
                                            <p>{messageDetails.toNumber}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <strong>Status:</strong>
                                            <p>{getStatusBadge(messageDetails.status)}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <strong>Message Type:</strong>
                                            <p>
                                                <i className={`bi ${getMessageTypeIcon(messageDetails.messageType)} me-2`}></i>
                                                {messageDetails.messageType || 'text'}
                                            </p>
                                        </div>
                                        <div className="col-12">
                                            <strong>Message:</strong>
                                            <p className="p-3 bg-light rounded">{messageDetails.messageBody || '-'}</p>
                                        </div>
                                        {messageDetails.mediaUrl && (
                                            <div className="col-12">
                                                <strong>Media:</strong>
                                                <div className="mt-2">
                                                    <a
                                                        href={messageDetails.mediaUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-sm btn-outline-primary"
                                                    >
                                                        <i className="bi bi-download me-2"></i>
                                                        View/Download Media
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                        {messageDetails.customerName && (
                                            <div className="col-md-6">
                                                <strong>Customer:</strong>
                                                <p>{messageDetails.customerName} (ID: {messageDetails.customerId})</p>
                                            </div>
                                        )}
                                        {messageDetails.orderNumber && (
                                            <div className="col-md-6">
                                                <strong>Order:</strong>
                                                <p>{messageDetails.orderNumber} (ID: {messageDetails.orderId})</p>
                                            </div>
                                        )}
                                        <div className="col-md-6">
                                            <strong>Received At:</strong>
                                            <p>{formatDate(messageDetails.receivedAt)}</p>
                                        </div>
                                        {messageDetails.repliedAt && (
                                            <div className="col-md-6">
                                                <strong>Replied At:</strong>
                                                <p>{formatDate(messageDetails.repliedAt)}</p>
                                            </div>
                                        )}
                                        {messageDetails.processedAt && (
                                            <div className="col-md-6">
                                                <strong>Processed At:</strong>
                                                <p>{formatDate(messageDetails.processedAt)}</p>
                                            </div>
                                        )}
                                        {messageDetails.notes && (
                                            <div className="col-12">
                                                <strong>Notes:</strong>
                                                <p className="p-3 bg-light rounded">{messageDetails.notes}</p>
                                            </div>
                                        )}
                                        {messageDetails.errorMessage && (
                                            <div className="col-12">
                                                <strong className="text-danger">Error Message:</strong>
                                                <p className="p-3 bg-danger bg-opacity-10 text-danger rounded">
                                                    {messageDetails.errorMessage}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setMessageDetails(null);
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Backdrop for modals */}
            {(showStatusModal || showDetailsModal) && createPortal(
                <div
                    className="modal-backdrop fade show"
                    style={{ zIndex: 1054 }}
                    onClick={() => {
                        setShowStatusModal(false);
                        setShowDetailsModal(false);
                        setSelectedMessage(null);
                        setMessageDetails(null);
                        setStatusNotes('');
                        setSelectedStatus('');
                    }}
                ></div>,
                document.body
            )}
        </>
    );
}
