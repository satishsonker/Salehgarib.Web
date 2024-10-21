import React, { useEffect, useState } from 'react'
import ButtonBox from '../../common/ButtonBox'
import DisplayLabel from '../../common/DisplayLabel'
import { common } from '../../../utils/common'
import { Api } from '../../../apis/Api';
import { apiUrls } from '../../../apis/ApiUrls';
import Label from '../../common/Label';
import Dropdown from '../../common/Dropdown';
import ErrorLabel from '../../common/ErrorLabel';
import Inputbox from '../../common/Inputbox';
import { validationMessage } from '../../../constants/validationMessage';
import { toast } from 'react-toastify';
import { toastMessage } from '../../../constants/ConstantValues';

export default function BalancePaymentPopup({ invoiceData }) {
    const statementTypeEnum = {
        invoice: 'invoice',
        customer: 'customer'
    }
    const payModelTemplate = {
        paymentMode: 'Cash',
        credit:0,
        id: 0,
        fabricCustomerId: invoiceData?.fabricCustomerId,
        fabricSaleId: invoiceData?.id,
        debit: 0,
        reason: 'Payment Received',
        remark: 'From Balance Payment Page',
        paymentDate: common.getHtmlDate(new Date())
    }

    const [searchTerm, setSearchTerm] = useState('');
    const [statementType, setStatementType] = useState(statementTypeEnum.invoice)
    const [statement, setStatement] = useState([]);
    const [paymentMode, setPaymentMode] = useState([]);
    const [payModel, setPayModel] = useState({ ...payModelTemplate });
    const [error, setError] = useState();
    const [refreshStatement, setRefreshStatement] = useState(0);

    const textChangeHandler = (e) => {
        var { name, type, value } = e.target;
        if (type === 'number') {
            value = parseFloat(value);
            //value = isNaN(value) ? 0 : value;
        }
        setPayModel({ ...payModel, [name]: value });
    }

    useEffect(() => {
        if (invoiceData?.id > 0 || invoiceData?.fabricCustomerId > 0) {
            var url = statementType === statementTypeEnum.invoice ? apiUrls.fabricSaleController.getStatmentByInvoiceId + invoiceData?.id : apiUrls.fabricSaleController.getStatmentByCustomerId + invoiceData?.fabricCustomerId;
            Api.Get(url)
                .then(res => {
                    setStatement([...res.data]);
                });
        }
    }, [invoiceData?.id, refreshStatement, statementType])

    useEffect(() => {
        if (invoiceData?.balanceAmount <= 0)
            return;
        Api.Get(apiUrls.masterDataController.getByMasterDataTypes + `?masterDataTypes=payment_mode`)
            .then(res => {
                setPaymentMode([...res.data]);
            })
    }, [invoiceData?.balanceAmount]);

    const calculateBalanceAmount = () => {
        var totalPaid = statement?.reduce((sum, ele) => {
            return sum += ele?.credit;
        }, 0);
        if (statementType === 'invoice')
            return (invoiceData?.totalAmount ?? 0) - totalPaid;
        else {
            var totalDebit = statement?.reduce((sum, ele) => {
                return sum += ele?.debit;
            }, 0);
            return (totalDebit ?? 0) - totalPaid;
        }
    }

    const validate = () => {
        var err = {};
        if (isNaN(payModel.credit) || payModel.credit <= 0) err.credit = validationMessage.paidAmountRequired;
        if (payModel.paymentMode === "") err.paymentMode = validationMessage.paymentModeRequired;
        if (payModel.paymentDate === "" || payModel.paymentDate === undefined) err.paymentDate = validationMessage.paymentDateRequired;
        setError({ ...err });
        return err;
    }

    const handleOptionChange = (e) => {
        setStatementType(e.target.value);
    }
    const handlePayBalance = () => {
        var err = validate();
        if (Object.keys(err).length > 0)
            return;
        var dataModel = payModel;
        dataModel.fabricCustomerId = invoiceData?.fabricCustomerId;
        dataModel.fabricSaleId = invoiceData?.id;
        Api.Post(apiUrls.fabricSaleController.payBalance, payModel)
            .then(res => {
                if (res.data === true) {
                    toast.success(toastMessage.saveSuccess);
                    setPayModel({ ...payModelTemplate });
                    setRefreshStatement(pre => pre + 1);
                }
            })
    }

    const groupByFabricInvoiceNo = (data) => {
        return data.reduce((groups, item) => {
            const group = groups[item.invoiceNo] || [];
            group.push(item);
            groups[item.invoiceNo] = group;
            return groups;
        }, {});
    };
    const groupedData = groupByFabricInvoiceNo(statement);
    const filteredData = Object.keys(groupedData).filter(invoiceNo => {
        // If searchTerm is empty, return all invoiceNo
        if (!searchTerm) return true;
        // Filter based on invoiceNo
        return invoiceNo.includes(searchTerm);
    });
    return (
        <>
            <div className="modal fade" id="balancePaymentPopupModel" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="balancePaymentPopupModel-label" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="balancePaymentPopupModel-label">Statement of {statementTypeEnum.customer === statementType ? invoiceData?.customerName : ` invoice no. ${invoiceData?.invoiceNo ?? 'xxxxxx'}`}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='row'>
                                <div className='col-12'>
                                    <div className='d-flex justify-content-between'>
                                        <div>
                                            <div className="form-group">
                                                <h6>Select statement type:</h6>
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="inlineRadioOptions"
                                                        id="inlineRadio1"
                                                        value={statementTypeEnum.invoice}
                                                        checked={statementType === statementTypeEnum.invoice}
                                                        onChange={handleOptionChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="inlineRadio1">
                                                        Invoice
                                                    </label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="inlineRadioOptions"
                                                        id="inlineRadio2"
                                                        value={statementTypeEnum.customer}
                                                        checked={statementType === statementTypeEnum.customer}
                                                        onChange={handleOptionChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="inlineRadio2">
                                                        Customer
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        {statementTypeEnum.customer === statementType && <div>
                                            <h6>Search by invoice no.:</h6>
                                            <input
                                                type="text"
                                                style={{ width: '100%' }}
                                                className="form-control form-control-sm form-check-input"
                                                id="search"
                                                placeholder="Enter Invoice Number"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className='row'>
                                <div className={statementTypeEnum.customer === statementType ? 'col-4' : 'col-2'}>
                                    <DisplayLabel headingText="Customer" contentText={invoiceData?.customerName} conentfontSize='15px' contentBold={true} />
                                </div>
                                <div className={statementTypeEnum.customer === statementType ? 'col-4' : 'col-2'}>
                                    <DisplayLabel headingText="Contact" contentText={invoiceData?.contact} conentfontSize='15px' contentBold={true} />
                                </div>
                                {statementTypeEnum.customer === statementType && <>
                                    <div className='col-4'>
                                        <DisplayLabel headingText="Total Invoices" contentText={Object.keys(groupedData)?.length} conentfontSize='15px' contentBold={true} />
                                    </div>
                                </>}
                                {statementTypeEnum.invoice === statementType && <>
                                    <div className='col-2'>
                                        <DisplayLabel headingText="Sale Date" contentText={common.getHtmlDate(invoiceData?.saleDate, 'ddmmyyyy')} conentfontSize='15px' contentBold={true} />
                                    </div>
                                    <div className='col-2'>
                                        <DisplayLabel headingText="Delivery Date" contentText={common.getHtmlDate(invoiceData?.deliveryDate, 'ddmmyyyy')} conentfontSize='15px' contentBold={true} />
                                    </div>
                                    <div className='col-2'>
                                        <DisplayLabel headingText="Invoice Amount" contentText={invoiceData?.totalAmount} conentfontSize='15px' contentBold={true} />
                                    </div>
                                    <div className='col-2'>
                                        <DisplayLabel headingText="Balance Amount" contentText={calculateBalanceAmount()} conentfontSize='15px' contentBold={true} />
                                    </div>
                                </>}
                            </div>
                            <hr />
                            {statementTypeEnum.invoice === statementType && <>
                                <table className='table table-bordered table-striped fixTableHead'>
                                    <thead>
                                        <tr>
                                            <th>Sr.</th>
                                            <th>Payment Type</th>
                                            <th>Amount</th>
                                            <th>Date</th>
                                            <th>Payment Mode</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {statement?.map((ele, ind) => {
                                            return <tr key={ind}>
                                                <td>{(ind + 1)}</td>
                                                <td>{ele?.reason}</td>
                                                <td>{common.printDecimal(ele?.credit)}</td>
                                                <td>{common.getHtmlDate(ele?.paymentDate, 'ddmmyyyy')}</td>
                                                <td>{ele?.paymentMode}</td>
                                            </tr>
                                        })}
                                    </tbody>
                                </table>
                                <hr />
                                {calculateBalanceAmount() > 0 &&
                                    <div className='row'>
                                        <div className='col-2'>
                                            <Inputbox labelText="Total Balance" disabled={true} value={calculateBalanceAmount()}></Inputbox>
                                        </div>
                                        <div className='col-3'>
                                            <Label text="Payment Mode" isRequired={true} />
                                            <Dropdown data={paymentMode} elementKey="value" className="form-control-sm" value={payModel.paymentMode} name="paymentMode" onChange={textChangeHandler} />
                                            <ErrorLabel message={error?.paymentMode} />
                                        </div>
                                        <div className='col-2'>
                                            <Inputbox labelText="Amount" isRequired={true} errorMessage={error?.credit} min={0} type="number" max={100000} title="Enter amount to be paid" name="credit" value={payModel?.credit} onChangeHandler={textChangeHandler}></Inputbox>
                                        </div>
                                        {((calculateBalanceAmount() ?? 0) - payModel?.credit) > 0 &&
                                            <div className='col-2'>
                                                <Inputbox labelText="Remaining" min={0} type="number" disabled={true} max={100000} title="Enter amount to be paid" value={(calculateBalanceAmount()-payModel.credit).toFixed(2)}></Inputbox>
                                            </div>
                                        }
                                        {(payModel?.credit) > 0 &&
                                            <>
                                                <div className='col-2'>
                                                    <Inputbox labelText="Payment Date" isRequired={true} errorMessage={error?.paymentDate} type="date" title="Select payemnt date." name="paymentDate" value={payModel?.paymentDate} onChangeHandler={textChangeHandler}></Inputbox>
                                                </div>
                                                <div className='col-2' style={{ marginTop: '20px' }}>
                                                    <ButtonBox type="save" onClickHandler={handlePayBalance} className="btn-sm"></ButtonBox>
                                                </div>
                                            </>

                                        }
                                    </div>
                                }
                                {calculateBalanceAmount() === 0 && <>
                                    <div className='row'>
                                        <div className='col-12 text-center'>
                                            <div className='alert alert-success'>
                                                Amount is completly paid by customer.
                                            </div>
                                        </div>
                                    </div>
                                </>
                                }
                            </>}
                            {statementTypeEnum.customer === statementType && <> <div className="container mt-3">
                                <div className='alert alert-info h6 text-center text-capitalize'>Customer Account Statements</div>
                                <div style={{ maxHeight: '300px', overflowY: 'scroll', overflowX: 'hidden' }}>
                                    <table className="table table-bordered  table-striped fixTableHead">
                                        <tbody>
                                            {/* If no data matches the search, show a message */}
                                            {filteredData.length === 0 && (
                                                <tr>
                                                    <td colSpan="7" className="text-center"> <div className='alert alert-danger h6 text-center text-capitalize'>No Record Found</div></td>
                                                </tr>
                                            )}

                                            {filteredData.map((invoiceNo) => (
                                                <React.Fragment key={invoiceNo}>
                                                    {/* First row with only FabricSaleId */}
                                                    <tr>
                                                        <td colSpan="4" className="table-primary">
                                                            <div className='row'>
                                                                <div className='col-3'>
                                                                    <DisplayLabel headingText="Invoice No" contentText={invoiceNo} conentfontSize='15px' contentBold={true} />
                                                                </div>
                                                                <div className='col-2'>
                                                                    <DisplayLabel headingText="Invoice Amount" contentText={(groupedData[invoiceNo][0]?.totalAmount ?? 0).toFixed(2)} conentfontSize='15px' contentBold={true} />
                                                                </div>
                                                                <div className='col-2'>
                                                                    <DisplayLabel headingText="After Discount" contentText={(groupedData[invoiceNo][0]?.totalAfterDiscount ?? 0).toFixed(2)} conentfontSize='15px' contentBold={true} />
                                                                </div>
                                                                <div className='col-2'>
                                                                    <DisplayLabel headingText="Paid" contentText={(groupedData[invoiceNo][0]?.paidAmount ?? 0).toFixed(2)} conentfontSize='15px' contentBold={true} />
                                                                </div>
                                                                <div className='col-3'>
                                                                    <DisplayLabel headingText="Balance" contentText={(groupedData[invoiceNo][0]?.balanceAmount ?? 0).toFixed(2)} conentfontSize='15px' contentBold={true} />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    {/* Header row for the details */}
                                                    <tr>
                                                        <th>Amount</th>
                                                        <th>Payment For</th>
                                                        <th>Payment Mode</th>
                                                        <th>Payment Date</th>
                                                    </tr>

                                                    {/* Rows for the grouped data */}
                                                    {groupedData[invoiceNo].map((item, index) => (
                                                        <tr key={index}>
                                                            <td className='text-end'>{item.credit.toFixed(2)}</td>
                                                            <td>{item.reason}</td>
                                                            <td>{item.paymentMode}</td>
                                                            <td>{new Date(item.paymentDate).toLocaleString()}</td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td colSpan={4}>
                                                            <hr></hr>
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                            </>}
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type="cancel" className="btn-sm" text="Close" modelDismiss={true} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

