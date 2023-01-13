import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common'
import ButtonBox from '../common/ButtonBox';
import Pagination from '../tables/Pagination';

export default function KandooraStatusPopup({ orderData }) {
    //orderData=common.defaultIfEmpty(orderData,{id:0})
    const [pageNo, setPageNo] = useState(1);
    const [WorkData, setWorkData] = useState([]);
    const [selectKeyName, setSelectKeyName] = useState("");
    const [unstitchedImageList, setUnstitchedImageList] = useState([])
    //const [paginationOption, setPaginationOption] = useState(paginationOptionTemplte)
    useEffect(() => {
        if (orderData === undefined || orderData.id === undefined) {
            return;
        }
        let apis = [];
        apis.push(Api.Get(apiUrls.workTypeStatusController.getByOrderId + orderData.id));
        Api.MultiCall(apis).then(res => {
            let obj = {};
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
            setSelectKeyName(Object.keys(obj)[pageNo - 1]);
            setWorkData(obj);
            let moduleIds = "";
            Object.keys(obj).forEach(res => {
                moduleIds += `moduleIds=${obj[res][0].orderDetailId.toString()}&`;
            });

            Api.Get(apiUrls.fileStorageController.getFileByModuleIdsAndName + `1/?${moduleIds}`).then(res => {
                setUnstitchedImageList(res.data.filter(x=>x.remark==='unstitched'));
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
        return process.env.REACT_APP_API_URL+imgUnstiched.thumbPath;
    }

    useEffect(() => {
        setSelectKeyName(Object.keys(WorkData)[pageNo - 1]);
    }, [pageNo])



    if (orderData === undefined || orderData === null || WorkData.length === 0)
        return <></>
    return (
        <>
            <div className="modal fade" id="kandoora-status-popup-model" tabIndex="-1" aria-labelledby="kandoora-status-popup-model-label" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="kandoora-status-popup-model-label">Kandoora Delivery Status</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {
                                Object.keys(WorkData).length === 0 &&
                                <div className='text-center text-danger'>No Work type selected for any kandoora in this order</div>
                            }
                            <table className="table table-striped table-bordered fixTableHead" style={{ fontSize: 'var(--app-font-size)' }}>
                                <thead>
                                    <tr>
                                        <th colSpan={5}>
                                            <div className="d-flex flex-row justify-content-between">
                                                <div className="p-2">Kandoora Number : {selectKeyName}</div>
                                                {
                                                    WorkData[selectKeyName][0].status === "Delivered" && <div className="p-2">Delivered On : {common.getHtmlDate(WorkData[selectKeyName][0].deliveredDate, 'ddmmyyyy')}</div>
                                                }
                                                <div className="p-2">Kandoora Status : {WorkData[selectKeyName][0].status}</div>
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
                                                <td className='text-center'>{common.getHtmlDate(data.completedOn) === '1-01-01' ? '' : common.getHtmlDate(data.completedOn,'ddmmyyyy')}</td>
                                                <td className='text-start'>{data.completedByName}</td>
                                                {dataIndex === 0 &&
                                                    <td className='text-center' rowSpan={WorkData[selectKeyName].length}>
                                                        <img style={{maxWidth:'153px',width:'100%',border: '3px solid gray',borderRadius: '7px'}} src={getUnstitchedImage(data.orderDetailId)}></img>
                                                    </td>
                                                }
                                                <td className='text-center'>{common.getHtmlDate(data.completedOn) === '1-01-01' ? <span className="badge bg-warning text-dark">Not Started</span> : <span className="badge bg-success">Completed </span>}</td>
                                            </tr>
                                        })
                                    }
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
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type="cancel" className="btn-sm" modelDismiss={true}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
