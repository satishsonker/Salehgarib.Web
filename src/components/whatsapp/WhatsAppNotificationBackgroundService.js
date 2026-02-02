import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb';
import TableView from '../tables/TableView';
import { use } from 'react';

export default function WhatsAppNotificationBackgroundService() {
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);

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

    const handleSearch = (searchTerm) => {
        if (searchTerm !== null && searchTerm.length > 0 && searchTerm.length < 3)
            return;
        const url = searchTerm && searchTerm.length > 0
            ? `${apiUrls.WhatsappNotificationBackgroundServiceController.search}?searchTerm=${searchTerm}&pageNo=${pageNo}&pageSize=${pageSize}`
            : `${apiUrls.WhatsappNotificationBackgroundServiceController.getAll}?pageNo=${pageNo}&pageSize=${pageSize}`;

        Api.Get(url).then(res => {
            tableOptionTemplet.data = res.data.data || [];
            tableOptionTemplet.totalRecords = res.data.totalRecords || 0;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {
            toast.error(toastMessage.loadError);
        });
    }

    useEffect(() => {

        Api.Get(`${apiUrls.WhatsappNotificationBackgroundServiceController.getAll}?pageNo=${pageNo}&pageSize=${pageSize}`)
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
            { name: 'Status', prop: 'serviceStatus' },
            {
                name: 'Next Run', prop: 'nextRunning', customColumn: (data) => {
                    return data?.nextRunning ? common.getHtmlDate(data.nextRunning, 'ddmmyyyyhhmmss') : '-';
                }
            },
            {
                name: 'Service Enabled', prop: 'isServiceEnable', customColumn: (data) => {
                    return data?.isServiceEnable ? 'Yes' : 'No';
                }
            },
            { name: 'Comments', prop: 'comments' }
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
        title: 'WhatsApp Notification Background Service',
        items: [
            {
                title: "WhatsApp Notification Background Service",
                icon: "bi bi-gear",
                isActive: false,
            }
        ],
        buttons: []
    }

    useEffect(() => {
        handleSearch('');
    }, [pageNo, pageSize]);

    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Notification Background Service</h6>
            <hr />
            <TableView option={tableOption}></TableView>
        </>
    );
}
