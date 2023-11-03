import React, { useState, useEffect } from 'react'
import ButtonBox from '../common/ButtonBox'
import Inputbox from '../common/Inputbox'
import Dropdown from '../common/Dropdown'
import Label from '../common/Label'
import ErrorLabel from '../common/ErrorLabel'
import { common } from '../../utils/common'
import { validationMessage } from '../../constants/validationMessage'
import { Api } from '../../apis/Api'
import { apiUrls } from '../../apis/ApiUrls'
import { toast } from 'react-toastify'
import { toastMessage } from '../../constants/ConstantValues'

export default function UpdateCompletedOnAndEmpInCrystalTracking({ empData, workSheetModel, usedCrystalData,onUpdateCallback }) {
    const modelTemplete = {
        completedOn: workSheetModel?.completedOn?.substr(0, 10),
        empId: workSheetModel?.completedBy,
        workStatusId: workSheetModel?.id,
        CrystalTrackingOutId: usedCrystalData[0]?.id
    }
    onUpdateCallback=common.defaultIfEmpty(onUpdateCallback,()=>{});
    const [empList, setEmpList] = useState();
    const [errors, setErrors] = useState({});
    const [model, setModel] = useState(modelTemplete);
    useEffect(() => {
        setEmpList([...empData]);
    }, [empData])

    const handleTextChange = (e) => {

        var { value, type, name } = e.target;
        if (type === 'select-one') {
            value = parseInt(value);
        }
        setModel({ ...model, [name]: value });
    }
    const validateError = () => {
        const { empId, completedOn, workStatusId, CrystalTrackingOutId } = model;
        const newError = {};
        if (!empId || empId === 0) newError.empId = validationMessage.employeeRequired;
        if (!workStatusId || workStatusId === 0) newError.workSheet = "Worksheet data not available!";
        if (!CrystalTrackingOutId || CrystalTrackingOutId === 0) newError.crystal = "Crystal data not available!";
        if (!completedOn || completedOn === '') newError.completedOn = validationMessage.completedOnDateRequired;

        return newError;
    }
    const updateHandler = () => {
        const formError = validateError();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return
        }
        Api.Post(apiUrls.crytalTrackingController.updateCompletedDateAndEmp,model)
        .then(res=>{
            if(res.data===true)
            {
                toast.success(toastMessage.updateSuccess);
                common.closePopup('closeUpdateCompletedOnAndEmpInCrystalTrackingModel');
                onUpdateCallback();
            }
        })
    }

    return (
        <div className="modal fade" id="updateCompletedOnAndEmpInCrystalTrackingModel" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Update CompletedOn & Employee</h5>
                        <button type="button" className="btn-close" id='closeUpdateCompletedOnAndEmpInCrystalTrackingModel' data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <ErrorLabel message={errors?.workSheet} />
                        <ErrorLabel message={errors?.crystal} />
                        <div className='row'>
                            <div className='col-12'>
                                <Inputbox type="date" onChangeHandler={handleTextChange} name="completedOn" value={model.completedOn} errorMessage={errors?.completedOn} className="form-control-sm" labelText="Completed On" />
                            </div>
                            <div className='col-12'>
                                <Label text="Completed By" isRequired={true} />
                                <Dropdown data={empList} elementKey="id"
                                    searchable={true}
                                    text="firstName"
                                    searchPattern="_%" onChange={handleTextChange}
                                    defaultText="Select Employee" name="empId" value={model.empId} errorMessage={errors?.empId} className="form-control-sm" />
                                <ErrorLabel message={errors?.empId} />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <ButtonBox type="update" text="Close" className="btn-sm" onClickHandler={updateHandler} />
                        <ButtonBox type="cancel" text="Close" className="btn-sm" modelDismiss={true} />
                    </div>
                </div>
            </div>
        </div>
    )
}
