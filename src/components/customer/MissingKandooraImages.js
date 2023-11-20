import React, { useState, useEffect } from 'react'
import TableView from '../tables/TableView'
import { Api } from '../../apis/Api';
import { headerFormat } from '../../utils/tableHeaderFormat';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common';
import ButtonBox from '../common/ButtonBox';
import ImageZoomInPopup from '../Popups/ImageZoomInPopup';
import ImageUploadWithPreview from '../common/ImageUploadWithPreview';
import DeleteConfirmation from '../tables/DeleteConfirmation';
import { toast } from 'react-toastify';
import { toastMessage } from '../../constants/ConstantValues';

export default function MissingKandooraImages() {
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [imagePath, setImagePath] = useState({});
  const [refreshData, setRefreshData] = useState(0);
  const [searchTermState, setSearchTermState] = useState("")
  const [isSearchingRecord, setIsSearchingRecord] = useState(false);
  const [selectOrderDetails, setSelectOrderDetails] = useState({ orderDetailId: 0, remark: '', kandooraNo: "" });
  const handleSearch = (searchTerm) => {
    setSearchTermState(searchTerm);
    if (searchTerm?.length > 0)
      setIsSearchingRecord(true);
    else
      setIsSearchingRecord(false);
    Api.Get(apiUrls.fileStorageController.searchMissingKandooraImages + `pageNo=${pageNo}&pageSize=${pageSize}&searchTerm=${searchTerm}`).then(res => {
      tableOptionTemplet.data = res.data.data;
      tableOptionTemplet.totalRecords = res.data.totalRecords;
      setTableOption({ ...tableOptionTemplet });
    });
  }
  const removeImage = (id) => {
    Api.Delete(apiUrls.fileStorageController.deleteFile + id)
      .then(res => {
        if (res.data > 0) {
          toast.success(toastMessage.deleteSuccess);
          setRefreshData(pre => pre + 1);
        }
      })
  }
  let tableHeader = headerFormat.missingKandooraImage;
  tableHeader[1].customColumn = (data) => {
    if (data?.remark === "" || data?.remark === "stitched")
      return <ButtonBox className="btn-sm" type="upload" modalId="#uploadMissingKandooraImage" onClickHandler={() => { setSelectOrderDetails({ orderDetailId: data?.id, remark: "stitched", kandooraNo: data?.orderNo }) }} />
    else if (data?.remark === "unstitched")
      return <>
        <img className='img-icon' data-bs-target="#image-zoom-in-model" onClick={e => setImagePath({ ...data })} data-bs-toggle="modal" src={process.env.REACT_APP_API_URL + data?.thumbPath} alt="Unstitched" onError={common.defaultImageUrl} ></img>
        <ButtonBox type="cancel" text="Remove Image" modalId={"#imageDeleteComfirmationUnstitched_" + data?.id} className="btn-sm mx-2" />
        <DeleteConfirmation title="Remove Unstitched Image" message="Are you want remove image?" deleteHandler={removeImage} dataId={data?.id} modelId={"imageDeleteComfirmationUnstitched_" + data?.id} buttonText="Remove Image" cancelButtonText="No" />
      </>
  }
  tableHeader[2].customColumn = (data) => {
    if (data?.remark === "" || data?.remark === "unstitched")
      return <ButtonBox className="btn-sm" type="upload" modalId="#uploadMissingKandooraImage" onClickHandler={() => { setSelectOrderDetails({ orderDetailId: data?.id, remark: "unstitched", kandooraNo: data?.orderNo }) }} />
    else if (data?.remark === "stitched")
      return <>
        <img className='img-icon' onClick={e => setImagePath({ ...data })} data-bs-target="#image-zoom-in-model" data-bs-toggle="modal" src={process.env.REACT_APP_API_URL + data?.thumbPath} alt="Stitched" onError={common.defaultImageUrl} ></img>
        <ButtonBox type="cancel" modalId={"#imageDeleteComfirmationStitched_" + data?.id} text="Remove Image" className="btn-sm" />
        <DeleteConfirmation title="Remove Stitched Image" message="Are you want remove image?" deleteHandler={removeImage} dataId={data?.id} modelId={"imageDeleteComfirmationStitched_" + data?.id} buttonText="Remove Image" cancelButtonText="No" />
      </>
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
    var url = !isSearchingRecord ? (apiUrls.fileStorageController.missingKandooraImages + `pageNo=${pageNo}&pageSize=${pageSize}`) : (apiUrls.fileStorageController.searchMissingKandooraImages + `pageNo=${pageNo}&pageSize=${pageSize}&searchTerm=${searchTermState}`);
    Api.Get(url)
      .then(res => {
        tableOptionTemplet.data = res.data.data;
        tableOptionTemplet.totalRecords = res.data.totalRecords;
        setTableOption({ ...tableOptionTemplet });
      });
  }, [pageNo, pageSize, refreshData]);

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
      <div className="modal fade" id="uploadMissingKandooraImage" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Upload Missing Kandoora Images</h5>
              <button type="button" className="btn-close" id='closeUploadMissingKandooraImage' data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <ImageUploadWithPreview moduleId={selectOrderDetails.orderDetailId} title={`Kandoora No. : ${selectOrderDetails?.kandooraNo}`} description={`${selectOrderDetails.remark} kandoora Image`}></ImageUploadWithPreview>
            </div>
            <div className="modal-footer">
              <ButtonBox type="cancel" text="Close" className="btn-sm" modelDismiss={true} />
            </div>
          </div>
        </div>
      </div>
      <ImageZoomInPopup imagePath={process.env.REACT_APP_API_URL + imagePath?.filePath} kandooraNo={imagePath?.orderNo}></ImageZoomInPopup>
    </>
  )
}
