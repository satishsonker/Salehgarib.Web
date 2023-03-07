import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { headerFormat } from '../../utils/tableHeaderFormat';
import Breadcrumb from '../common/Breadcrumb'
import TableView from '../tables/TableView'

export default function CrystalStockUpdate() {
    const updateCrystalModelTemplet = {
        id: 0,
        crystalId: 0,
        inStock: 0,
        inStockPieces: 0
    }
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [errors, setErrors] = useState({});
    const [updateCrystalModel, setUpdateCrystalModel] = useState(updateCrystalModelTemplet);
    const handleEdit = (id, data) => {
        setErrors({});
        Api.Get(apiUrls.crystalPurchaseController.getCrystalStockDetail + data.id).then(res => {
            setUpdateCrystalModel({ ...res.data });
        }).catch(err => {
            toast.error(toastMessage.getError);
        });
    };
    const breadcrumbOption = {
        title: 'Crystal',
        items: [
            {
                isActive: false,
                title: "Update Crystal Stock",
                icon: "bi bi-tag"
            }
        ]
    }
    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 0 && searchTerm.length < 3)
            return;
        Api.Get(apiUrls.crystalPurchaseController.searchCrystalPurchase + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`, {}).then(res => {
            tableOptionTemplet.data = res.data.data;
            tableOptionTemplet.data.forEach(element => {
                //addAdditionalField(element);
            });
            tableOptionTemplet.totalRecords = res.data.totalRecords;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {

        });
    }
    const tableOptionTemplet = {
        headers: headerFormat.crystalStockAlert,
        showTableTop: true,
        showFooter: false,
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            showView: false,
            showDelete: false,
            edit: {
                handler: handleEdit,
                icon: "bi bi-pencil-fill",
                modelId: "add-purchase-entry"
            }
        }
    }
    const [tableOption, setTableOption] = useState(tableOptionTemplet);

    useEffect(() => {
Api.Get(apiUrls.crystalPurchaseController.getCrystalStockDetail)
.then(res=>{
    tableOptionTemplet.data=res.data;
    tableOptionTemplet.totalRecords=res.data.length;
    setTableOption({...tableOptionTemplet});
})
    }, []);

    return (
        <>
            <Breadcrumb option={breadcrumbOption} />
            <h6 className="mb-0 text-uppercase">Update Stock</h6>
            <hr />
            <TableView option={tableOption}></TableView>
        </>
    )
}
