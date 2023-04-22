import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { headerFormat } from '../../utils/tableHeaderFormat';
import Breadcrumb from '../common/Breadcrumb'
import ButtonBox from '../common/ButtonBox';
import Dropdown from '../common/Dropdown';
import TableView from '../tables/TableView';

export default function CrystalStockAlert() {
  const filterTemplate = {
    brandId: 0,
    shapeId: 0,
    sizeId: 0
  };
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [brandList, setBrandList] = useState([]);
  const [sizeList, setSizeList] = useState([]);
  const [ShapeList, setShapeList] = useState([]);
  const [fetchData, setFetchData] = useState(0);
  const [filter, setFilter] = useState(filterTemplate);

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
  const handleSearch = (searchTerm) => {
    if (searchTerm.length > 0 && searchTerm.length < 3)
      return;
    Api.Get(apiUrls.crystalPurchaseController.searchCrystalStockAlert + `?PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTerm}`, {}).then(res => {
      tableOptionTemplet.data = res.data.data;
      tableOptionTemplet.totalRecords = res.data.totalRecords;
      setTableOption({ ...tableOptionTemplet });
    })
  }
  const tableOptionTemplet = {
    headers: headerFormat.crystalStockAlert,
    showTableTop: true,
    showFooter: false,
    showSerialNo:true,
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
    Api.Get(apiUrls.crystalPurchaseController.getCrystalStockAlert + `?brandId=${filter.brandId}&shapeId=${filter.shapeId}&sizeId=${filter.sizeId}`)
      .then(res => {
        tableOptionTemplet.data = res.data;
        tableOptionTemplet.totalRecords = res.data.length;
        setTableOption({ ...tableOptionTemplet });
      })
  }, [fetchData]);

  useEffect(() => {
    let apiList = [];
    apiList.push(Api.Get(apiUrls.masterDataController.getByMasterDataTypes + "?masterDataTypes=brand&masterDataTypes=shape&masterDataTypes=size"));
    Api.MultiCall(apiList)
      .then(res => {
        setBrandList(res[0].data.filter(x => x.masterDataTypeCode === "brand"));
        setSizeList(res[0].data.filter(x => x.masterDataTypeCode === "size"));
        setShapeList(res[0].data.filter(x => x.masterDataTypeCode?.toLowerCase() === "shape"))
      });
  }, []);

  const textChangeHandler = (e) => {
    var { name, value, type } = e.target;
    if (type === "select-one") {
      value = parseInt(value);
    }
    setFilter({ ...filter, [name]: value });
  }

  return (
    <>
      <Breadcrumb option={breadcrumbOption} />
      <h6 className="mb-0 text-uppercase">Crystal Stock Alert</h6>
      <div className='d-flex justify-content-end'>
        <div className='mx-2'>
          <Dropdown defaultText="Select Brand" onChange={textChangeHandler} data={brandList} name="brandId" value={filter.brandId} className="form-control-sm" />
        </div>
        <div className='mx-2'>
          <Dropdown defaultText="Select Size" onChange={textChangeHandler} data={sizeList} name="sizeId" value={filter.sizeId} className="form-control-sm" />
        </div>
        <div className='mx-2'>
          <Dropdown defaultText="Select Shape" onChange={textChangeHandler} data={ShapeList} name="shapeId" value={filter.shapeId} className="form-control-sm" />
        </div>
        <div className='mx-2'>
          <ButtonBox type="go" className="btn-sm" onClickHandler={() => { setFetchData(pre => pre + 1) }} />
        </div>
        <div className='mx-2'>
          <ButtonBox type="reset" text="Clear Filter" className="btn-sm" onClickHandler={() => { setFilter({ ...filterTemplate }) }} />
        </div>
      </div>
      <hr />
      <TableView option={tableOption}></TableView>
    </>
  )
}
