import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common'

export default function KandooraStatusPopup({ orderData }) {
    //orderData=common.defaultIfEmpty(orderData,{id:0})
    const [WorkData, setWorkData] = useState([]);
    useEffect(() => {
        if(orderData===undefined || orderData.id===undefined)
        {
            return;
        }
        Api.Get(apiUrls.workTypeStatusController.getByOrderId + orderData.id)
            .then(res => {
                let obj = {};
                res.data.forEach(element => {
                    if (!obj.hasOwnProperty(element.kandooraNo)) {
                        obj[element.kandooraNo] = [];
                    }
                    var kandooraStatus = orderData.orderDetails.find(x => x.orderNo === element.kandooraNo);
                    if (kandooraStatus !== undefined) {
                        element.status = kandooraStatus.status;
                    }
                    obj[element.kandooraNo].push(element)
                });
                setWorkData(obj);
            })
            .catch(err => {
            });
    }, [orderData])

    if (orderData === undefined || orderData === null)
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
                                Object.keys(WorkData).length===0 &&
                                <div className='text-center text-danger'>No Work type selected for any kandoora in this order</div>
                            }
                            {
                                Object.keys(WorkData).map((keyName, keyIndex) => {
                                    return <table key={keyName} className="table table-striped table-bordered" style={{ fontSize: 'var(--app-font-size)' }}>
                                        <thead>
                                            <tr>
                                                <th colSpan={6}>
                                                    <div className="d-flex flex-row justify-content-between">
                                                        <div className="p-2">Kandoora Number : {keyName}</div>
                                                        {
                                                            WorkData[keyName][0].status==="Delivered" &&  <div className="p-2">Delivered On : {common.getHtmlDate(WorkData[keyName][0].deliveredDate)}</div>
                                                        }
                                                        <div className="p-2">Kandoora Status : {WorkData[keyName][0].status}</div>
                                                    </div>
                                                </th>
                                            </tr>
                                            <tr>
                                                <th className='text-center'>#</th>
                                                <th className='text-center'>Work Type</th>
                                                <th className='text-center'>Completed On</th>
                                                <th className='text-center'>Completed By</th>
                                                <th className='text-center'>Price</th>
                                                <th className='text-center'>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                WorkData[keyName].map((data, dataIndex) => {
                                                    return <tr key={dataIndex}>
                                                        <td className='text-center'>{dataIndex + 1}</td>
                                                        <td className='text-center'>{data.workType}</td>
                                                        <td className='text-center'>{common.getHtmlDate(data.completedOn) === '1-01-01' ? '' : common.getHtmlDate(data.completedOn)}</td>
                                                        <td className='text-center'>{data.completedByName}</td>
                                                        {/* <td className='text-center'>{data.orderNo}</td>
                                                <td className='text-center'>{data.kandooraNo}</td> */}
                                                        <td className='text-center'>{data.price}</td>
                                                        <td className='text-center'>{common.getHtmlDate(data.completedOn) === '1-01-01' ? <span className="badge bg-warning">Processing</span> : <span className="badge bg-success">Completed</span>}</td>
                                                    </tr>
                                                })
                                            }
                                        </tbody>
                                    </table>
                                })
                            }
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
