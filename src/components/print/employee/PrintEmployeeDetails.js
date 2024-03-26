import React,{useRef} from 'react'
import Label from '../../common/Label'
import InvoiceHead from '../../common/InvoiceHead'
import { common } from '../../../utils/common'
import ReactToPrint from 'react-to-print';
import ButtonBox from '../../common/ButtonBox';
import PrintLabel from '../../common/PrintLabel';

export default function PrintEmployeeDetails({empData }) {
    const printRef = useRef();
    return (
        <div className="modal fade" id={"printEmpDetailModel"} tabIndex="-1" aria-labelledby={"printEmpDetailModel" + "Label"} aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={"printEmpDetailModel" + "Label"}>Print EmpDetails</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div ref={printRef} className='p-3'>
                            <InvoiceHead receiptType='Employee Details'/>
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <fieldset>
                                            <legend>Employee Type</legend>
                                            <div className='row'>
                                                <div className="col-12">
                                                    <PrintLabel label="Last Name" text={`Fixed Employee :${empData?.isFixedEmployee ? "Yes":"No"}`} />
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <legend>Personal Details</legend>
                                            <div className='row'>
                                                <div className="col-3">
                                                   <PrintLabel label="First Name" text={empData?.firstName}/>
                                                </div>
                                                <div className="col-3">
                                                <PrintLabel label="Last Name" text={empData?.lastName} />
                                                </div>
                                                <div className="col-3">
                                                    <PrintLabel label="Contact" text={`${empData?.contact}`} />
                                                </div>
                                                <div className="col-3">
                                                    <PrintLabel label="Contact 2" text={`${empData?.contact2}`} />
                                                </div>
                                                <div className="col-3">
                                                    <PrintLabel label="Email" text={`${empData?.email}`} />
                                                </div>
                                                <div className="col-3">
                                                    <PrintLabel label="Nationality" text={`${empData?.country}`}/></div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <legend>Douments</legend>
                                            <div className='row'>
                                                <div className="col-3">
                                                    <PrintLabel label="Passport No." text={`${empData?.passportNumber}`} />
                                                </div>
                                                <div className="col-3">
                                                    <PrintLabel label="Passport Expiry" text={`${common.getHtmlDate(empData?.passportExpiryDate,'ddmmyyyy')}`} />
                                                </div>
                                                <div className="col-3">
                                                    <PrintLabel label="Work Permit Id" text={`${empData?.workPermitID}`} />
                                                </div>
                                                <div className="col-3">
                                                    <PrintLabel label="Work Permit Expiry" text={`${common.getHtmlDate(empData?.workPEDate,'ddmmyyyy')}`} />
                                                </div>
                                                <div className="col-3">
                                                    <PrintLabel label="Emirates Id" text={`${empData?.emiratesId}`} />
                                                </div>
                                                <div className="col-3">
                                                    <PrintLabel label="Emirates ID Expiry" text={`${common.getHtmlDate(empData?.emiratesIdExpire,'ddmmyyyy')}`} />
                                                </div>
                                                <div className="col-3">
                                                    <PrintLabel label="Daman Number" text={`${empData?.damanNo??"NA"}`} />
                                                </div>
                                                <div className="col-3">
                                                    <PrintLabel label="Daman Number Expiry" text={`${common.getHtmlDate(empData?.damanNoExpire??'','ddmmyyyy')}`} />
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <legend>Role And Salary</legend>
                                            <div className="row">
                                                <div className="col-3">
                                                    <PrintLabel label="Job Title" text={`${empData.jobTitle}`}/>
                                                </div>
                                                <div className="col-3">
                                                    <PrintLabel label="Joining Date" text={`${common.getHtmlDate(empData?.hireDate,'ddmmyyyy')}`} />
                                                </div>
                                                <div className="col-3">
                                                    <PrintLabel label="Employee Status" text={`${empData.empStatusName}`} />
                                                </div>
                                                <div className="col-3">
                                                    <PrintLabel label="Cancel Date" text={`${common.getHtmlDate(empData?.cancelDate??new Date(),'ddmmyyyy')}`} />
                                                </div>
                                                <div className="col-3">
                                                    <PrintLabel label="Company" text={`${empData?.companyName}`} />
                                                </div>
                                                <div className="col-3">
                                                    <PrintLabel label="Basic Salary" text={`${empData?.basicSalary}`} />
                                                </div>
                                                <div className="col-3">
                                                    <PrintLabel label="Accomodation" text={`${empData?.accomodation}`} />
                                                </div>
                                                <div className="col-3">
                                                    <PrintLabel label="Transportation" text={`${empData?.transportation??0}`} />
                                                </div>
                                                <div className="col-3">
                                                    <PrintLabel label="Other Allowance" text={`${empData?.otherAllowance??0}`} />
                                                </div>
                                                <div className="col-3">
                                                    <PrintLabel label="Role" text={`${empData?.role}`}/>
                                                </div>
                                                {empData?.isFixedEmployee &&
                                                    <>
                                                        <div className="col-3">
                                                            <PrintLabel label="Net Salary" text={`${empData?.salary}`} />
                                                        </div>
                                                    </>
                                                }
                                                <div className="col-12">
                                                    <PrintLabel label="Address" text={`${empData?.address}`} />
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                                <ButtonBox type="cancel" modelDismiss={true} className="btn-sm"></ButtonBox>
                                <ReactToPrint
                                    trigger={() => {
                                        return <button className='btn btn-sm btn-success' data-bs-dismiss="modal"><i className='bi bi-printer'></i> Print</button>
                                    }}
                                    content={(el) => (printRef.current)}
                                />
                            </div>
                </div>
            </div>
        </div>
    )
}
