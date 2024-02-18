import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Api } from '../../apis/Api'
import { apiUrls } from '../../apis/ApiUrls'
import { toastMessage } from '../../constants/ConstantValues'
import Breadcrumb from '../common/Breadcrumb'
import TableView from '../tables/TableView'
import CancelEmployeePopup from '../Popups/CancelEmployeePopup'

export default function EmployeeActive() {
    const [selectedEmpData, setSelectedEmpData] = useState({});
    const [refreshData, setRefreshData] = useState(0);
    const breadcrumbOption = {
        title: 'Active Employee',
        items: [
            {
                title: "Admin",
                icon: "bi bi-person-square",
                isActive: false,
            },
            {
                title: "Active Employee",
                icon: "bi bi-person-check-fill",
                isActive: false,
            }
        ]
    }
    const handleSearch = (searchTerm) => {
        Api.Get(apiUrls.employeeController.searchAll + searchTerm + '&allFixed=true').then(res => {
            tableOptionTemplet.data = res.data;
            tableOptionTemplet.totalRecords = res.data.length;
            setTableOption({ ...tableOptionTemplet });
        })
    }
    const activeDeactiveHandler = (empId, isActive) => {
        Api.Post(apiUrls.employeeController.ActiveDeactiveEmp + `/${empId}/${isActive}`, {})
            .then(res => {
                if (res.data) {
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                }
                else
                    toast.warn(toastMessage.updateError);
            })
    }
    const customActiveDeactiveButton = (dataRow, headerRow) => {
        return <button onClick={e => activeDeactiveHandler(dataRow.id, !dataRow.isActive)} className={dataRow.isActive ? 'btn btn-sm btn-danger' : 'btn btn-sm btn-success'}>
            {dataRow.isActive ? "Deactivate" : "Activate"}
        </button>
    }
    const customCancelButton = (dataRow, headerRow) => {
        if (dataRow?.empStatusName?.toLowerCase().indexOf('cancel') === -1) {
            return <button className='btn btn-sm btn-danger' onClick={e => { setSelectedEmpData(dataRow) }} data-bs-toggle="modal" data-bs-target="#markEmpCancelModel" disabled={dataRow?.empStatusName?.toLowerCase().indexOf('cancel') > -1}>
                Mark Cancel
            </button>
        }
        return <></>
    }
    const tableOptionTemplet = {
        headers: [
            { name: 'Active/Deactive', prop: 'isActive', customColumn: customActiveDeactiveButton },
            { name: 'Cancel Employee', prop: 'isActive', customColumn: customCancelButton },
            { name: 'Active', prop: 'isActive', action: { replace: { "true": "Yes", "false": "No" } } },
            { name: 'Employee Status', prop: 'empStatusName' },
            { name: 'First Name', prop: 'firstName' },
            { name: 'Last Name', prop: 'lastName' },
            { name: 'Contact', prop: 'contact' },
            { name: 'Contact 2', prop: 'contact2' },
            { name: 'Email', prop: 'email' },
            { name: 'Job Name', prop: 'jobTitle' },
            { name: 'Role', prop: 'role' },
            { name: 'Company', prop: 'compnayName' },
        ],
        data: [],
        totalRecords: 0,
        showPagination: false,
        searchHandler: handleSearch,
        showAction: false
    };
    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    useEffect(() => {
        Api.Get(apiUrls.employeeController.getAllActiveDeactiveEmp + '?allFixed=true').then(res => {
            tableOptionTemplet.data = res.data;
            tableOptionTemplet.totalRecords = res.data.length;
            setTableOption({ ...tableOptionTemplet });
        });
    }, [refreshData]);
    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">Active Employee</h6>
            <hr />
            <TableView option={tableOption}></TableView>
            <CancelEmployeePopup empData={selectedEmpData} callBack={setRefreshData}></CancelEmployeePopup>
        </>
    )
}
