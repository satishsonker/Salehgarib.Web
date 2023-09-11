import React, { useState, useEffect } from 'react'
import TableView from '../tables/TableView';
import Breadcrumb from '../common/Breadcrumb';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toast } from 'react-toastify';
import { toastMessage } from '../../constants/ConstantValues';
import { headerFormat } from '../../utils/tableHeaderFormat';
import ButtonBox from '../common/ButtonBox';
import Inputbox from '../common/Inputbox';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';

export default function FabricLowStocks() {

const fabricStockModelTemplate = {
    id: 0,
    inQty: 0,
    outQty: 0
}
const [fabricStockModel, setFabricStockModel] = useState(fabricStockModelTemplate);
const [pageNo, setPageNo] = useState(1);
const [pageSize, setPageSize] = useState(20);
const handleSearch = (searchTerm) => {
    if (searchTerm.length > 0 && searchTerm.length < 3)
        return;
    Api.Get(apiUrls.fabricStockController.searchLowStock + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`).then(res => {
        tableOptionTemplet.data = res.data.data;
        tableOptionTemplet.totalRecords = res.data.totalRecords;
        setTableOption({ ...tableOptionTemplet });
    }).catch(err => {

    });
}

const tableOptionTemplet = {
    headers: headerFormat.fabricLowStockDetails,
    data: [],
    totalRecords: 0,
    pageSize: pageSize,
    pageNo: pageNo,
    setPageNo: setPageNo,
    setPageSize: setPageSize,
    searchHandler: handleSearch,
    showAction: false
};
const [tableOption, setTableOption] = useState(tableOptionTemplet);
const breadcrumbOption = {
    title: 'Fabric Low Stock',
    items: [
        {
            title: "Fabric Low Stock'",
            icon: "bi bi-broadcast-pin",
            isActive: false,
        }
    ]
}

useEffect(() => {
    Api.Get(apiUrls.fabricStockController.lowStock + `?PageNo=${pageNo}&PageSize=${pageSize}`).then(res => {
        tableOptionTemplet.data = res.data.data;
        tableOptionTemplet.totalRecords = res.data.totalRecords;
        setTableOption({ ...tableOptionTemplet });
    })
        ;
}, [pageNo, pageSize]);

return (
    <>
        <Breadcrumb option={breadcrumbOption}></Breadcrumb>
        <h6 className="mb-0 text-uppercase">Fabric Low Stock Deatils</h6>
        <hr />
        <TableView option={tableOption}></TableView>  
    </>
)
}
