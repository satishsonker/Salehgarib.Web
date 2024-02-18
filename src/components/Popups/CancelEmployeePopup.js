import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { common } from '../../utils/common';
import Inputbox from '../common/Inputbox';
import ButtonBox from '../common/ButtonBox';
import { validationMessage } from '../../constants/validationMessage';
import Label from '../common/Label';

export default function CancelEmployeePopup({ empData,callBack }) {
    const [errors, setErrors] = useState({});
    const [model, setModel] = useState({
        cancelDate: common.getHtmlDate(new Date())
    })

    const handleTextChange = (e) => {
        var { name, value } = e.target;
        setModel({...model,[name]:value});
    }

    const validateError = () => {
        const { cancelDate} = model;
        const newError = {};
        if (!cancelDate || cancelDate === '') newError.cancelDate = validationMessage.cancelDateRequired;

        return newError;
    }

    const cancelHandler = () => {
        if (empData?.id < 1) {
            toast.warn("Employee isn't selected yet!");
            return;
        }

        const formError = validateError();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return
        }

        Api.Post(`${apiUrls.employeeController.markEmployeeStatusCancel}${empData?.id}?cancelDate=${model.cancelDate}`,{})
            .then(res => {
                if (res.data === true) {
                    toast.success(toastMessage.updateSuccess);
                    common.closePopup('closemarkEmpCancelModel');
                    callBack(pre=>pre+1);
                }
            });
    }
    return (
        <>
            <div className="modal fade" id="markEmpCancelModel" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Mark Employee Cancel</h5>
                            <button type="button" className="btn-close" id='closemarkEmpCancelModel' data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='row'>
                                <div className='col-12'>
                                    <div className='d-flex justify-content-between'>
                                        <Label text={`Name : ${empData.firstName} ${empData.lastName}`}/>
                                        <Label text={`Job Title : ${empData.jobTitle}`}/>
                                        <Label text={`Status : ${empData.empStatusName}`}/>
                                    </div>
                                </div>
                                <div className='col-12 my-3'>
                                    <Inputbox name="cancelDate" errorMessage={errors?.cancelDate} value={model.cancelDate} labelText="Cancel Date" onChangeHandler={handleTextChange} isRequired={true} type="date" />
                                </div>
                                <div className='col-12'>
                                    <div className='text-danger text-small text-center'>
                                        Once you cancel the Employee. you cant rollback this action.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <ButtonBox type="update" onClickHandler={cancelHandler} className="btn btn-sm"></ButtonBox>
                            <ButtonBox type="cancel" modelDismiss={true} className="btn btn-sm"></ButtonBox>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
