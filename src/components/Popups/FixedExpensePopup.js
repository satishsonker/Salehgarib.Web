import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import ButtonBox from '../common/ButtonBox';

export default function FixedExpensePopup() {
    const [kandooraHeadList, setKandooraHeadList] = useState([]);
    const [kandooraExpenseList, setKandooraExpenseList] = useState([])
    useEffect(() => {
        let apiList = [];
        apiList.push(Api.Get(apiUrls.masterController.kandooraExpense.getAll + `?pageNo=1&pageSize=10000`));
        apiList.push(Api.Get(apiUrls.masterController.kandooraHead.getAll + `?pageNo=1&pageSize=10000`));
        Api.MultiCall(apiList)
            .then(res => {
                if (res[0].data.data.length > 0) {
                    let modelData = {};
                    res[0].data.data.forEach(ele => {
                        modelData[ele.kandooraHeadId] = ele.amount;
                    });
                    setKandooraExpenseList(modelData);
                }
                setKandooraHeadList(res[1].data.data);
            })
    }, [])
    const expenseSum = () => {
        let sum = 0;
        for (var item in kandooraExpenseList) {
            sum += kandooraExpenseList[item];
        }
        return sum;
    }
    return (
        <>
            <div className="modal fade" id="fixed-expense-popup-model" tabIndex="-1" aria-labelledby="fixed-expense-popup-model-label" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="fixed-expense-popup-model-label">Each Kandoora Fixed Expense Breakups</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                        <div className="table-responsive">
                            <table className="table table-striped table-bordered fixTableHead" style={{fontSize:'var(--app-font-size)'}}>
                                <thead>
                                    <tr>
                                        <th>Expense Type</th>
                                        <th>Expense Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <>
                                        {
                                            kandooraHeadList?.map((ele, index) => {
                                                return <tr key={index}>
                                                    <td>{ele.headName}</td>
                                                    <td style={{ textAlign: "right" }}>{kandooraExpenseList[ele.id] === undefined ? "0.00" : kandooraExpenseList[ele.id].toFixed(2)}</td>
                                                </tr>
                                            })
                                        }
                                        <tr>
                                            <td>Total</td>
                                            <td style={{ textAlign: "right", fontWeight: 'bold' }}>{expenseSum().toFixed(2)}</td>
                                        </tr>
                                    </>
                                </tbody>
                            </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type="cancel" className="btn-sm"/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
