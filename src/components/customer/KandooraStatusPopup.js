import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common'
import ButtonBox from '../common/ButtonBox';
import Pagination from '../tables/Pagination';
import Inputbox from '../common/Inputbox';
import { toast } from 'react-toastify';
import { toastMessage } from '../../constants/ConstantValues';

export default function KandooraStatusPopup({ orderData }) {
    //orderData=common.defaultIfEmpty(orderData,{id:0})
    const [pageNo, setPageNo] = useState(1);
    const [WorkData, setWorkData] = useState([]);
    const [selectKeyName, setSelectKeyName] = useState("");
    const [note, setNote] = useState("");
    const [unstitchedImageList, setUnstitchedImageList] = useState([]);
    const [zoomImage, setZoomImage] = useState(false);
    //const [paginationOption, setPaginationOption] = useState(paginationOptionTemplte)
    useEffect(() => {
        if (orderData === undefined || orderData.id === undefined) {
            return;
        }
        let apis = [];
        apis.push(Api.Get(apiUrls.workTypeStatusController.getByOrderId + orderData.id));
        Api.MultiCall(apis).then(res => {
            let obj = {};
            setPageNo(1);
            res[0].data.forEach(element => {
                if (!obj.hasOwnProperty(element.kandooraNo)) {
                    obj[element.kandooraNo] = [];
                }
                var kandooraStatus = orderData.orderDetails.find(x => x.orderNo === element.kandooraNo);
                if (kandooraStatus !== undefined) {
                    element.status = kandooraStatus.status;
                }
                obj[element.kandooraNo].push(element);
            });
            var keyName = Object.keys(obj)[0];
            setSelectKeyName(keyName);
            setWorkData(obj);
            setNote(obj[keyName][0].addtionalNote);
            let moduleIds = "";
            Object.keys(obj).forEach(res => {
                moduleIds += `moduleIds=${obj[res][0].orderDetailId.toString()}&`;
            });

            Api.Get(apiUrls.fileStorageController.getFileByModuleIdsAndName + `1/?${moduleIds}`).then(res => {
                setUnstitchedImageList(res.data.filter(x => x.remark === 'unstitched'));
            })
        })
            .catch(err => {
            });
    }, [orderData]);

    const getUnstitchedImage = (id) => {
        let defaultImage
        if (unstitchedImageList.length === 0)
            return common.defaultImageUrl;
        var imgUnstiched = unstitchedImageList.find(x => x.moduleId === id);
        if (imgUnstiched === undefined)
            return common.defaultImageUrl;
        return process.env.REACT_APP_API_URL + imgUnstiched.thumbPath;
    }

    useEffect(() => {
        var keyName = Object.keys(WorkData)[pageNo - 1];
        setSelectKeyName(keyName);
        setNote(safeGaurd()?.addtionalNote ?? "");
    }, [pageNo])


    const safeGaurd = () => {
        var hasData = WorkData[selectKeyName]
        return hasData === undefined ? [] : hasData[0];
    }
    const saveNote = () => {
        Api.Post(apiUrls.workTypeStatusController.updateNote + `${WorkData[selectKeyName][0]?.orderDetailId}?note=${note}`, {})
            .then(res => {
                if (res.data)
                    toast.success(toastMessage.updateSuccess);
                else
                    toast.warn(toastMessage.updateError);
            });
    }
    if (orderData === undefined || orderData === null || WorkData.length === 0)
        return <></>
    return (
        <>
            <div className="modal fade" id="kandoora-status-popup-model" tabIndex="-1" aria-labelledby="kandoora-status-popup-model-label" aria-hidden="true">
                <div className={!zoomImage?"modal-dialog modal-lg":"modal-dialog modal-xl"}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="kandoora-status-popup-model-label">Kandoora Delivery Status : {selectKeyName}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {
                                Object.keys(WorkData).length === 0 &&
                                <div className='text-center text-danger'>No Work type selected for any kandoora in this order</div>
                            }
                            {zoomImage && <>
                               <div className='mb-2 text-end'>
                               <ButtonBox type="back" onClickHandler={e => { setZoomImage(pre => !zoomImage) }} className="btn-sm" />
                               </div>
                                <img onClick={e => setZoomImage(pre => !pre)}
                                                                style={{ width: '100%', border: '3px solid gray', borderRadius: '7px', cursor: 'zoom-in' }}
                                                                src={getUnstitchedImage(WorkData[selectKeyName]?.orderDetailId)}
                                                                onError={common.defaultImageUrl}></img>
                            </> }
                            {!zoomImage &&
                                <table className="table table-striped table-bordered fixTableHead" style={{ fontSize: 'var(--app-font-size)' }}>
                                    <thead>
                                        <tr>
                                            <th colSpan={5}>
                                                <div className="d-flex flex-row justify-content-between">
                                                    <div className="p-2">Kandoora Number : {selectKeyName}</div>
                                                    {
                                                        safeGaurd().status === "Delivered" && <div className="p-2">Delivered On : {common.getHtmlDate(safeGaurd().deliveredDate, 'ddmmyyyy')}</div>
                                                    }
                                                    <div className="p-2">Kandoora Status : {safeGaurd().status}</div>
                                                </div>
                                            </th>
                                        </tr>
                                        <tr>
                                            <th className='text-center'>Work Type</th>
                                            <th className='text-center'>Completed On</th>
                                            <th className='text-center'>Completed By</th>
                                            <th className='text-center'>Image</th>
                                            <th className='text-center'>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            WorkData[selectKeyName]?.map((data, dataIndex) => {
                                                return <tr key={dataIndex}>
                                                    <td className='text-start'>{data.workType}</td>
                                                    <td className='text-center'>{common.getHtmlDate(data.completedOn) === '1-01-01' ? '' : common.getHtmlDate(data.completedOn, 'ddmmyyyy')}</td>
                                                    <td className='text-start'>{data.completedByName}</td>
                                                    {dataIndex === 0 &&
                                                        <td className='text-center' rowSpan={WorkData[selectKeyName].length}>
                                                            <img onClick={e => setZoomImage(pre => !pre)}
                                                                style={{ maxWidth: '153px', width: '100%', border: '3px solid gray', borderRadius: '7px', cursor: 'zoom-in' }}
                                                                src={getUnstitchedImage(data.orderDetailId)}
                                                                onError={common.defaultImageUrl}></img>
                                                            <div style={{ fontSize: '12px', color: 'red' }}>Click on image to zoom</div>
                                                        </td>
                                                    }
                                                    <td className='text-center'>{common.getHtmlDate(data.completedOn) === '1-01-01' ? <span className="badge bg-warning text-dark">Not Started</span> : <span className="badge bg-success">Completed </span>}</td>
                                                </tr>
                                            })
                                        }
                                        <tr>
                                            <td colSpan={5} >
                                                <div className='d-flex justify-content-between'>
                                                    <div style={{ width: '90%' }}>
                                                        <Inputbox labelText="Note" type="text" value={note} onChangeHandler={(e) => { setNote(e.target.value) }} className="form-control-sm" />
                                                    </div>
                                                    <div style={{ marginTop: '20px' }}>
                                                        <ButtonBox type="save" onClickHandler={saveNote} className="btn-sm" />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan={5}>
                                                <div className="d-flex flex-row-reverse">
                                                    <div className="p-2">
                                                        <Pagination option={{
                                                            pageNo: pageNo,
                                                            setPageNo: setPageNo,
                                                            totalRecords: Object.keys(WorkData).length,
                                                            pageSize: 1,
                                                            showRange: false
                                                        }}></Pagination>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            }
                        </div>
                        <div className="modal-footer">
                            {!zoomImage &&
                                <ButtonBox type="cancel" className="btn-sm" modelDismiss={true} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
