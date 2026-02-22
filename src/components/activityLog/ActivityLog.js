import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb';
import TableView from '../tables/TableView';
import Inputbox from '../common/Inputbox';
import Dropdown from '../common/Dropdown';
import ButtonBox from '../common/ButtonBox';
import Label from '../common/Label';

export default function ActivityLog() {
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        activityType: '',
        userIdentifier: '',
        userType: '',
        fromDate: '',
        toDate: '',
        isSuccess: '',
        searchText: ''
    });

    // Activity type options
    const activityTypeOptions = [
        { id: '', value: 'All Types' },
        { id: 1, value: 'UserLogin' },
        { id: 2, value: 'UserLogout' },
        { id: 3, value: 'MasterAccessLogin' },
        { id: 4, value: 'MasterAccessLogout' }
    ];

    // User type options
    const userTypeOptions = [
        { id: '', value: 'All Users' },
        { id: 'User', value: 'User' },
        { id: 'MasterAccess', value: 'MasterAccess' }
    ];

    // Success status options
    const successStatusOptions = [
        { id: '', value: 'All' },
        { id: true, value: 'Success' },
        { id: false, value: 'Failed' }
    ];

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = (searchText) => {
        if (searchText && searchText.length > 0 && searchText.length < 3) {
            return;
        }
        
        setFilters(prev => ({
            ...prev,
            searchText: searchText || ''
        }));
        
        // Reset to page 1 when searching
        setPageNo(1);
        loadActivityLogs(1, pageSize, searchText || '');
    };

    const loadActivityLogs = (page = pageNo, size = pageSize, search = searchTerm) => {
        // Build query parameters
        let queryParams = `PageNo=${page}&PageSize=${size}`;
        
        // Add filters if they have values
        if (filters.activityType) {
            queryParams += `&ActivityType=${filters.activityType}`;
        }
        if (filters.userIdentifier) {
            queryParams += `&UserIdentifier=${encodeURIComponent(filters.userIdentifier)}`;
        }
        if (filters.userType) {
            queryParams += `&UserType=${filters.userType}`;
        }
        if (filters.fromDate) {
            // Convert datetime-local format to ISO 8601 format
            const fromDateISO = new Date(filters.fromDate).toISOString();
            queryParams += `&FromDate=${encodeURIComponent(fromDateISO)}`;
        }
        if (filters.toDate) {
            // Convert datetime-local format to ISO 8601 format
            const toDateISO = new Date(filters.toDate).toISOString();
            queryParams += `&ToDate=${encodeURIComponent(toDateISO)}`;
        }
        if (filters.isSuccess !== '') {
            queryParams += `&IsSuccess=${filters.isSuccess}`;
        }
        if (search || filters.searchText) {
            queryParams += `&SearchText=${encodeURIComponent(search || filters.searchText)}`;
        }

        // Use search endpoint if any filters are applied, otherwise use getAll
        const hasFilters = filters.activityType || filters.userIdentifier || filters.userType || 
                          filters.fromDate || filters.toDate || filters.isSuccess !== '' || 
                          search || filters.searchText;
        
        const endpoint = hasFilters 
            ? `${apiUrls.activityLogController.search}?${queryParams}`
            : `${apiUrls.activityLogController.getAll}?${queryParams}`;

        Api.Get(endpoint)
            .then(res => {
                tableOptionTemplet.data = res.data.data || [];
                tableOptionTemplet.totalRecords = res.data.totalRecords || 0;
                setTableOption({ ...tableOptionTemplet });
            })
            .catch(err => {
                console.error('Error loading activity logs:', err);
                tableOptionTemplet.data = [];
                tableOptionTemplet.totalRecords = 0;
                setTableOption({ ...tableOptionTemplet });
            });
    };

    const handleApplyFilters = () => {
        setPageNo(1);
        loadActivityLogs(1, pageSize, '');
    };

    const handleResetFilters = () => {
        setFilters({
            activityType: '',
            userIdentifier: '',
            userType: '',
            fromDate: '',
            toDate: '',
            isSuccess: '',
            searchText: ''
        });
        setSearchTerm('');
        setPageNo(1);
        loadActivityLogs(1, pageSize, '');
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    };

    const getStatusBadge = (isSuccess) => {
        if (isSuccess === true || isSuccess === 'true') {
            return <span className="badge bg-success">Success</span>;
        }
        return <span className="badge bg-danger">Failed</span>;
    };

    const tableOptionTemplet = {
        headers: [
            { 
                name: 'Activity Type', 
                prop: 'activityTypeName',
                action: { dAlign: 'left' }
            },
            { 
                name: 'User', 
                prop: 'userName',
                action: { dAlign: 'left' }
            },
            { 
                name: 'User Identifier', 
                prop: 'userIdentifier',
                action: { dAlign: 'left' }
            },
            { 
                name: 'User Type', 
                prop: 'userType',
                action: { dAlign: 'center' }
            },
            { 
                name: 'IP Address', 
                prop: 'ipAddress',
                action: { dAlign: 'left' }
            },
            { 
                name: 'Description', 
                prop: 'description',
                action: { dAlign: 'left' }
            },
            { 
                name: 'Status', 
                prop: 'isSuccess',
                customColumn: (dataRow) => getStatusBadge(dataRow.isSuccess),
                action: { dAlign: 'center' }
            },
            { 
                name: 'Activity Date', 
                prop: 'activityDate',
                customColumn: (dataRow) => formatDate(dataRow.activityDate),
                action: { dAlign: 'left' }
            }
        ],
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        searchTerm: searchTerm,
        setSearchTerm: setSearchTerm,
        showAction: false,
        showSerialNo: true
    };

    const [tableOption, setTableOption] = useState(tableOptionTemplet);

    useEffect(() => {
        loadActivityLogs(pageNo, pageSize, searchTerm);
    }, [pageNo, pageSize]);

    const breadcrumbOption = {
        title: 'Activity Log',
        items: [
            {
                title: "User Activity Log",
                icon: "bi bi-clock-history",
                isActive: false,
            }
        ]
    };

    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">User Activity Log</h6>
            <hr />
            
            {/* Filter Section */}
            <div className="card mb-4">
                <div className="card-header">
                    <h6 className="mb-0">Filters</h6>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-3">
                            <Label text="Activity Type" />
                            <Dropdown 
                                data={activityTypeOptions} 
                                defaultText="All Types" 
                                name="activityType" 
                                defaultValue='' 
                                onChange={handleFilterChange} 
                                value={filters.activityType}
                            />
                        </div>
                        <div className="col-md-3">
                            <Label text="User Type" />
                            <Dropdown 
                                data={userTypeOptions} 
                                defaultText="All Users" 
                                name="userType" 
                                defaultValue='' 
                                onChange={handleFilterChange} 
                                value={filters.userType}
                            />
                        </div>
                        <div className="col-md-3">
                            <Label text="Status" />
                            <Dropdown 
                                data={successStatusOptions} 
                                defaultText="All" 
                                name="isSuccess" 
                                defaultValue='' 
                                onChange={handleFilterChange} 
                                value={filters.isSuccess}
                            />
                        </div>
                        <div className="col-md-3">
                            <Inputbox
                                type="text"
                                name="userIdentifier"
                                labelText="User Identifier"
                                placeholder="Email or username"
                                value={filters.userIdentifier}
                                onChangeHandler={handleFilterChange}
                                showLabel={true}
                            />
                        </div>
                        <div className="col-md-3">
                            <Label text="From Date" />
                            <input
                                type="datetime-local"
                                name="fromDate"
                                className="form-control"
                                value={filters.fromDate}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="col-md-3">
                            <Label text="To Date" />
                            <input
                                type="datetime-local"
                                name="toDate"
                                className="form-control"
                                value={filters.toDate}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex gap-2 align-items-end h-100">
                                <ButtonBox
                                    type="save"
                                    text="Apply Filters"
                                    onClickHandler={handleApplyFilters}
                                    icon="bi bi-funnel-fill"
                                />
                                <ButtonBox
                                    type="reset"
                                    text="Reset"
                                    onClickHandler={handleResetFilters}
                                    icon="bi bi-arrow-clockwise"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <TableView option={tableOption}></TableView>
        </>
    )
}
