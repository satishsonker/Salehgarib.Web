import React, { useEffect, useState } from 'react'
import { common } from '../../utils/common';

export default function PasswordValidator({ password, setIsValidPassword, showValidation = false }) {
    password = common.defaultIfEmpty(password, "");
    setIsValidPassword = common.defaultIfEmpty(setIsValidPassword, () => { });

    const validatorModelTemplate = {
        hasLetter: false,
        hasNumber: false,
        hasCapital: false,
        hasSpecial: false,
        length: 0
    }

    const [validatorModel, setValidatorModel] = useState(validatorModelTemplate);

    useEffect(() => {
        var lowerCaseLetters = /[a-z]/g;
        var upperCaseLetters = /[A-Z]/g;
        var numbers = /[0-9]/g;
        var specials = /[!@#$%^&*()?.]/g;
        var flag = true;
        var model=validatorModel;
        if (password.match(lowerCaseLetters)) {
            model.hasLetter=true;
        }
        else {
            model.hasLetter=false;
            flag = false;
        }

        if (password.match(upperCaseLetters)) {
            model.hasCapital=true;
        }
        else {
            model.hasCapital=false;
            flag = false;
        }

        if (password.match(numbers)) {
            model.hasNumber=true;
        }
        else {
            model.hasNumber=false;
            flag = false;
        }
        if (password.match(specials)) {
            model.hasSpecial=true;
        }
        else {
            model.hasSpecial=false;
            flag = false;
        }

        if (password?.length < 8)
            flag = false;

        model.length=password?.length;
        setValidatorModel({...model});
        setIsValidPassword(flag);
    }, [password]);

    return (
        <>
            {showValidation && <div id="message" style={{display:'block'}} className='pass-message'>
                <h6>Password must contain the following:</h6>
                <p className={validatorModel.hasLetter ? "valid" : "invalid"}>A <b>lowercase</b> letter</p>
                <p className={validatorModel.hasCapital ? "valid" : "invalid"}>A <b>capital (uppercase)</b> letter</p>
                <p className={validatorModel.hasNumber ? "valid" : "invalid"}>A <b>number</b></p>
                <p className={validatorModel.hasSpecial ? "valid" : "invalid"}>A <b>Special character</b></p>
                <p className={validatorModel.length >= 8 ? "valid" : "invalid"}>Minimum <b>8 characters</b></p>
            </div>
            }
        </>
    )
}
