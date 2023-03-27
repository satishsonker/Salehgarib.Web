import React, { useState, useEffect, useRef } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common';
import ButtonBox from '../common/ButtonBox'
import ReactToPrint from 'react-to-print';

export default function PrintWorkerSheet({ orderData, pageIndex, setPageIndex }) {
    const [modelImages, setModelImages] = useState([]);
    let mainData = common.cloneObject(orderData);
    const printRef = useRef();

    useEffect(() => {
        if (orderData === undefined || orderData.orderNo === undefined || mainData?.orderDetails === undefined)
            return
        let designSampleIds = '';
        mainData?.orderDetails?.forEach(ele => {
            designSampleIds += (`moduleIds=${ele.designSampleId}&`);
        })
        Api.Get(apiUrls.fileStorageController.getFileByModuleIdsAndName + `${0}?${designSampleIds}`)
            .then(res => {
                setModelImages(res.data);
            })
    }, [orderData,pageIndex]);
    if (orderData === undefined || orderData.orderNo === undefined) {
        return <></>
    }
    const getModelImage = (id) => {
        var imagePath = modelImages.find(x => x.moduleId === id);

        if (imagePath) {
            console.log(imagePath.filePath, 'photo');
            console.log(process.env.REACT_APP_API_URL, 'photo');
        return imagePath.filePath;
        }
        return "";
    }
    return (
        <>
            <div className='d-flex justify-content-between'>
                <ButtonBox type="back" onClickHandler={() => { setPageIndex(0) }} className="btn-sm" />
                <ReactToPrint
                    trigger={() => {
                        return <button className='btn btn-sm btn-warning' data-bs-dismiss="modal"><i className='bi bi-printer'></i> Print Work Sheet</button>
                    }}
                    content={(el) => (printRef.current)}
                />
            </div>
            <div ref={printRef} style={{ padding: '10px', fontSize: '10px' }} className="row">

                {
                    mainData?.orderDetails?.map((ele, index) => {
                        return <>
                            <div key={ele.id} className="col-9" style={{ height: '375px', maxHeight: '375px' }}>
                                <div className="card shadow-none">
                                    <div className='row'>
                                        <div className='col-12'>
                                            <table className='table table-bordered'>
                                                <tbody>
                                                    <tr>
                                                        <td colSpan={6} className="text-center"> {process.env.REACT_APP_COMPANY_NAME}</td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={2} className=" text-center fw-bold fs-6">Worker Sheet</td>
                                                        <td colSpan={2} className=" text-center fw-bold fs-6">Order No : *{mainData.orderNo}*</td>
                                                        <td colSpan={2} className=" text-center fw-bold fs-6">Date : {common.getHtmlDate(new Date(), 'ddmmyyyy')}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ padding: '0 0 0 8px' }}>Kandoora No</td>
                                                        <td style={{ padding: '0 0 0 8px', width: '80px' }} className=" fw-bold">{ele.orderNo}</td>
                                                        <td style={{ padding: '0 0 0 8px' }}>Salesman</td>
                                                        <td style={{ padding: '0 0 0 8px' }} className=" fw-bold">{mainData.salesman.split(' ')[0].trim()}</td>
                                                        <td style={{ padding: '0 0 0 8px' }}>D. Date</td>
                                                        <td style={{ padding: '0 0 0 8px' }} className=" fw-bold">{common.getHtmlDate(mainData.orderDeliveryDate, 'ddmmyyyy')}</td>
                                                        {/* <td style={{ padding: '0 0 0 8px' }}>Grade</td>
                                                        <td style={{ padding: '0 0 0 8px' }} className=" fw-bold">{common.getGrade(ele.totalAmount)}</td> */}
                                                        {/* <td style={{ padding: '0 0 0 8px' }}>Model</td>
                                                        <td style={{ padding: '0 0 0 8px' }} className=" fw-bold">{ele.modelName}</td> */}
                                                    </tr>
                                                    <tr>
                                                        <td style={{ padding: '0 0 0 8px' }}>Qty</td>
                                                        <td style={{ padding: '0 0 0 8px', width: '80px' }} className=" fw-bold">{mainData.orderDetails.length}</td>
                                                        <td style={{ padding: '0 0 0 8px' }}>Grade</td>
                                                        <td style={{ padding: '0 0 0 8px' }} className=" fw-bold">{common.getGrade(ele?.subTotalAmount)}</td>
                                                       <td style={{ padding: '0 0 0 8px' }}>Name</td>
                                                        <td style={{ padding: '0 0 0 8px' }} className=" fw-bold">{ele.measurementCustomerName===null || ele.measurementCustomerName===""?mainData.customerName.split('-')[0].trim():ele.measurementCustomerName}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ padding: '0 0 0 8px' }} className='text-uppercase'>customer name</td>
                                                        <td style={{ padding: '0 0 0 8px' }} className='text-uppercase'>neck</td>
                                                        <td style={{ padding: '0 0 0 8px' }} className='text-uppercase'>Sleeve Loos.</td>
                                                        <td style={{ padding: '0 0 0 8px' }} rowSpan={2} className='text-uppercase'>Model No.</td>
                                                        <td style={{ padding: '0 0 0 8px' }} rowSpan={2} colSpan={2} className='text-uppercase fw-bold'>{ele.designModel}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ padding: '0 0 0 8px' }} className='text-uppercase fw-bold'>{mainData.customerName}</td>
                                                        <td style={{ padding: '0 0 0 8px' }} className='text-uppercase fw-bold'>{ele.neck}</td>
                                                        <td style={{ padding: '0 0 0 8px' }} className='text-uppercase fw-bold'>{ele.sleeveLoose}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ padding: '15px' }}>Cut. Master.</td>
                                                        <td style={{ padding: '15px' }}></td>
                                                        <td style={{ padding: '15px' }}>Hand. Emb.</td>
                                                        <td style={{ padding: '15px' }}></td>
                                                        <td style={{ padding: '15px' }} rowSpan={5} colSpan={2}>
                                                            <img style={{ display: 'block', width: '100%', maxHeight: '96px' }} 
                                                            onError={(e)=>{e.target.src="/assets/images/default-image.jpg"}} 
                                                            src={process.env.REACT_APP_API_URL + getModelImage(ele.designSampleId)} ></img>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ padding: '15px' }}>Machine Emb..</td>
                                                        <td style={{ padding: '15px' }}></td>
                                                        <td style={{ padding: '15px' }}>Stitch Man.</td>
                                                        <td style={{ padding: '15px' }}></td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ padding: '15px' }}>Crystal Man.</td>
                                                        <td style={{ padding: '15px' }}></td>
                                                        <td style={{ padding: '15px' }}>Other.</td>
                                                        <td style={{ padding: '15px' }}></td>
                                                    </tr>
                                                    <tr>
                                                        <td rowSpan={2} colSpan={4}>.<br />.<br />Check and updated by............<br />.<br />.</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div key={ele.orderNo} className="col-3 mx-auto">
                                <div className="card border shadow-none">
                                    <table className='table table-bordered' style={{ margin: '0px' }}>
                                        <tbody>
                                            <tr >
                                                <td style={{ padding: '0px' }} colSpan={2} className="text-center">{process.env.REACT_APP_COMPANY_NAME}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0 0 0 5px' }}>Kandoora No :</td>
                                                <td style={{ padding: '0px' }} className="text-center">{ele.orderNo}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0 0 0 5px' }}>Customer</td>
                                                <td style={{ padding: '0px' }} className="text-center">{ele.measurementCustomerName===null || ele.measurementCustomerName===""?mainData.customerName.split('-')[0].trim():ele.measurementCustomerName}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0 0 0 5px' }}>Grade</td>
                                                <td style={{ padding: '0 0 0 5px' }}>{common.getGrade(ele.subTotalAmount)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0 0 0 5px' }}>Length</td>
                                                <td style={{ padding: '0px' }} className="text-center">{ele.length}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0 0 0 5px' }}>Chest</td>
                                                <td style={{ padding: '0px' }} className="text-center">{ele.chest}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0 0 0 5px' }}>Waist</td>
                                                <td style={{ padding: '0px' }} className="text-center">{ele.waist}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0 0 0 5px' }}>Hipps</td>
                                                <td style={{ padding: '0px' }} className="text-center">{ele.hipps}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0 0 0 5px' }}>Bottom</td>
                                                <td style={{ padding: '0px' }} className="text-center">{ele.bottom}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0 0 0 5px' }}>Sleeve</td>
                                                <td style={{ padding: '0px' }} className="text-center">{ele.sleeve}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0 0 0 5px' }}>S. Loosing</td>
                                                <td style={{ padding: '0px' }} className="text-center">{ele.sleeveLoose}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0 0 0 5px' }}>Shoulder</td>
                                                <td style={{ padding: '0px' }} className="text-center">{ele.shoulder}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0 0 0 5px' }}>Neck</td>
                                                <td style={{ padding: '0px' }} className="text-center">{ele.neck}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0 0 0 5px' }}>Deep</td>
                                                <td style={{ padding: '0px' }} className="text-center">{ele.deep}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0 0 0 5px' }}>Back Down</td>
                                                <td style={{ padding: '0px' }} className="text-center">{ele.backDown}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0 0 0 5px' }}>Extra</td>
                                                <td style={{ padding: '0px' }} className="text-center">{ele.extra}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0 0 0 5px' }}>Size</td>
                                                <td style={{ padding: '0px' }} className="text-center">{ele.size}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0 0 0 5px' }}>Note</td>
                                                <td style={{ padding: '0px' }} className="text-center">{ele.description}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0 0 0 5px' }}>Qty.</td>
                                                <td style={{ padding: '0px' }} className="text-center">{mainData.orderDetails.length}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    })
                }
            </div>
        </>
    )
}
