import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import Breadcrumb from '../common/Breadcrumb';
import Label from '../common/Label';
export default function KandooraExpense() {
    const [kandooraHeadList, setKandooraHeadList] = useState([]);
    const [kandooraExpenseModel, setKandooraExpenseModel] = useState({});
    useEffect(() => {
        Api.Get(apiUrls.masterController.kandooraHead.getAll + `?pageNo=1&pageSize=10000`)
            .then(res => {
                setKandooraHeadList(res.data.data);
            })
    }, []);

    const onTextChnageHandler = (e) => {
        let { name, value } = e.target;
        value = parseFloat(value);
        setKandooraExpenseModel({ ...kandooraExpenseModel, [name]: value });
    }
    const breadcrumbOption = {
        title: 'Kandoora Expense',
        items: [
            {
                title: "Kandoora Expense",
                icon: "bi bi-gem",
                isActive: false,
            }
        ]
    }
    const handleSave = () => {
        if (Object.keys(kandooraExpenseModel).length === 0) {
            toast.warn("You have not entered/updated any value yet");
            return;
        }
        let modelData = [];
        Object.keys(kandooraExpenseModel).forEach(ele => {
            modelData.push({
                "id": 0,
                "kandooraHeadId": parseInt(ele),
                "amount": kandooraExpenseModel[ele]
            });
        });
        Api.Put(apiUrls.masterController.kandooraExpense.add, modelData).then(res => {
            toast.success(toastMessage.saveSuccess);
        })
    }
    useEffect(() => {
        Api.Get(apiUrls.masterController.kandooraExpense.getAll + `?pageNo=1&pageSize=10000`)
            .then(res => {
                if (res.data.data.length > 0) {
                    let modelData = {};
                    res.data.data.forEach(ele => {
                        modelData[ele.kandooraHeadId] = ele.amount;
                    });
                    setKandooraExpenseModel(modelData);
                }
            })
    }, [])

    return (
        <>
            <Breadcrumb option={breadcrumbOption} />
            <h6 className="mb-0 text-uppercase">Kandoora Expense Deatils</h6>
            <hr />
            <div className="form-horizontal form-material">
                <div className="card">
                    <div className="card-body">
                        <form className="row g-3">
                            {
                                kandooraHeadList?.map(ele => {
                                    return <div className="col-md-4" key={ele.id}>
                                        <Label text={ele.headName} isRequired={true}></Label>
                                        <input name={ele.id} onChange={e => onTextChnageHandler(e)} type="number" id='' value={kandooraExpenseModel[ele.id]} min={0} className="form-control" />
                                    </div>
                                })
                            }

                        </form>
                        <div className="modal-footer">
                            <button type="submit" onClick={e => handleSave(e)} className="btn btn-info text-white waves-effect" >Save</button>
                            <button type="button" className="btn btn-danger waves-effect" id='closePopup' data-bs-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
