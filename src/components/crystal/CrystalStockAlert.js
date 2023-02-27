import React,{useState,useEffect} from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { headerFormat } from '../../utils/tableHeaderFormat';
import Breadcrumb from '../common/Breadcrumb'
import TableView from '../tables/TableView';

export default function CrystalStockAlert() {
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [alertData, setAlertData] = useState([]);
    const breadcrumbOption = {
        title: 'Stock Alert',
        items: [
          {
            isActive: false,
            title: "Low Stock Alert",
            icon: "bi bi-tag"
          }
        ]
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
        //searchHandler: handleSearch,
        showAction:false
      }
const [tableOption, setTableOption] = useState(tableOptionTemplet);
      useEffect(() => {
        Api.Get(apiUrls.crystalPurchaseController.getCrystalStockAlert)
        .then(res=>{
           tableOptionTemplet.data=res.data;
           tableOptionTemplet.totalRecords=res.data.length;
           setTableOption({...tableOptionTemplet});
        })
      }, []);
      
  return (
    <>
      <Breadcrumb option={breadcrumbOption}/>
      <h6 className="mb-0 text-uppercase">Crystal Stock Alert</h6>
      <hr />
      <TableView option={tableOption}></TableView>
    </>
  )
}
