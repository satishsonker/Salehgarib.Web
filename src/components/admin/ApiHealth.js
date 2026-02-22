import React, { useState, useEffect } from 'react';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toast } from 'react-toastify';
import Breadcrumb from '../common/Breadcrumb';
import Loader from '../common/Loader';

export default function ApiHealth() {
    const [healthData, setHealthData] = useState(null);
    const [databaseInfo, setDatabaseInfo] = useState(null);
    const [apiVersion, setApiVersion] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(null);

    useEffect(() => {
        // Load all data on initial mount
        loadAllData();
        // Auto-refresh only health check every 30 seconds
        const interval = setInterval(() => {
            refreshHealthCheck();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    // Load all data (health, database, version) - used on initial load and manual refresh
    const loadAllData = () => {
        setIsLoading(true);
        Promise.all([
            Api.Get(apiUrls.healthController.getHealth),
            Api.Get(apiUrls.healthController.getDatabaseName),
            Api.Get(apiUrls.healthController.getApiVersion)
        ])
        .then(responses => {
                setHealthData(responses[0].data || null);
                setDatabaseInfo(responses[1].data || null);
                // API version might be a string response or wrapped in data
                const versionResponse = responses[2].data || responses[2] || null;
                setApiVersion(versionResponse);
                setLastRefresh(new Date());
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Error loading health data:', err);
                toast.error('Failed to load API health data');
                setIsLoading(false);
            });
    };

    // Refresh only the health check - used for auto-refresh
    const refreshHealthCheck = () => {
        Api.Get(apiUrls.healthController.getHealth)
            .then(response => {
                setHealthData(response.data || null);
                setLastRefresh(new Date());
            })
            .catch(err => {
                console.error('Error refreshing health check:', err);
                // Don't show toast on auto-refresh to avoid spam
            });
    };

    const getStatusBadgeClass = (status) => {
        if (!status) return 'badge bg-secondary';
        const statusLower = status.toLowerCase();
        if (statusLower === 'healthy') {
            return 'badge bg-success';
        } else if (statusLower === 'unhealthy' || statusLower === 'degraded') {
            return 'badge bg-danger';
        } else {
            return 'badge bg-warning';
        }
    };

    const formatDuration = (duration) => {
        if (!duration) return 'N/A';
        // New format: duration is an object with formatted, milliseconds, seconds
        if (typeof duration === 'object' && duration.formatted) {
            return duration.formatted;
        }
        // Old format: duration is a string "00:00:00.3011818"
        if (typeof duration === 'string') {
            const parts = duration.split('.');
            if (parts.length > 1) {
                const timePart = parts[0];
                const msPart = parts[1].substring(0, 3);
                return `${timePart}.${msPart}s`;
            }
            return duration;
        }
        return 'N/A';
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';
        try {
            const date = new Date(timestamp);
            return date.toLocaleString();
        } catch (e) {
            return timestamp;
        }
    };

    const breadcrumbOption = {
        title: 'API Health',
        items: [
            {
                name: 'API Health',
                title: 'API Health',
                icon: 'bi bi-heart-pulse',
                isActive: true,
                link: '/admin/api-health'
            }
        ]
    };

    return (
        <>
            <Breadcrumb option={breadcrumbOption} />
            
            <div className="row mb-3">
                <div className="col-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-3">
                            <h5 className="card-title mb-0 fw-bold">
                                <i className="bi bi-heart-pulse me-2 text-danger"></i>
                                API Health Status
                            </h5>
                            <div className="d-flex align-items-center gap-3">
                                {lastRefresh && (
                                    <small className="text-muted">
                                        <i className="bi bi-clock me-1"></i>
                                        {lastRefresh.toLocaleTimeString()}
                                    </small>
                                )}
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={loadAllData}
                                    disabled={isLoading}
                                >
                                    <i className={`bi bi-arrow-clockwise me-1 ${isLoading ? 'spinner-border spinner-border-sm' : ''}`}></i>
                                    Refresh All
                                </button>
                            </div>
                        </div>
                        <div className="card-body p-4">
                            {isLoading ? (
                                <div className="py-5">
                                    <div className="text-center mb-4">
                                        <Loader show={true} variant="inline" size="large" message="Checking API Health..." />
                                    </div>
                                    
                                    {/* Skeleton Loaders */}
                                    <div className="row mt-4">
                                        <div className="col-12 mb-3">
                                            <div className="skeleton-card shimmer-effect"></div>
                                        </div>
                                    </div>
                                    
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <div className="card border-0 shadow-sm h-100">
                                                <div className="card-body p-3">
                                                    <div className="skeleton-line shimmer-effect" style={{ height: '20px', width: '60%', marginBottom: '10px' }}></div>
                                                    <div className="skeleton-line shimmer-effect" style={{ height: '24px', width: '80%' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <div className="card border-0 shadow-sm h-100">
                                                <div className="card-body p-3">
                                                    <div className="skeleton-line shimmer-effect" style={{ height: '20px', width: '60%', marginBottom: '10px' }}></div>
                                                    <div className="skeleton-line shimmer-effect" style={{ height: '24px', width: '80%' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <div className="card border-0 shadow-sm h-100">
                                                <div className="card-body p-3">
                                                    <div className="skeleton-line shimmer-effect" style={{ height: '20px', width: '60%', marginBottom: '10px' }}></div>
                                                    <div className="skeleton-line shimmer-effect" style={{ height: '24px', width: '80%' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <style>{`
                                        .skeleton-card {
                                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                            height: 150px;
                                            border-radius: 10px;
                                        }
                                        
                                        .skeleton-line {
                                            background: linear-gradient(90deg, #e9ecef 25%, #f5f5f5 50%, #e9ecef 75%);
                                            background-size: 200% 100%;
                                            border-radius: 4px;
                                        }
                                        
                                        .shimmer-effect {
                                            animation: shimmer 1.5s ease-in-out infinite;
                                        }
                                        
                                        @keyframes shimmer {
                                            0% {
                                                background-position: -200% 0;
                                            }
                                            100% {
                                                background-position: 200% 0;
                                            }
                                        }
                                    `}</style>
                                </div>
                            ) : (
                                <>
                                    {/* Overall Status Card */}
                                    {healthData && (
                                        <div className="row mb-4">
                                            <div className="col-12">
                                                <div className="card border-0 shadow-sm mb-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                                    <div className="card-body text-white p-4">
                                                        <div className="row align-items-center">
                                                            <div className="col-md-8">
                                                                <h4 className="mb-2 fw-bold">System Status</h4>
                                                                <div className="d-flex align-items-center gap-3 mb-2">
                                                                    <span className={`badge ${getStatusBadgeClass(healthData.status)} fs-6 px-3 py-2`}>
                                                                        {healthData.status || 'Unknown'}
                                                                    </span>
                                                                    {healthData.timestamp && (
                                                                        <small className="opacity-75">
                                                                            <i className="bi bi-calendar3 me-1"></i>
                                                                            {formatTimestamp(healthData.timestamp)}
                                                                        </small>
                                                                    )}
                                                                </div>
                                                                {healthData.application && (
                                                                    <div className="mt-2">
                                                                        <small className="opacity-75">
                                                                            <i className="bi bi-app me-1"></i>
                                                                            {healthData.application.name} v{healthData.application.version}
                                                                        </small>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {healthData.summary && (
                                                                <div className="col-md-4 text-end">
                                                                    <div className="bg-dark bg-opacity-30 rounded p-3 d-inline-block">
                                                                        <div className="mb-2">
                                                                            <small className="text-white opacity-90 d-block">Total Checks</small>
                                                                            <h3 className="mb-0 fw-bold text-white">{healthData.summary.totalChecks || 0}</h3>
                                                                        </div>
                                                                        <div className="d-flex gap-3 justify-content-end">
                                                                            <div>
                                                                                <small className="text-white opacity-90 d-block">Healthy</small>
                                                                                <strong className="text-white">{healthData.summary.healthy || 0}</strong>
                                                                            </div>
                                                                            {healthData.summary.degraded > 0 && (
                                                                                <div>
                                                                                    <small className="text-white opacity-90 d-block">Degraded</small>
                                                                                    <strong className="text-warning">{healthData.summary.degraded || 0}</strong>
                                                                                </div>
                                                                            )}
                                                                            {healthData.summary.unhealthy > 0 && (
                                                                                <div>
                                                                                    <small className="text-white opacity-90 d-block">Unhealthy</small>
                                                                                    <strong className="text-danger">{healthData.summary.unhealthy || 0}</strong>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Information Cards Row */}
                                    <div className="row mb-4">
                                        {healthData?.environment && (
                                            <div className="col-md-4 mb-3">
                                                <div className="card border-0 shadow-sm h-100">
                                                    <div className="card-body p-3">
                                                        <div className="d-flex align-items-center mb-2">
                                                            <div className="widget-icon-large bg-gradient-info text-white me-3 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px', borderRadius: '10px' }}>
                                                                <i className="bi bi-server"></i>
                                                            </div>
                                                            <div>
                                                                <label className="form-label text-muted small mb-0">Environment</label>
                                                                <h6 className="mb-0 fw-bold">{healthData.environment.name || healthData.environment.configValue || 'N/A'}</h6>
                                                            </div>
                                                        </div>
                                                        <small className="text-muted">
                                                            {healthData.environment.isDevelopment ? 'Development' : 
                                                             healthData.environment.isProduction ? 'Production' : 'Other'}
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {healthData?.application && (
                                            <div className="col-md-4 mb-3">
                                                <div className="card border-0 shadow-sm h-100">
                                                    <div className="card-body p-3">
                                                        <div className="d-flex align-items-center mb-2">
                                                            <div className="widget-icon-large bg-gradient-success text-white me-3 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px', borderRadius: '10px' }}>
                                                                <i className="bi bi-app-indicator"></i>
                                                            </div>
                                                            <div>
                                                                <label className="form-label text-muted small mb-0">Application</label>
                                                                <h6 className="mb-0 fw-bold">{healthData.application.name || 'N/A'}</h6>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2">
                                                            <small className="text-muted d-block">Version: {healthData.application.version || 'N/A'}</small>
                                                            {healthData.application.uptime && (
                                                                <small className="text-muted d-block">
                                                                    <i className="bi bi-clock-history me-1"></i>
                                                                    Uptime: {healthData.application.uptime.formatted || 'N/A'}
                                                                </small>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {apiVersion && (
                                            <div className="col-md-4 mb-3">
                                                <div className="card border-0 shadow-sm h-100">
                                                    <div className="card-body p-3">
                                                        <div className="d-flex align-items-center mb-2">
                                                            <div className="widget-icon-large bg-gradient-warning text-white me-3 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px', borderRadius: '10px' }}>
                                                                <i className="bi bi-tag"></i>
                                                            </div>
                                                            <div>
                                                                <label className="form-label text-muted small mb-0">API Version</label>
                                                                <h6 className="mb-0 fw-bold">
                                                                    {typeof apiVersion === 'string' ? apiVersion : (apiVersion.version || 'N/A')}
                                                                </h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Database Information */}
                                    {databaseInfo && (
                                        <div className="row mb-4">
                                            <div className="col-12">
                                                <h6 className="mb-3 fw-bold">
                                                    <i className="bi bi-database me-2"></i>
                                                    Database Information
                                                </h6>
                                                <div className="row">
                                                    <div className="col-md-4 mb-3">
                                                        <div className="card border-0 shadow-sm h-100">
                                                            <div className="card-body p-3">
                                                                <label className="form-label text-muted small mb-2">
                                                                    <i className="bi bi-database me-1"></i>
                                                                    Database Name
                                                                </label>
                                                                <p className="mb-0 fw-bold fs-6">{databaseInfo.databaseName || 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 mb-3">
                                                        <div className="card border-0 shadow-sm h-100">
                                                            <div className="card-body p-3">
                                                                <label className="form-label text-muted small mb-2">
                                                                    <i className="bi bi-hdd-network me-1"></i>
                                                                    Database Source
                                                                </label>
                                                                <p className="mb-0 fw-bold fs-6">{databaseInfo.databaseSource || 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 mb-3">
                                                        <div className="card border-0 shadow-sm h-100">
                                                            <div className="card-body p-3">
                                                                <label className="form-label text-muted small mb-2">
                                                                    <i className="bi bi-diagram-3 me-1"></i>
                                                                    Branch Name
                                                                </label>
                                                                <p className="mb-0 fw-bold fs-6">{databaseInfo.branchName || 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Health Checks Table */}
                                    {healthData?.checks && healthData.checks.length > 0 && (
                                        <div className="row">
                                            <div className="col-12">
                                                <h6 className="mb-3 fw-bold">
                                                    <i className="bi bi-list-check me-2"></i>
                                                    Health Checks
                                                </h6>
                                                <div className="card border-0 shadow-sm">
                                                    <div className="card-body p-0">
                                                        <div className="table-responsive">
                                                            <table className="table table-hover mb-0">
                                                                <thead className="table-light">
                                                                    <tr>
                                                                        <th className="ps-3">Check Name</th>
                                                                        <th>Status</th>
                                                                        <th>Description</th>
                                                                        <th>Duration</th>
                                                                        <th>Tags</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {healthData.checks.map((check, index) => (
                                                                        <tr key={index}>
                                                                            <td className="ps-3">
                                                                                <strong>{check.name || 'N/A'}</strong>
                                                                            </td>
                                                                            <td>
                                                                                <span className={getStatusBadgeClass(check.status)}>
                                                                                    {check.status || 'Unknown'}
                                                                                </span>
                                                                            </td>
                                                                            <td className="text-muted">{check.description || '-'}</td>
                                                                            <td>
                                                                                <span className="badge bg-light text-dark">
                                                                                    {formatDuration(check.duration)}
                                                                                </span>
                                                                            </td>
                                                                            <td>
                                                                                {check.tags && check.tags.length > 0 ? (
                                                                                    check.tags.map((tag, tagIndex) => (
                                                                                        <span key={tagIndex} className="badge bg-secondary me-1">
                                                                                            {tag}
                                                                                        </span>
                                                                                    ))
                                                                                ) : (
                                                                                    <span className="text-muted">-</span>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {!healthData && !databaseInfo && !apiVersion && (
                                        <div className="text-center py-5">
                                            <i className="bi bi-exclamation-circle text-muted" style={{ fontSize: '3rem' }}></i>
                                            <p className="mt-3 text-muted">No health data available</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
