import React, { useState, useEffect } from 'react';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { headerFormat } from '../../utils/tableHeaderFormat';
import Breadcrumb from '../common/Breadcrumb'
import TableView from '../tables/TableView'
export default function CrystalStockDetails() {
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const breadcrumbOption = {
        title: 'Crystal',
        items: [
            {
                isActive: false,
                title: "Crystal Stock Details",
                icon: "bi bi-tag"
            }
        ]
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.crystalPurchaseController.searchCrystalStockDetail + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`, {}).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }
    const tableOptionTemplet = {
        headers: headerFormat.crystalStockUpdate,
        showTableTop: true,
        showFooter: false,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        showAction: false
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);

    useEffect(() => {
        Api.Get(apiUrls.crystalPurchaseController.getCrystalStockDetail)
            .then(res => {
                tableOptionTemplet.data = res.data.data;
                tableOptionTemplet.totalRecords = res.data.totalRecords;
                setTableOption({ ...tableOptionTemplet });
            })
    }, [pageNo, pageSize]);

    return (
        <>
            <Breadcrumb option={breadcrumbOption} />
            <h6 className="mb-0 text-uppercase">All Stock Details</h6>
            <hr />
            <TableView option={tableOption}></TableView>
        </>
    )
}
