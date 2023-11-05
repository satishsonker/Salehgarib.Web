import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { validationMessage } from '../../constants/validationMessage';
import ErrorLabel from '../common/ErrorLabel';
import Label from '../common/Label';
import { common } from '../../utils/common'
import { toast } from 'react-toastify';
import { toastMessage } from '../../constants/ConstantValues';
import ButtonBox from '../common/ButtonBox';
import PasswordValidator from './PasswordValidator';

export default function ChangePasswordPopup({ authData }) {
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [showPasswordValidation, setShowPasswordValidation] = useState(false);
    const changePasswordModelTemplate = {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    }
    const [changePasswordModel, setChangePasswordModel] = useState(changePasswordModelTemplate);
    const textChangeHandler = (e) => {
        const { name, value } = e.target;
        setChangePasswordModel({ ...changePasswordModel, [name]: value });
    }
    const [errors, setErrors] = useState({});
    const validateForm = () => {
        var error = {};
        let { currentPassword, newPassword, confirmNewPassword } = changePasswordModel;
        if (!currentPassword || currentPassword.length === 0) error.currentPassword = validationMessage.currentPasswordRequired;
        if (!newPassword || newPassword.length === 0) error.newPassword = validationMessage.newPasswordRequired;
        if (!newPassword || newPassword.length < 8) error.newPassword = validationMessage.newPasswordLengthError;
        if (!confirmNewPassword || newPassword !== confirmNewPassword) error.confirmNewPassword = validationMessage.ConfirmPasswordError;
        return error;
    }

    useEffect(() => {
        setChangePasswordModel(changePasswordModelTemplate);
    }, [])

    const passwordOnFocusHandler = () => {
       setShowPasswordValidation(true);
    }

    const passwordOnBlurHandler = () => {
        setShowPasswordValidation(false);
    }

    const changePasswordHandler = () => {

        var formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        else
            setErrors({});

        let header = {
            'x-user-id': authData.email
        }
        Api.Put(apiUrls.authController.changePassword, changePasswordModel, header)
            .then(res => {
                common.closePopup();
                toast.success(toastMessage.updateSuccess);
            })
    }

   
    return (
        <>
            <div id='change-password-popup' className="modal fade" tabIndex="-1" role="dialog" aria-labelledby='change-password-popupLabel'
                aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Change Password</h5>
                            <button type="button" className="btn-close" id='closePopup' data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-md-12">
                                                <Label text="Current Password" isRequired={true} />
                                                <input type="password" maxLength={50} className="form-control form-control-sm" name="currentPassword" value={changePasswordModel.currentPassword} onChange={e => textChangeHandler(e)} />
                                                <ErrorLabel message={errors?.currentPassword}></ErrorLabel>
                                            </div>
                                            <div className="col-md-12">
                                                <Label text="New Password" isRequired={true}></Label>
                                                <input autoComplete="new-password" onBlur={e => passwordOnBlurHandler()} onFocus={e => passwordOnFocusHandler()} pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" type="password" maxLength={50} className="form-control form-control-sm" name="newPassword" value={changePasswordModel.newPassword} onChange={e => textChangeHandler(e)} />
                                                <ErrorLabel message={errors?.newPassword}></ErrorLabel>
                                            </div>
                                            <div className="col-md-12">
                                                <Label text="Confirm New Password" isRequired={true}></Label>
                                                <input type="password" maxLength={50} className="form-control form-control-sm" name="confirmNewPassword" value={changePasswordModel.confirmNewPassword} onChange={e => textChangeHandler(e)} />
                                                <ErrorLabel message={errors?.confirmNewPassword}></ErrorLabel>
                                            </div>
                                           <PasswordValidator password={changePasswordModel.newPassword} setIsValidPassword={setIsPasswordValid} showValidation={showPasswordValidation}></PasswordValidator>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type="update" onClickHandler={changePasswordHandler} disabled={!isPasswordValid} id="btnSubmit" text="Change Password" className="btn-sm" />
                            <ButtonBox type="cancel" modelDismiss={true} className="btn-sm" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
