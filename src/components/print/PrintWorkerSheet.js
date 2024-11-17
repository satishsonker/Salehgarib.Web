import React, { useState, useEffect, useRef } from "react";
import { Api } from "../../apis/Api";
import { apiUrls } from "../../apis/ApiUrls";
import { common } from "../../utils/common";
import ButtonBox from "../common/ButtonBox";
import ReactToPrint from "react-to-print";

export default function PrintWorkerSheet({ orderData, pageIndex, setPageIndex, refreshData }) {
  const [modelImages, setModelImages] = useState([]);
  const [mainData, setMainData] = useState(common.cloneObject(orderData));
  const printRef = useRef();

  useEffect(() => {
    if (!orderData?.orderNo || !mainData?.orderDetails) return;

    let designSampleIds = "";
    mainData?.orderDetails?.forEach((ele) => {
      designSampleIds += `moduleIds=${ele.designSampleId}&`;
    });

    Api.Get(apiUrls.fileStorageController.getFileByModuleIdsAndName + `${0}?${designSampleIds}`).then((res) => {
      setModelImages(res.data);
    });
  }, [orderData, pageIndex]);

  useEffect(() => {
    Api.Get(apiUrls.orderController.get + `${orderData.id}`).then((res) => {
      if (res.data?.id > 0) setMainData(res.data);
    });
  }, [refreshData]);

  if (!orderData?.orderNo) {
    return <></>;
  }

  const getModelImage = (id) => {
    const imagePath = modelImages.find((x) => x.moduleId === id);
    return imagePath ? imagePath.filePath : "";
  };

  // Helper function to split array into chunks of specified size
  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  // Split the order details into chunks of 3 for pagination
  const paginatedData = chunkArray(mainData?.orderDetails || [], 3);

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
                <React.Fragment key={ele.id} className="mt-2">
                  <div className="col-9" style={{ height: "370px", maxHeight: "370px" }}>
                    <div className="card shadow-none">
                      <div className="row">
                        <div className="col-12">
                          <table className="table table-bordered">
                            <tbody>
                              <tr>
                                <td colSpan={6} className="text-center">
                                  {process.env.REACT_APP_COMPANY_NAME}
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
                                <td className="text-uppercase">Customer Name</td>
                                <td className="text-uppercase">Neck</td>
                                <td className="text-uppercase">Sleeve Loos.</td>
                                <td rowSpan={2} className="text-uppercase">Model No.</td>
                                <td rowSpan={2} colSpan={2} className="text-uppercase fw-bold">
                                  {ele.designModel}
                                </td>
                              </tr>
                              <tr>
                                <td className="text-uppercase fw-bold">{mainData.customerName}</td>
                                <td className="text-uppercase fw-bold">{ele.neck}</td>
                                <td className="text-uppercase fw-bold">{ele.sleeveLoose}</td>
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
                            </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
