import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import Breadcrumb from '../common/Breadcrumb';
import Label from '../common/Label';
import Inputbox from '../common/Inputbox';
import ButtonBox from '../common/ButtonBox';
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
            <hr />
            <div className="form-horizontal form-material">
                <div className="card">
                    <div className="card-body">
                        <div className="row g-3">
                            {
                                kandooraHeadList?.map(ele => {
                                    return <div className="col-md-2" key={ele.id}>
                                        <Inputbox labelText={ele.headName} labelFontSize="10px" isRequired={true} className="form-control-sm" name={ele.id} onChangeHandler={onTextChnageHandler} type="number" id='' value={kandooraExpenseModel[ele.id]} min={0} />
                                    </div>
                                })
                            }
                        </div>
                    </div>
                    <div className="card-footer text-end">
                        <ButtonBox type="update" onClickHandler={handleSave} className="btn-sm" />
                    </div>
                </div>
            </div>
        </>
    )
}
