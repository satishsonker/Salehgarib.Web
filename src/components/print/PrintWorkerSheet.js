import React from 'react'
import { common } from '../../utils/common';

export const PrintWorkerSheet = React.forwardRef((props, ref) => {
    let mainData = common.cloneObject(props.props);
    console.log(mainData, 'worker sheet');
    if (props === undefined || props.props === undefined || props.props.orderNo === undefined)
        return <></>

    return (
        <>
            <div ref={ref} style={{ padding: '10px', fontSize: '10px' }} className="row">

                {
                    mainData?.orderDetails?.map((ele, index) => {
                        return <>
                            <div className="col-9 mx-auto">
                                <div className="card border shadow-none">
                                    <div className='row'>
                                        <div className='col-12 text-center fs-5'>
                                            Worker Sheet
                                        </div>
                                        <div className="d-flex flex-row justify-content-between">
                                            <div className="p-2">{process.env.REACT_APP_COMPANY_NAME}</div>
                                            <div className="p-2">Order No : {mainData.orderNo}</div>
                                            <div className="p-2">Date : {common.getHtmlDate(new Date())}</div>
                                        </div>
                                        <div className='col-12' style={{minHeight:'295px'}}>
                                            <table className='table table-bordered'>
                                                <tbody>

                                                    <tr>
                                                        <td style={{ padding: '0 0 0 8px' }}>Kandoora No</td>
                                                        <td style={{ padding: '0 0 0 8px',width:'80px' }}>{ele.orderNo}</td>
                                                        <td style={{ padding: '0 0 0 8px' }}>Grade</td>
                                                        <td style={{ padding: '0 0 0 8px' }}>B++</td>
                                                        <td style={{ padding: '0 0 0 8px' }}>Customer Name</td>
                                                        <td style={{ padding: '0 0 0 8px' }}>{mainData.customerName.split('-')[0].trim()}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ padding: '0 0 0 8px' }}>Qty.</td>
                                                        <td style={{ padding: '0 0 0 8px' }}>{mainData.orderDetails.length}</td>
                                                        <td style={{ padding: '0 0 0 8px' }}>Model No.</td>
                                                        <td style={{ padding: '0 0 0 8px',width:'80px' }}>{mainData.modelName}</td>
                                                        <td style={{ padding: '0 0 0 8px' }}>Delivery Date</td>
                                                        <td style={{ padding: '0 0 0 8px' }}>{common.getHtmlDate(mainData.orderDeliveryDate)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Voucher No <br /> {mainData.orderNo}</td>
                                                        <td style={{ padding: '0 0 0 8px', margin: '0 0 0 8px' }}>
                                                            <div>Neck : {ele.neck}</div>
                                                            <div>Sleeve : {ele.sleeve}</div>
                                                            <div>Shape : {ele.shape===undefined?"":ele.shape}</div>
                                                        </td>
                                                        <td>Details</td>
                                                        <td colSpan={3}>Large <br/> Salesman : {mainData.salesman}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Cut. Master.</td>
                                                        <td></td>
                                                        <td>Hand. Emb.</td>
                                                        <td></td>
                                                        <td rowSpan={4} colSpan={2}></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Machine Emb..</td>
                                                        <td></td>
                                                        <td>Stitch Man.</td>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Crystal Man.</td>
                                                        <td></td>
                                                        <td>Other.</td>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={4}>Check and updated by...<br/>..<br/>.</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-3 mx-auto">
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
                                                <td style={{ padding: '0 0 0 5px' }}>Deep</td>
                                                <td style={{ padding: '0px' }} className="text-center">{ele.deep}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0 0 0 5px' }}>Neck</td>
                                                <td style={{ padding: '0px' }} className="text-center">{ele.neck}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0 0 0 5px' }}>Back Down</td>
                                                <td style={{ padding: '0px' }} className="text-center">{ele.backdown}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0 0 0 5px' }}>Extra</td>
                                                <td style={{ padding: '0px' }} className="text-center">{ele.extra}</td>
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
