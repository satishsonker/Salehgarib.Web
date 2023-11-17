import React, { useState, useEffect } from 'react'
import { common } from '../../utils/common';
import Inputbox from '../common/Inputbox';
import SearchableDropdown from '../common/SearchableDropdown/SearchableDropdown';
import Label from '../common/Label';
import ButtonBox from '../common/ButtonBox';
import { validationMessage } from '../../constants/validationMessage';
import { Api } from '../../apis/Api';
import { toastMessage } from '../../constants/ConstantValues';
import { apiUrls } from '../../apis/ApiUrls';
import { toast } from 'react-toastify';
import ErrorLabel from '../common/ErrorLabel';

export default function AddCrystalAlterRecord({data, empData,orderDetailId, onUpdateCallback }) {
    const modelTemplete = {
        completedOn: data?.completedOn,
        completedBy: data?.completedBy,
        extra: data?.extra,
        orderDetailId: orderDetailId,
        note:data?.note,
        additionalNote:data?.additionalNote
    }
    onUpdateCallback = common.defaultIfEmpty(onUpdateCallback, () => { });
    const [empList, setEmpList] = useState([...empData]);
    const [errors, setErrors] = useState({});
    const [model, setModel] = useState(modelTemplete);
    // useEffect(() => {
    //     setEmpList([...empData]);
    // }, [empData])

    const handleTextChange = (e) => {
        var { value, type, name } = e.target;
        if (type === 'select-one') {
            value = parseInt(value);
        }
        if (type==="number") {
            value = parseFloat(value);
        }
        setModel({ ...model, [name]: value });
    }
    const validateError = () => {
        const { completedBy, completedOn, extra } = model;
        const newError = {};
        if (!completedBy || completedBy === 0) newError.completedBy = validationMessage.employeeRequired;
        if (!completedOn || completedOn === '') newError.completedOn = validationMessage.completedOnDateRequired;
        if (!extra || extra === 0) newError.extra = validationMessage.extraAmountRequired;
        return newError;
    }
    const updateHandler = () => {
        const formError = validateError();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return
        }
        Api.Post(apiUrls.workTypeStatusController.addUpdateCrystalAlterRecord, model)
            .then(res => {
                if (res.data === true) {
                    toast.success(toastMessage.updateSuccess);
                    common.closePopup('closeAddCrystalAlterationModel');
                    onUpdateCallback();
                }
            })
    }
    return (
        <>
            <div className="modal fade" id="addCrystalAlterationModel" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add Crystal Alteration Record</h5>
                            <button type="button" className="btn-close" id='closeAddCrystalAlterationModel' data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='row'>
                                <div className='col-12'>
                                    <Inputbox type="date" isRequired={true} onChangeHandler={handleTextChange} name="completedOn" value={model.completedOn} errorMessage={errors?.completedOn} className="form-control-sm" labelText="Completed On" />
                                </div>
                                <div className='col-12'>
                                    <Label text="Completed By" fontSize='12px' isRequired={true} />
                                    <SearchableDropdown data={empList} elementKey="id"
                                        searchable={true}
                                        text="firstName"
                                        searchPattern="_%" onChange={handleTextChange}
                                        defaultText="Select Employee" name="completedBy" value={model.completedBy} className="form-control-sm" />
                                    <ErrorLabel message={errors?.completedBy} />
                                </div>
                                <div className='col-12'>
                                    <Inputbox type="number" isRequired={true} onChangeHandler={handleTextChange} name="extra" value={model.extra} errorMessage={errors?.extra} className="form-control-sm" labelText="Extra Price" />
                                </div>
                                <div className='col-12'>
                                    <Inputbox type="text" onChangeHandler={handleTextChange} name="note" value={model.note} className="form-control-sm" labelText="Note" />
                                </div>
                                <div className='col-12'>
                                    <Inputbox type="text" onChangeHandler={handleTextChange} name="additionalNote" value={model.additionalNote} className="form-control-sm" labelText="Additional Note" />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type="update" className="btn-sm" onClickHandler={updateHandler} />
                            <ButtonBox type="cancel" text="Close" className="btn-sm" modelDismiss={true} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
