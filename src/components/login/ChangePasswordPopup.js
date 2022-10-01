import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { validationMessage } from '../../constants/validationMessage';
import ErrorLabel from '../common/ErrorLabel';
import Label from '../common/Label';
import {common} from '../../utils/common'
import { toast } from 'react-toastify';
import { toastMessage } from '../../constants/ConstantValues';

export default function ChangePasswordPopup({ authData }) {
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
        document.getElementById("message").style.display = "block";
    }

    const passwordOnBlurHandler = () => {
        document.getElementById("message").style.display = "none";
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
            }).catch(err => {
            });
    }

    const changePasswordKeyUpHandler = (e) => {
        var passStr = e.target.value;
        var letter = document.getElementById("letter");
        var capital = document.getElementById("capital");
        var number = document.getElementById("number");
        var length = document.getElementById("length");
        var btnSubmit=document.getElementById("btnSubmit");

        // When the user starts to type something inside the password field
    
            // Validate lowercase letters
            var lowerCaseLetters = /[a-z]/g;
            if (passStr.match(lowerCaseLetters)) {
                letter.classList.remove("invalid");
                letter.classList.add("valid");
                btnSubmit.removeAttribute('disabled');
            } 
            else {
                letter.classList.remove("valid");
                letter.classList.add("invalid");
                btnSubmit.setAttribute('disabled','disabled');
            }

            // Validate capital letters
            var upperCaseLetters = /[A-Z]/g;
            if (passStr.match(upperCaseLetters)) {
                capital.classList.remove("invalid");
                capital.classList.add("valid");
                btnSubmit.removeAttribute('disabled');
            } else {
                capital.classList.remove("valid");
                capital.classList.add("invalid");
                btnSubmit.setAttribute('disabled','disabled');
            }

            // Validate numbers
            var numbers = /[0-9]/g;
            if (passStr.match(numbers)) {
                number.classList.remove("invalid");
                number.classList.add("valid");
                btnSubmit.removeAttribute('disabled');
            } 
            else {
                number.classList.remove("valid");
                number.classList.add("invalid");
                btnSubmit.setAttribute('disabled','disabled');
            }

            // Validate length
            if (passStr.length >= 8) {
                length.classList.remove("invalid");
                length.classList.add("valid");
                btnSubmit.removeAttribute('disabled');
            } 
            else {
                length.classList.remove("valid");
                length.classList.add("invalid");
                btnSubmit.setAttribute('disabled','disabled');
            }
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
                                                    <input type="password" maxLength={50} className="form-control" name="currentPassword" value={changePasswordModel.currentPassword} onChange={e => textChangeHandler(e)} />
                                                    <ErrorLabel message={errors?.currentPassword}></ErrorLabel>
                                                </div>
                                                <div className="col-md-12">
                                                    <Label text="New Password" isRequired={true}></Label>
                                                    <input autoComplete="new-password" onKeyUp={e=>changePasswordKeyUpHandler(e)} onBlur={e => passwordOnBlurHandler()} onFocus={e => passwordOnFocusHandler()} pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" type="password" maxLength={50} className="form-control" name="newPassword" value={changePasswordModel.newPassword} onChange={e => textChangeHandler(e)} />
                                                    <ErrorLabel message={errors?.newPassword}></ErrorLabel>
                                                </div>
                                                <div className="col-md-12">
                                                    <Label text="Confirm New Password" isRequired={true}></Label>
                                                    <input type="password" maxLength={50} className="form-control" name="confirmNewPassword" value={changePasswordModel.confirmNewPassword} onChange={e => textChangeHandler(e)} />
                                                    <ErrorLabel message={errors?.confirmNewPassword}></ErrorLabel>
                                                </div>
                                                <div id="message" className='pass-message'>
                                                    <h6>Password must contain the following:</h6>
                                                    <p id="letter" className="invalid">A <b>lowercase</b> letter</p>
                                                    <p id="capital" className="invalid">A <b>capital (uppercase)</b> letter</p>
                                                    <p id="number" className="invalid">A <b>number</b></p>
                                                    <p id="length" className="invalid">Minimum <b>8 characters</b></p>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" id='btnSubmit' onClick={e => changePasswordHandler()} className="btn btn-danger text-white waves-effect" >Change Password</button>
                                <button type="button" className="btn btn-warning waves-effect" data-bs-dismiss="modal">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
