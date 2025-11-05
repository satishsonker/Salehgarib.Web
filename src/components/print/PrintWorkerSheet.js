import React, { useState, useEffect, useRef } from "react";
import { Api } from "../../apis/Api";
import { apiUrls } from "../../apis/ApiUrls";
import { common } from "../../utils/common";
import ButtonBox from "../common/ButtonBox";
import ReactToPrint from "react-to-print";
import './printWorkerSheet.css';
import useAppSettings from "../../hooks/useApplicationSettings";

export default function PrintWorkerSheet({ orderData, pageIndex, setPageIndex, refreshData, unstitchedImageList, orderIndex }) {
  const applicationSettings = useAppSettings();
  const {
    REACT_APP_COMPANY_NAME,
    REACT_APP_COMPANY_SUBNAME
  } = process.env;
  const [modelImages, setModelImages] = useState([]);
  const [workDescriptions, setWorkDescriptions] = useState([])
  const [mainData, setMainData] = useState(common.cloneObject(orderData));
  const printRef = useRef();

  useEffect(() => {
    if (!orderData?.orderNo || !mainData?.orderDetails) return;

    let designSampleIds = "";
    mainData?.orderDetails?.forEach((ele) => {
      if (ele.designSampleId > 0) {
        designSampleIds += `moduleIds=${ele.designSampleId}&`;
      }
    });
    if (designSampleIds !== "") {
      Api.Get(apiUrls.fileStorageController.getFileByModuleIdsAndName + `${0}?${designSampleIds}`).then((res) => {
        setModelImages(res.data);
      });
    }
  }, [orderData]);

  useEffect(() => {
    if (!orderData?.orderNo || !mainData?.orderDetails) return;

    Api.Get(apiUrls.workDescriptionController.getOrderWorkDescriptionByOrderId + `${orderData?.id}`).then((res) => {
      setWorkDescriptions(res.data);
    });
  }, []);

  useEffect(() => {
    Api.Get(apiUrls.orderController.get + `${orderData.id}`).then((res) => {
      if (res.data?.id > 0) setMainData(res.data);
    });
  }, [refreshData]);

  const getWorkDescription = React.useCallback((orderDetailId, workTypeCode) => {
    if (!workDescriptions || workDescriptions.length === 0)
      return "";
    return workDescriptions?.filter(x => x.orderDetailId === orderDetailId && x.workTypeCode === workTypeCode)?.map(x => x.value).join(", ");
  }, [workDescriptions]);

  const getWorkTypeName = React.useCallback((orderDetailId, workTypeCode) => {
    //M. EMB |  COM. EMB
    debugger
    if (!workDescriptions || workDescriptions.length === 0)
      return "";
    var workType= workDescriptions?.find(x => x.orderDetailId === orderDetailId && x.workTypeCode === workTypeCode)?.workType;
    switch(workType){
      case "Machine Embroidery":
        return "M. EMB";
      case "COM. Embroidery" || "Computer Embroidery":
        return "COM. EMB";
      case "Hand Embroidery":
        return "H. EMB";
      case "IND. EMB" || "IND H.EMB":
        return "IND. H.EMB";
      default:
        return workType;
    }
  }, [workDescriptions]);

  if (!orderData?.orderNo) {
    return <></>;
  }

  // const getModelImage = (id) => {
  //   const imagePath = modelImages.find((x) => x.moduleId === id);
  //   return imagePath ? imagePath.filePath : "";
  // };

  // Helper function to split array into chunks of specified size
  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const getUnstitchedImage = (orderDetailId) => {
    if (unstitchedImageList.length === 0)
      return '';
    var imgUnstiched = unstitchedImageList.find(x => x.moduleId === orderDetailId);
    if (imgUnstiched === undefined)
      return '';
    return process.env.REACT_APP_API_URL + imgUnstiched.thumbPath;
  }



  // Split the order details into chunks of 3 for pagination
  const paginatedData = chunkArray(mainData?.orderDetails || [], 2);
  return (
    <>
      <div className="d-flex justify-content-between">
        <ButtonBox type="back" onClickHandler={() => setPageIndex(0)} className="btn-sm" />
        <ReactToPrint
          trigger={() => (
            <button className="btn btn-sm btn-warning" data-bs-dismiss="modal">
              <i className="bi bi-printer"></i> Print Work Sheet
            </button>
          )}
          content={() => printRef.current}
        />
      </div>
      <div ref={printRef} style={{ padding: "10px", fontSize: "10px" }}>
        {paginatedData.map((page, pageIndex) => (
          <div key={pageIndex} style={{ pageBreakAfter: "always" }}>
            <div className="row">
              {page.map((ele, index) => (
                <React.Fragment key={ele.id}>
                  <div className="col-12" style={{ maxHeight: "130mm", marginTop: '50px' }}>
                    <div className="card shadow-none">
                      <table className="table table-bordered w-100 workersheet-table">
                        <tbody>
                          <tr>
                            <td colSpan={6} className="text-center">
                              <div>
                                <div className="displayInlineBlock">
                                  <span>Printed On {common.getHtmlDate(new Date(), 'ddmmyyyyhhmm')}</span>
                                  <span className="fw-bold px-1">{REACT_APP_COMPANY_NAME} {REACT_APP_COMPANY_SUBNAME}({process.env.REACT_APP_COMPANY_SORT_NAME}) {ele?.orderNo}</span>
                                </div>
                                <div className="fw-bold">WORKER SHEET</div>
                              </div>
                            </td>
                            <td rowSpan={19}></td>
                            <td colSpan={2}>{REACT_APP_COMPANY_NAME} ({process.env.REACT_APP_COMPANY_SORT_NAME})</td>
                          </tr>
                          <tr>
                            <td className="text-uppercase fs-11"><strong>Customer</strong></td>
                            <td className="minW70">{ele.measurementCustomerName || mainData.customerName.split("-")[0].trim()}</td>

                            <td className="text-uppercase fs-11"><strong>Model</strong></td>
                            <td className="minW20">{ele.designModel}</td>
                            <td className="text-uppercase fs-11 minW90"><strong>Delivery D.</strong></td>
                            <td className="minW70">{common.getHtmlDate(mainData.orderDeliveryDate, "ddmmyy")}</td>
                            <td className="text-uppercase fs-11 minW100 fw-bold">Salesman</td>
                            <td className="minW70">{mainData.salesman.split(" ")[0].trim()}</td>
                          </tr>
                          <tr>
                            <td className="text-uppercase fs-11 "><strong>Grade</strong></td>
                            <td>{common.getGrade(ele.subTotalAmount)}</td>
                            <td className="text-uppercase fs-11"><strong>Neck</strong></td>
                            <td>{ele.neck}</td>
                            <td className="text-uppercase fs-11"><strong>Shape</strong></td>
                            <td>{ele?.shape}</td>
                            <td className="text-uppercase fs-11 minW100 fw-bold">{ele.measurementCustomerName || mainData.customerName.split("-")[0].trim()}</td>
                            <td className="minW70 fw-bold">{ele.orderNo}</td>
                          </tr>
                          <tr>
                            <td className="text-uppercase fs-11"><strong>QTY</strong></td>
                            <td>{mainData.orderDetails.length}</td>
                            <td className="text-uppercase fs-11 fs-6"><strong>Sleeve loos</strong></td>
                            <td>{ele.sleeveLoose}</td>
                            <td className="text-uppercase fs-11"><strong>size</strong></td>
                            <td>{ele?.mainSize}</td>

                            <td className="text-uppercase fs-11 fw-bold" colSpan={4}>
                              <div className="displayInlineBlock">
                                <div>Grade: {common.getGrade(ele.subTotalAmount)}</div>
                                <div>Qty: {mainData.orderDetails.length}</div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            {
                              getWorkDescription(ele?.id, "2") !== '' && <>
                                <td style={{ Height: '50px' }} className="text-uppercase fs-11 fs-6 center-align"><strong>cutting</strong></td>
                                <td colSpan={3}>{getWorkDescription(ele?.id, "2")} </td>
                              </>
                            }
                            {
                              getWorkDescription(ele?.id, "2") === '' && <>
                                <td style={{ height: '20px' }} colSpan={4} className="text-uppercase fs-11 fs-6 center-align"></td>
                              </>
                            }

                            <td className="text-uppercase fs-11"><strong>Salesman</strong></td>
                            <td>{mainData.salesman.split(" ")[0].trim()}</td>
                            <td colSpan={2} rowSpan={18}>
                              <table>
                                <tbody>
                                  <tr>
                                    <td className="text-uppercase fs-11 fw-bold">Length</td>
                                    <td>{ele?.length}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-uppercase fs-11 fw-bold">Chest</td>
                                    <td>{ele.chest}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-uppercase fs-11 fw-bold">waist</td>
                                    <td>{ele.waist}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-uppercase fs-11 fw-bold">hipps</td>
                                    <td>{ele.hipps}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-uppercase fs-11 fw-bold">bottom</td>
                                    <td>{ele.bottom}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-uppercase fs-11 fw-bold">sleeve</td>
                                    <td>{ele.sleeve}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-uppercase fs-11 fw-bold">s. loosing</td>
                                    <td>{ele.sleeveLoose}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-uppercase fs-11 fw-bold">shoulder</td>
                                    <td>{ele.shoulder}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-uppercase fs-11 fw-bold">neck</td>
                                    <td>{ele.neck}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-uppercase fs-11 fw-bold">deep</td>
                                    <td>{ele.deep}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-uppercase fs-11 fw-bold">BACK down</td>
                                    <td>{ele.backDown}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-uppercase fs-11 fw-bold">extra</td>
                                    <td>{ele.extra}</td>
                                  </tr>

                                  <tr>
                                    <td className="text-uppercase fs-11 fw-bold">Note</td>
                                    <td>{ele.description}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={6}>
                              <tr>
                                <table style={{ width: '581px',minHeight:'230px' }}>
                                  <tbody>
                                    <tr>
                                      {getWorkDescription(ele?.id, "1") !== '' && <>
                                        <td style={{ width: '100px', Height: '50px' }} className="text-uppercase fs-11 fs-6 center-align"><strong>Design</strong></td>
                                        <td className="text-uppercase fs-11 fw-bold" style={{minWidth:'220px'}} colSpan={3}>
                                          {getWorkDescription(ele?.id, "1")}
                                        </td>
                                      </>}
                                      {getWorkDescription(ele?.id, "1") === '' && <>
                                        <td ></td>
                                        <td style={{ width: '400px' }} colSpan={3}></td>
                                      </>}
                                      <td style={{ width: '150px' }} className="text-uppercase fs-11" colSpan={2} rowSpan={10}>
                                        {
                                          getUnstitchedImage(ele?.id) !== "" && <img style={{ height: '270px', width: '180px', border: '3px solid', borderRadius: '5px' }} src={getUnstitchedImage(ele?.id)?.replace("thumb_", "")} />
                                        }
                                      </td>
                                    </tr>
                                    <tr>
                                    </tr>
                                    {
                                      getWorkDescription(ele?.id, "3") !== '' && <>
                                        <tr>
                                          <td style={{ Height: '50px' }} className="text-uppercase fs-11 fs-6 center-align"><strong>{getWorkTypeName(ele?.id, "3")}</strong>
                                          </td>
                                          <td className="text-uppercase fs-11" colSpan={3}>{getWorkDescription(ele?.id, "3")}</td>
                                        </tr>
                                      </>
                                    }
                                    {
                                      getWorkDescription(ele?.id, "4") !== '' && <>
                                        <tr>
                                          <td style={{ Height: '50px' }} className="text-uppercase fs-11 fs-6 center-align"><strong>CRY | PKT-{ele?.crystal}</strong></td>
                                          <td className="text-uppercase fs-11" colSpan={3}>{getWorkDescription(ele?.id, "4")}</td>
                                        </tr>
                                      </>
                                    }
                                    {getWorkDescription(ele?.id, "5") !== '' && <>  <tr>
                                      <td style={{ Height: '50px' }} className="text-uppercase fs-11 fs-6 center-align"><strong>{getWorkTypeName(ele?.id, "5")}</strong></td>
                                      <td className="text-uppercase fs-11" colSpan={3}>{getWorkDescription(ele?.id, "5")}</td>
                                    </tr>
                                    </>
                                    }
                                    {
                                      getWorkDescription(ele?.id, "6") !== '' && <>  <tr>
                                        <td style={{ Height: '50px' }} className="text-uppercase fs-11 fs-6 center-align"><strong>APLIQ</strong></td>
                                        <td className="text-uppercase fs-11" colSpan={3}>{getWorkDescription(ele?.id, "6")}</td>
                                      </tr>
                                      </>
                                    }
                                    {
                                      getWorkDescription(ele?.id, "7") !== '' && <>
                                        <tr>
                                          <td style={{ Height: '50px' }} className="text-uppercase fs-11 fs-6 center-align"><strong>{getWorkTypeName(ele?.id, "7")}</strong></td>
                                          <td className="text-uppercase fs-11" colSpan={3}>{getWorkDescription(ele?.id, "7")}</td>
                                        </tr>
                                       
                                      </>
                                    }
                                    <tr>
                                      <td className="fw-bold gray-bg center-align">NOTE</td>
                                      <td style={{ width: '300px' }} className="text-uppercase fs-11" colSpan={5}>{ele?.description}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </tr>
                            </td>
                          </tr>

                        </tbody>
                        {/* <tbody>
                              <tr>
                                <td colSpan={6} className="text-center">
                                {common.defaultIfEmpty(applicationSettings?.en_companyname?.value, REACT_APP_COMPANY_NAME)} {common.defaultIfEmpty(applicationSettings?.en_companysubname?.value, REACT_APP_COMPANY_SUBNAME)}
                                </td>
                              </tr>
                              <tr>
                                <td colSpan={2} className="text-center fw-bold fs-6">
                                  Worker Sheet
                                </td>
                                <td colSpan={2} className="text-center fw-bold fs-6">
                                  Order No: *{ele.orderNo}*
                                </td>
                                <td colSpan={2} className="text-center fw-bold fs-6">
                                  Date: {common.getHtmlDate(new Date(), "ddmmyyyy")}
                                </td>
                              </tr>
                              <tr>
                                <td>Kandoora No</td>
                                <td className="fw-bold">{ele.orderNo}</td>
                                <td>Salesman</td>
                                <td className="fw-bold">{mainData.salesman.split(" ")[0].trim()}</td>
                                <td>D. Date</td>
                                <td className="fw-bold">{common.getHtmlDate(mainData.orderDeliveryDate, "ddmmyyyy")}</td>
                              </tr>
                              <tr>
                                <td>Qty</td>
                                <td className="fw-bold">{mainData.orderDetails.length}</td>
                                <td>Grade</td>
                                <td className="fw-bold">{common.getGrade(ele.subTotalAmount)}</td>
                                <td>Name</td>
                                <td className="fw-bold">
                                  {ele.measurementCustomerName || mainData.customerName.split("-")[0].trim()}
                                </td>
                              </tr>
                              <tr>
                                <td className="text-uppercase fs-11">Customer Name</td>
                                <td className="text-uppercase fs-11">Neck</td>
                                <td className="text-uppercase fs-11">Sleeve Loos.</td>
                                <td rowSpan={2} className="text-uppercase fs-11">Model No.</td>
                                <td rowSpan={2} colSpan={2} className="text-uppercase fs-11 fw-bold">
                                  {ele.designModel}
                                </td>
                              </tr>
                              <tr>
                                <td className="text-uppercase fs-11 fw-bold">{mainData.customerName}</td>
                                <td className="text-uppercase fs-11 fw-bold">{ele.neck}</td>
                                <td className="text-uppercase fs-11 fw-bold">{ele.sleeveLoose}</td>
                              </tr>
                              <tr>
                                <td>Cut. Master</td>
                                <td></td>
                                <td>Hand. Emb.</td>
                                <td></td>
                                <td rowSpan={5} colSpan={2}>
                                  <img
                                    style={{ display: "block", width: "100%", maxHeight: "96px" }}
                                    onError={(e) => (e.target.src = "/assets/images/default-image.jpg")}
                                    src={process.env.REACT_APP_API_URL + getModelImage(ele.designSampleId)}
                                    alt="Design Sample"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>Machine Emb.</td>
                                <td></td>
                                <td>Stitch Man.</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>Crystal Man.</td>
                                <td></td>
                                <td>Other</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td colSpan={4}>Check and updated by............</td>
                              </tr>
                            </tbody> */}
                      </table>
                    </div>
                  </div>
                  {/* <div key={ele.orderNo} className="col-3 mx-auto">
                                <div className="card border shadow-none">
                                    <table className='table table-bordered' style={{ margin: '0px' }}>
                                        <tbody>
                                            <tr >
                                                <td style={{ padding: '0px' }} colSpan={2} className="text-center">  {common.defaultIfEmpty(applicationSettings?.en_companyname?.value, REACT_APP_COMPANY_NAME)} {common.defaultIfEmpty(applicationSettings?.en_companysubname?.value, REACT_APP_COMPANY_SUBNAME)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0 0 0 5px' }}>Kandoora No :</td>
                                                <td style={{ padding: '0px' }} className="text-center">{ele.orderNo}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0 0 0 5px' }}>Customer</td>
                                                <td style={{ padding: '0px' }} className="text-center">{ele.measurementCustomerName === null || ele.measurementCustomerName === "" ? mainData.customerName.split('-')[0].trim() : ele.measurementCustomerName}</td>
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
                            </div> */}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
