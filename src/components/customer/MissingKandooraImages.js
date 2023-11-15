import React, { useState, useEffect } from 'react'
import TableView from '../tables/TableView'
import { Api } from '../../apis/Api';
import { headerFormat } from '../../utils/tableHeaderFormat';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common';
import ButtonBox from '../common/ButtonBox';
import ImageZoomInPopup from '../Popups/ImageZoomInPopup';

export default function MissingKandooraImages() {
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [imagePath, setImagePath] = useState({});
  const handleSearch = (searchTerm) => {

  }
  let tableHeader = headerFormat.missingKandooraImage;
  tableHeader[1].customColumn = (data) => {
    if (data?.remark === "" || data?.remark === "stitched")
      return <ButtonBox className="btn-sm" type="upload"/>
    else if (data?.remark === "unstitched")
      return <img className='img-icon' data-bs-target="#image-zoom-in-model" onClick={e=>setImagePath({...data})} data-bs-toggle="modal" src={process.env.REACT_APP_API_URL + data?.thumbPath} alt="Unstitched" onError={common.defaultImageUrl} ></img>
  }
  tableHeader[2].customColumn = (data) => {
    if (data?.remark === "" || data?.remark === "unstitched")
      return <ButtonBox className="btn-sm" type="upload"/>
    else if (data?.remark === "stitched")
      return <img className='img-icon'  onClick={e=>setImagePath({...data})} data-bs-target="#image-zoom-in-model" data-bs-toggle="modal" src={process.env.REACT_APP_API_URL + data?.thumbPath} alt="Stitched" onError={common.defaultImageUrl} ></img>
  }
  const tableOptionTemplet = {
    headers: tableHeader,
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
    Api.Get(apiUrls.fileStorageController.missingKandooraImages + `pageNo=${pageNo}&pageSize=${pageSize}`)
      .then(res => {
        tableOptionTemplet.data = res.data.data;
        tableOptionTemplet.totalRecords = res.data.totalRecords;
        setTableOption({ ...tableOptionTemplet });
      });
  }, [pageNo, pageSize]);

  return (
    <>
      <div className='card'>
        <div className='card-body'>
          <div className='row'>
            <div className='col-sm-12 col-md-12'>
              <div className='list-container'>
                <TableView option={tableOption}></TableView>
              </div>
            </div>
            <div className='col-sm-12 col-md-6'></div>
          </div>
        </div>
      </div>
      <ImageZoomInPopup imagePath={process.env.REACT_APP_API_URL +imagePath?.filePath} kandooraNo={imagePath?.orderNo}></ImageZoomInPopup>
    </>
  )
}
