import React, { useState, useEffect, useRef } from 'react'
import { common } from '../../utils/common';
import ButtonBox from '../common/ButtonBox'
import Dropdown from '../common/Dropdown'
import ErrorLabel from '../common/ErrorLabel';
import Inputbox from '../common/Inputbox'
import Label from '../common/Label';
import TableView from '../tables/TableView';
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import PrintOrderAdvanceReceipt from '../print/orders/PrintOrderAdvanceReceipt';
import { headerFormat } from '../../utils/tableHeaderFormat';

export default function NewAdvancePaymentTabPage({ order, tabPageIndex, paymentModeList, setTabPageIndex }) {
    const [printOrderAdnaceData, setPrintOrderAdnaceData] = useState();
    const [errors, setErrors] = useState({});
    const [addAdvancePaymentModelTemplate, setAddAdvancePaymentModelTemplate] = useState({
        orderId: 0,
        credit: 0,
        paymentMode: '',
        reason: '',
        remark: '',
        paymentDate: common.getHtmlDate(new Date()),
        customerId: 0,
        index: -1
    });
    const [addAdvancePaymentModel, setAddAdvancePaymentModel] = useState([]);


    const deleteNewAdvPaymentHandler = (index) => {
        let filterData = addAdvancePaymentModel.filter(x => x.index !== index);
        setAddAdvancePaymentModel(common.cloneObject(filterData));
    }
    const tableOptionNewAdvStatementTemplet = {
        headers: [
            { name: "Amount", prop: "credit", action: { decimal: true } },
            { name: "Payment Date", prop: "paymentDate" },
            { name: "Payment By", prop: "paymentMode" }
        ],
        showTableTop: false,
        showFooter: false,
        data: [],
        totalRecords: 0,
        actions: {
            showView: false,
            showEdit: false,
            showDelete: false,
            buttons: [
                {
                    modelId: "",
                    icon: "bi bi-trash",
                    title: 'Delete',
                    handler: deleteNewAdvPaymentHandler,
                    showModel: false
                }
            ]
        }
    }

    const printOrderAdvanceReceiptHandlerMain = (id, data) => {
        var obj = { order: order, advance: data };
        setPrintOrderAdnaceData(obj);
        setTabPageIndex(4)
    }
    const tableOptionAdvStatementTemplet = {
        headers: headerFormat.advancePaymentHistory,
        showTableTop: false,
        data: [],
        totalRecords: 0,
        actions: {
            showDelete: false,
            showEdit: false,
            showView: false,
            showPrint: true,
            print: {
                handler: printOrderAdvanceReceiptHandlerMain
            }
        }
    }
    const [tableOptionAdvStatement, setTableOptionAdvStatement] = useState(tableOptionAdvStatementTemplet);

    const onPageIndexChange = () => {
        if (tabPageIndex === 0 || order?.id === undefined)
            return;
        Api.Get(apiUrls.orderController.getAdvancePaymentStatement + order?.id)
            .then(res => {
                tableOptionAdvStatementTemplet.data = res.data;
                tableOptionAdvStatementTemplet.totalRecords = res.data.length;
                setTableOptionAdvStatement({ ...tableOptionAdvStatementTemplet });
            })
    }

    const handleAdveTxtChange = (e) => {
        let { type, name, value } = e.target;
        if (type === 'number') {
            value = parseFloat(value);
        }
        let modelData = addAdvancePaymentModelTemplate;
        modelData[name] = value;
        setAddAdvancePaymentModelTemplate({ ...modelData });
    }
    const addAdvPaymentData = () => {
        let formError = {};
        if (addAdvancePaymentModelTemplate.credit === 0)
            formError.credit = validationMessage.advanceAmountRequired;
        if (addAdvancePaymentModelTemplate.paymentMode === '')
            formError.paymentMode = validationMessage.paymentModeRequired;
        if (addAdvancePaymentModelTemplate.paymentDate === '')
            formError.paymentDate = validationMessage.paymentDateRequired;
        if (Object.keys(formError).length > 0) {
            setErrors({ ...formError });
            return;
        }
        else {
            setErrors({});
        }
        let mainData = addAdvancePaymentModel;
        addAdvancePaymentModelTemplate.customerId = order.customerId;
        addAdvancePaymentModelTemplate.orderId = order.id;
        addAdvancePaymentModelTemplate.reason = "AdvancedPaid";
        addAdvancePaymentModelTemplate.remark = "updated from delivery page";
        addAdvancePaymentModelTemplate.index = mainData.length;
        mainData.push(addAdvancePaymentModelTemplate);
        setAddAdvancePaymentModel(mainData);
        setAddAdvancePaymentModelTemplate({
            ...{
                orderId: 0,
                credit: 0,
                paymentMode: '',
                reason: '',
                remark: '',
                customerId: 0,
                index: -1,
                paymentDate: common.getHtmlDate(new Date()),
                paymentMode: "Cash"
            }
        });
    }
    useEffect(() => {
        onPageIndexChange();
    }, [tabPageIndex]);

    const saveAdvancePayment = () => {
        Api.Post(apiUrls.customerController.addAdvancePayment, addAdvancePaymentModel)
            .then(res => {
                if (res.data > 0) {
                    toast.success(toastMessage.saveSuccess);
                    setAddAdvancePaymentModel([]);
                    onPageIndexChange();
                }
            })
    }
    return (
        <div className='tab-page'>
            {tabPageIndex === 1 && <>
                <div className='row px-4'>
                    <div className='col-12 my-3'>
                        <div className='fs-6 fw-bold'>New Advance Payment</div>
                    </div>
                    <div className="col-3">
                        <Inputbox labelText="Amount" errorMessage={errors.credit} type="number" min={0} onChangeHandler={handleAdveTxtChange} value={addAdvancePaymentModelTemplate.credit} className="form-control-sm" name='credit' />
                    </div>
                    <div className="col-3">
                        <Inputbox labelText="Payment Date" max={common.getCurrDate()} className="form-control-sm" type="date" name="paymentDate" onChangeHandler={handleAdveTxtChange} value={addAdvancePaymentModelTemplate.paymentDate} errorMessage={errors.paymentDate} />
                    </div>
                    <div className="col-3">
                        <Label fontSize='12px' text="Payment Mode"></Label>
                        <Dropdown className='form-control-sm' onChange={handleAdveTxtChange} data={paymentModeList} value={addAdvancePaymentModelTemplate.paymentMode} defaultValue='Cash' elementKey="value" name="paymentMode" defaultText="Select payment mode" />
                        <ErrorLabel message={errors.paymentMode} />
                    </div>
                    <div className="col-3 mt-3 pt-1">
                        <ButtonBox type="add" className="btn-sm w-100" onClickHandler={addAdvPaymentData} />
                    </div>
                </div>
                {addAdvancePaymentModel.length > 0 && <>
                    <div className='row px-4'>
                    <div className="col-12 my-3">
                    <table className='table table-bordered my-3'>
                        <thead>
                            <tr>
                                {
                                    tableOptionNewAdvStatementTemplet.headers.map(ele => {
                                        return <th key={ele.name}>{ele.name}</th>
                                    })
                                }
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                addAdvancePaymentModel?.map((ele, index) => {
                                    return <tr key={ele.index}>
                                        {
                                            tableOptionNewAdvStatementTemplet.headers.map(header => {
                                                return <td key={header.prop}>{ele[header.prop]}</td>
                                            })
                                        }
                                        <td>
                                            <div style={{ cursor: "pointer !important" }}
                                                onClick={e => deleteNewAdvPaymentHandler(index)}
                                                className="text-danger"
                                                title="Delete">
                                                <i className="bi bi-trash"></i>
                                            </div>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                    </div>
                    <div className="col-12 text-end">
                        <ButtonBox onClickHandler={saveAdvancePayment} className="btn-sm" type="save" text="Save Payment" />
                    </div>
                    <div className='clearfix'></div>
                    </div>
                </>}
                <hr />
                <div className='row'>
                    <div className='px-4 fs-6 fw-bold col-4'>Payment History</div>
                    <div className='px-4 col-4'>Order Amount : {common.printDecimal(order?.totalAmount)}</div>
                    <div className='px-4 col-4 text-end'>Total Paid: {common.printDecimal(tableOptionAdvStatement.data.reduce((sum, ele) => { return sum + ele.credit }, 0))}</div>
                </div>
                <div style={{ maxHeight: '217px', overflowY: 'auto', overflowX: 'hidden' }}>
                    <TableView option={tableOptionAdvStatement} />
                </div>
            </>}
            {tabPageIndex === 4 && <>
                <PrintOrderAdvanceReceipt setTabPageIndex={setTabPageIndex} data={printOrderAdnaceData} statement={tableOptionAdvStatement.data}></PrintOrderAdvanceReceipt>
            </>}
        </div>
    )
}
