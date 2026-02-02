import React, { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb';
import TableView from '../tables/TableView';
import './WhatsAppQueue.css';

// Countdown Timer Component
const CountdownTimer = ({ scheduledAt }) => {
    const [timeRemaining, setTimeRemaining] = useState('');

    useEffect(() => {
        if (!scheduledAt) {
            setTimeRemaining('-');
            return;
        }

        const updateTimer = () => {
            try {
                // Parse the scheduled date - API returns date in UTC+4 timezone
                let scheduledDate = new Date(scheduledAt);
                
                // If the date string doesn't have timezone indicator (Z, +, or -HH:MM), 
                // treat it as UTC and add 4 hours to convert to UTC+4
                const hasTimezone = scheduledAt.includes('Z') || 
                                   scheduledAt.includes('+') || 
                                   scheduledAt.match(/[+-]\d{2}:\d{2}$/);
                
                if (!hasTimezone) {
                    // Assume UTC and convert to UTC+4
                    scheduledDate = new Date(scheduledDate.getTime() + (4 * 60 * 60 * 1000));
                }
                
                // Get current UTC time and convert to UTC+4 for comparison
                const now = new Date();
                const nowUtc = Date.UTC(
                    now.getUTCFullYear(),
                    now.getUTCMonth(),
                    now.getUTCDate(),
                    now.getUTCHours(),
                    now.getUTCMinutes(),
                    now.getUTCSeconds(),
                    now.getUTCMilliseconds()
                );
                const nowUtc4 = nowUtc + (4 * 60 * 60 * 1000);
                
                const diff = scheduledDate.getTime() - nowUtc4;

                if (diff <= 0) {
                    setTimeRemaining('Expired');
                    return;
                }

                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                if (days > 0) {
                    setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
                } else if (hours > 0) {
                    setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
                } else if (minutes > 0) {
                    setTimeRemaining(`${minutes}m ${seconds}s`);
                } else {
                    setTimeRemaining(`${seconds}s`);
                }
            } catch (error) {
                setTimeRemaining('Invalid date');
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [scheduledAt]);

    return <span>{timeRemaining}</span>;
};

export default function WhatsAppQueue() {
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [viewJsonData, setViewJsonData] = useState(null);
    const [viewErrorData, setViewErrorData] = useState(null);

    const handleDelete = (id) => {
        Api.Delete(apiUrls.WhatsappNotificationBackgroundServiceController.delete + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        }).catch(err => {
            toast.error(toastMessage.deleteError);
        });
    }

    const handleRetry = (id) => {
        if (window.confirm('Are you sure you want to retry this failed message?')) {
            Api.Post(apiUrls.whatsAppMessageQueueController.retryMessages, { MessageIds: [id] }).then(res => {
                if (res.data) {
                    handleSearch('');
                    toast.success('Message retry initiated successfully');
                }
            }).catch(err => {
                toast.error('Failed to retry message');
            });
        }
    }

    const handleSearch = (searchTerm) => {
        if (searchTerm !== null && searchTerm.length > 0 && searchTerm.length < 3)
            return;
        const url = searchTerm && searchTerm.length > 0
            ? `${apiUrls.whatsAppMessageQueueController.search}?searchTerm=${searchTerm}&pageNo=${pageNo}&pageSize=${pageSize}`
            : `${apiUrls.whatsAppMessageQueueController.getQueueMessages}?pageNo=${pageNo}&pageSize=${pageSize}`;

        Api.Get(url).then(res => {
            tableOptionTemplet.data = res.data.data || [];
            tableOptionTemplet.totalRecords = res.data.totalRecords || 0;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {
            toast.error(toastMessage.loadError);
        });
    }

    useEffect(() => {
        Api.Get(`${apiUrls.whatsAppMessageQueueController.getQueueMessages}?pageNo=${pageNo}&pageSize=${pageSize}`)
            .then(res => {
                tableOptionTemplet.data = res.data.data || [];
                tableOptionTemplet.totalRecords = res.data.totalRecords || 0;
                setTableOption({ ...tableOptionTemplet });
            })
            .catch(err => {
                toast.error(toastMessage.loadError);
            });
    }, [])


    const tableOptionTemplet = {
        headers: [
            { name: 'ID', prop: 'id' },
            { name: 'Message Category', prop: 'messageCategory' , customColumn: (data) => {
                return data?.messageCategory ?? 'Utility';
            }},
            { name: 'Message Type', prop: 'messageType' , customColumn: (data) => {
                return data?.messageType ?? 'Utility';
            }},
            { name: 'Order Number', prop: 'orderNumber' },
            { name: 'Customer', prop: 'toNumber', customColumn: (data) => {
                return `${data?.customerName?.toUpperCase() || 'Unknown'} (${data?.toNumber || 'No Number'})`;
            }},
            { name: 'Status', prop: 'currentStatusStr' , customColumn: (data) => {
               if(data?.currentStatusStr === "Failed"){
                   return (
                       <div className="d-flex align-items-center gap-2">
                           <span title='Message did not sent' className="badge bg-danger">{data?.currentStatusStr}</span>
                           <i 
                               className="bi bi-arrow-clockwise text-warning" 
                               style={{ cursor: 'pointer', fontSize: '18px' }}
                               title="Retry message"
                               onClick={(e) => {
                                   e.stopPropagation();
                                   handleRetry(data.id);
                               }}
                           ></i>
                       </div>
                   );
               }
                else if(data?.currentStatusStr === "Sent"){
                    return <span title='Message sent to whatsapp' className="badge bg-success">{data?.currentStatusStr}</span>;
                }
                else if(data?.currentStatusStr === "Processing"){
                    return <span title='Message is being processed' className="badge bg-warning text-dark">{data?.currentStatusStr}</span>;
                }
                else if(data?.currentStatusStr === "Pending"){
                    return <span title='Message in queue state' className="badge bg-primary text-light">{data?.currentStatusStr}</span>;
                }
            }},
            { name: 'Schedule At', prop: 'scheduledAt', customColumn: (data) => {
                if (!data?.scheduledAt) return '-';
                const scheduledDate = new Date(data.scheduledAt);
                const utc4Date = new Date(scheduledDate.getTime() + (4 * 60 * 60 * 1000));
                const formattedDate = common.getHtmlDate(utc4Date, 'ddmmyyyyhhmmss');
                return (
                    <div>
                        <div>{formattedDate}</div>
                        <div className="text-info small">
                            <CountdownTimer scheduledAt={data.scheduledAt} />
                        </div>
                    </div>
                );
            }},
            { name: 'Attempts', prop: 'retryCount' },
            { name: 'Last Attempt', prop: 'lastRetry', customColumn: (data) => {
                return data?.lastRetry ? common.getHtmlDate(data.lastRetry, 'ddmmyyyyhhmmss') : '-';
            }},
            {
                name: 'Processed At', prop: 'processedAt', customColumn: (data) => {
                    return data?.processedAt ? common.getHtmlDate(data.processedAt, 'ddmmyyyyhhmmss') : 'Scheduled';
                }
            },
            {
                name: 'Has Attachment', prop: 'hasAttachment', customColumn: (data) => {
                    return data?.hasAttachment ? <>
                <a href={`https://api.labeachdubai.com/LabeachDubaiApi/Receipts/${data?.orderNumber}.pdf`} target="_blank" rel="noopener noreferrer">
                    <i style={{fontSize:"18px"}} title='Download Attachment' className="bi bi-download text-success"></i>
                </a>
                    </> : <>
                    <i style={{fontSize:"18px"}} className="bi bi-x-circle text-danger"></i>
                    </>;
                }
            },
            { name: 'Variable Data', prop: 'variableData', customColumn: (data) => {
                if (!data?.variableData) return '-';
                return (
                    <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            setViewJsonData(data.variableData);
                        }}
                        data-bs-toggle="modal"
                        data-bs-target="#viewJsonModal"
                    >
                        <i className="bi bi-eye"></i> View
                    </button>
                );
            }},
            { name: 'Error Message', prop: 'errorMessage', customColumn: (data) => {
                if (!data?.errorMessage) return '-';
                return (
                    <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={(e) => {
                            e.stopPropagation();
                            setViewErrorData(data.errorMessage);
                        }}
                        data-bs-toggle="modal"
                        data-bs-target="#viewErrorModal"
                    >
                        <i className="bi bi-exclamation-triangle"></i> View
                    </button>
                );
            }}
        ],
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            showView: false,
            showEdit: false,
            delete: {
                handler: handleDelete
            }
        }
    };

    const [tableOption, setTableOption] = useState(tableOptionTemplet);

    const breadcrumbOption = {
        title: 'WhatsApp Message Queue',
        items: [
            {
                title: "WhatsApp Message Queue",
                icon: "bi bi-gear",
                isActive: false,
            }
        ],
        buttons: []
    }

    useEffect(() => {
        handleSearch('');
    }, [pageNo, pageSize]);

    const formatJson = (jsonString) => {
        try {
            const parsed = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
            return JSON.stringify(parsed, null, 2);
        } catch (e) {
            return jsonString;
        }
    };

    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">WhatsApp Message Queue</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* View JSON Modal - Rendered via Portal */}
            {createPortal(
                <div 
                    id="viewJsonModal" 
                    className="modal fade view-json-modal" 
                    tabIndex="-1" 
                    role="dialog" 
                    aria-labelledby="viewJsonModalLabel" 
                    aria-hidden="true"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    style={{ zIndex: 99999 }}
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered" style={{ zIndex: 100000 }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="viewJsonModalLabel">
                                    <i className="bi bi-code-square"></i> Variable Data (JSON)
                                </h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true" onClick={() => setViewJsonData(null)}></button>
                            </div>
                            <div className="modal-body">
                                {viewJsonData ? (
                                    <pre style={{ 
                                        backgroundColor: '#f8f9fa', 
                                        padding: '15px', 
                                        borderRadius: '5px',
                                        maxHeight: '500px',
                                        overflow: 'auto',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                        fontSize: '13px',
                                        fontFamily: 'monospace'
                                    }}>
                                        {formatJson(viewJsonData)}
                                    </pre>
                                ) : (
                                    <p>No data available</p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal" onClick={() => setViewJsonData(null)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* View Error Message Modal - Rendered via Portal */}
            {createPortal(
                <div 
                    id="viewErrorModal" 
                    className="modal fade view-error-modal" 
                    tabIndex="-1" 
                    role="dialog" 
                    aria-labelledby="viewErrorModalLabel" 
                    aria-hidden="true"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    style={{ zIndex: 99999 }}
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered" style={{ zIndex: 100000 }}>
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title" id="viewErrorModalLabel">
                                    <i className="bi bi-exclamation-triangle-fill"></i> Error Message
                                </h5>
                                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-hidden="true" onClick={() => setViewErrorData(null)}></button>
                            </div>
                            <div className="modal-body">
                                {viewErrorData ? (
                                    <div style={{ 
                                        backgroundColor: '#fff3cd', 
                                        padding: '15px', 
                                        borderRadius: '5px',
                                        border: '1px solid #ffc107',
                                        maxHeight: '500px',
                                        overflow: 'auto',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                        fontSize: '14px'
                                    }}>
                                        {viewErrorData}
                                    </div>
                                ) : (
                                    <p>No error message available</p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal" onClick={() => setViewErrorData(null)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
