import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common';
import { headerFormat } from '../../utils/tableHeaderFormat';
import Breadcrumb from '../common/Breadcrumb'
import ButtonBox from '../common/ButtonBox';
import InputBox from '../common/Inputbox';
import Dropdown from '../common/Dropdown';
import TableView from '../tables/TableView';

export default function CrystalStockConsumedDetails() {
  const filterTemplate = {
    brandId: 0,
    shapeId: 0,
    sizeId: 0,
    fromDate: common.getHtmlDate(common.getFirstDateOfMonth(common.getCurrDate(false).getMonth(), common.getCurrDate(false).getFullYear())),
    toDate: common.getHtmlDate(new Date()),
  };
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [brandList, setBrandList] = useState([]);
  const [sizeList, setSizeList] = useState([]);
  const [ShapeList, setShapeList] = useState([]);
  const [fetchData, setFetchData] = useState(0);
  const [filter, setFilter] = useState(filterTemplate);
  const [selectedRecord, setSelectedRecord] = useState({});

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
  const viewOrders = (id, data) => {
    Api.Get(apiUrls.crytalTrackingController.getTrackingOutByOrderDetailId + `${data.crystalId}/${data.releaseDate}`)
      .then(res => {
        setSelectedRecord({ crystalData: data, orderData: [...res.data] });
      });
  }
  const tableOptionTemplet = {
    headers: headerFormat.crystalStockConsumedDetails,
    showTableTop: true,
    data: [],
    totalRecords: 0,
    pageSize: pageSize,
    pageNo: pageNo,
    showSerialNo: true,
    setPageNo: setPageNo,
    setPageSize: setPageSize,
    searchHandler: handleSearch,
    showAction: true,
    actions: {
      showDelete: false,
      showEdit: false,
      view: {
        handler: viewOrders,
        modelId: 'show-orders'
      }
    }
  }
  const [tableOption, setTableOption] = useState(tableOptionTemplet);
  useEffect(() => {
    Api.Get(apiUrls.crytalTrackingController.getCrystalStockConsumedDetail + `?fromDate=${filter.fromDate}&toDate=${filter.toDate}&brandId=${filter.brandId}&shapeId=${filter.shapeId}&sizeId=${filter.sizeId}`)
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
        setShapeList(res[0].data.filter(x => x.masterDataTypeCode === "shape"))
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
      <h6 className="mb-0 text-uppercase">Crystal Consumed Details</h6>
      <div className='d-flex justify-content-end'>
        <div className='mx-2'>
          <InputBox showLabel={false} type="date" onChangeHandler={textChangeHandler} value={filter.fromDate} name="fromDate" className="form-control-sm" />
        </div>
        <div className='mx-2'>
          <InputBox showLabel={false} type="date" onChangeHandler={textChangeHandler} value={filter.toDate} name="toDate" className="form-control-sm" />
        </div>
        <div className='mx-2'>
          <Dropdown defaultText="All Brand" onChange={textChangeHandler} data={brandList} name="brandId" value={filter.brandId} className="form-control-sm" />
        </div>
        <div className='mx-2'>
          <Dropdown defaultText="All Size" onChange={textChangeHandler} data={sizeList} name="sizeId" value={filter.sizeId} className="form-control-sm" />
        </div>
        <div className='mx-2'>
          <Dropdown defaultText="All Shape" onChange={textChangeHandler} data={ShapeList} name="shapeId" value={filter.shapeId} className="form-control-sm" />
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
      <div className="modal fade" id="show-orders" tabIndex="-1" aria-labelledby="show-orders-label" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="show-orders-label">Crystal used by kandoora details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div style={{ fontSize: '11px' }}>
                <span className='mx-1'><strong> Crystal:</strong>  {selectedRecord?.crystalData?.crystalName ?? "Not Selected"}</span>
                <span className='mx-1'><strong> Brand:</strong>  {selectedRecord?.crystalData?.crystalBrand ?? "Not Selected"}</span>
                <span className='mx-1'><strong> Shape:</strong>  {selectedRecord?.crystalData?.crystalShape ?? "Not Selected"}</span>
                <span className='mx-1'><strong> Size:</strong>  {selectedRecord?.crystalData?.crystalSize ?? "Not Selected"}</span>
              </div>
              <div className="table-responsive">
                <table className="table table-striped table-bordered fixTableHead" style={{ fontSize: 'var(--app-font-size)' }}>
                  <thead>
                    <tr>
                      <th>Sr.</th>
                      <th>Kandoor Numbers</th>
                      <th>Packets</th>
                      <th>Pieces</th>
                      <th>Alter Packets</th>
                    </tr>
                  </thead>
                  <tbody>
                    <>
                      {
                        selectedRecord?.orderData?.map((ele, index) => {
                          return <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{ele?.orderNo}</td>
                            <td>{ele?.packets}</td>
                            <td>{ele?.pieces}</td>
                            <td>{ele?.alterPackets}</td>
                          </tr>
                        })
                      }
                    </>
                  </tbody>
                  <tfoot>
                    <tr style={{ fontWeight: 'bold' }}>
                      <td colSpan={2}>Total</td>
                      <td>
                        {
                          common.printDecimal(common.calculateSum(selectedRecord?.orderData, "packets"))
                        }
                      </td>
                      <td>
                        {
                          common.calculateSum(selectedRecord?.orderData, "pieces")
                        }
                      </td>
                      <td>
                        {
                          common.printDecimal(common.calculateSum(selectedRecord?.orderData, "alterPackets"))
                        }
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <ButtonBox type="cancel" modelDismiss={true} className="btn-sm" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}