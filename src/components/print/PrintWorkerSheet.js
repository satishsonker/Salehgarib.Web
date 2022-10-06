import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common';

export const PrintWorkerSheet = React.forwardRef((props, ref) => {
    let mainData = common.cloneObject(props.props);
    if (props === undefined || props.props === undefined || props.props.orderNo === undefined);
    const [modelImages, setModelImages] = useState([]);
    useEffect(() => {
        if (mainData?.orderDetails === undefined) {
        }
        
        let designSampleIds = '';
        mainData?.orderDetails?.forEach(ele => {
            designSampleIds += (`moduleIds=${ele.designSampleId}&`);
        })
        Api.Get(apiUrls.fileStorageController.getFileByModuleIdsAndName + `${0}?${designSampleIds}`)
            .then(res => {
                setModelImages(res.data);
            })
    }, [props.props]);

    const getModelImage=(id)=>{
        var imagePath= modelImages.find(x=>x.moduleId===id);
        if(imagePath)
        return imagePath.filePath;
        return "";
    }
    return (
        <>
            <div ref={ref} style={{ padding: '10px', fontSize: '10px' }} className="row">

                {
                    mainData?.orderDetails?.map((ele, index) => {
                        return <>
                            <div key={ele.id} className="col-9"   style={{ height: '380px',maxHeight: '380px' }}>
                                <div className="card shadow-none">
                                    <div className='row'>
                                        <div className='col-12'>
                                            <table className='table table-bordered'>
                                                <tbody>
                                                    <tr>
                                                        <td colSpan={6} className=" text-center fs-5"> Worker Sheet</td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={2} className=" text-center">{process.env.REACT_APP_COMPANY_NAME}</td>
                                                        <td colSpan={2} className=" text-center">Order No : *{mainData.orderNo}*</td>
                                                        <td colSpan={2} className=" text-center">Date : {common.getHtmlDate(new Date())}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ padding: '0 0 0 8px' }}>Kandoora No</td>
                                                        <td style={{ padding: '0 0 0 8px', width: '80px' }}>{ele.orderNo}</td>
                                                        <td style={{ padding: '0 0 0 8px' }}>Grade</td>
                                                        <td style={{ padding: '0 0 0 8px' }}>{common.getGrade(ele.totalAmount)}</td>
                                                        <td style={{ padding: '0 0 0 8px' }}></td>
                                                        <td style={{ padding: '0 0 0 8px' }}></td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ padding: '0 0 0 8px' }}>Qty.</td>
                                                        <td style={{ padding: '0 0 0 8px' }}>{mainData.orderDetails.length}</td>
                                                        <td style={{ padding: '0 0 0 8px' }}></td>
                                                        <td style={{ padding: '0 0 0 8px', width: '80px' }}></td>
                                                        <td style={{ padding: '0 0 0 8px' }}>Delivery Date</td>
                                                        <td style={{ padding: '0 0 0 8px' }}>{common.getHtmlDate(mainData.orderDeliveryDate)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td  style={{ padding: '0 0 0 8px' }} className='text-uppercase'>customer name</td>
                                                        <td  style={{ padding: '0 0 0 8px' }} className='text-uppercase'>neck</td>
                                                        <td  style={{ padding: '0 0 0 8px' }} className='text-uppercase'>Sleeve</td>
                                                        <td  style={{ padding: '0 0 0 8px' }} rowSpan={2} className='text-uppercase'>Model NO</td>
                                                        <td  style={{ padding: '0 0 0 8px' }} rowSpan={2} colSpan={2} className='text-uppercase'>{mainData.modelName}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ padding: '0 0 0 8px' }} className='text-uppercase'>{mainData.customerName}</td>
                                                        <td style={{ padding: '0 0 0 8px' }} className='text-uppercase'>{ele.neck}</td>
                                                        <td style={{ padding: '0 0 0 8px' }} className='text-uppercase'>{ele.sleeve}</td>
                                                    </tr>
                                                    <tr>
                                                        <td  style={{ padding: '15px' }}>Cut. Master.</td>
                                                        <td  style={{ padding: '15px' }}></td>
                                                        <td  style={{ padding: '15px' }}>Hand. Emb.</td>
                                                        <td  style={{ padding: '15px' }}></td>
                                                        <td  style={{ padding: '15px' }} rowSpan={4} colSpan={2}>
                                                            <img style={{display:'block',width:'100%',height:'100%'}} src={process.env.REACT_APP_API_URL + getModelImage(ele.designSampleId)} ></img>
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
                                                        <td colSpan={4}>Check and updated by...<br />..</td>
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
                                                <td style={{ padding: '0px' }} className="text-center">{mainData.customerName.split('-')[0].trim()}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0 0 0 5px' }}>Grade</td>
                                                <td style={{ padding: '0 0 0 5px' }}>B++</td>
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
});
