import React, { useState, useEffect } from 'react'
import ButtonBox from '../common/ButtonBox'
import Inputbox from '../common/Inputbox'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common';
import Cookies from 'universal-cookie';
import { validationMessage } from '../../constants/validationMessage';
export default function LoginMasterAccess({ setAccessLogin, accessLogin }) {

    const loginModelTemplete = {
        userName: '',
        password: '',
        message: ""
    }
    const [loginModel, setLoginModel] = useState(loginModelTemplete);
    const [errors, setErrors] = useState({});
    const login = () => {
        if (loginModel.userName === "") {
            setErrors({ errors, "userName": validationMessage.userNameRequired });
            return;
        }
        if (loginModel.password === "") {
            setErrors({ errors, "password": validationMessage.passwordRequired });
            return;
        }
        var apiList=[];
        apiList.push(Api.Post(apiUrls.masterAccessController.loginMasetrAccess, loginModel));
        apiList.push(Api.Get(apiUrls.applicationSettingController.getAll));

        Api.MultiCall(apiList)
            .then(res => {
                if (res[0]?.data?.id > 0) {
                    setAccessLogin({ ...res[0]?.data });
                    setLoginModel(loginModelTemplete);
                    common.closePopup('closeAccessLoginModel');
                    onTextChange({ target: { name: "message", value: "" } });
                    var accessJson = JSON.stringify(res[0]?.data);
                    window.localStorage.setItem(process.env.REACT_APP_ACCESS_STORAGE_KEY, accessJson);
                    const cookies = new Cookies();
                    var now = new Date();
                    var time = now.getTime();
                    time += (3600 * 1000)*48; // 2 days
                    now.setTime(time);
                    cookies.set(process.env.REACT_APP_ACCESS_STORAGE_KEY, res[0]?.data.accessToken, { path: '/',expires:now });
                    window.localStorage.setItem(process.env.REACT_APP_APP_SETTING_STORAGE_KEY,JSON.stringify(res[1].data));
                }
                else {
                    onTextChange({ target: { name: "message", value: validationMessage.wrongCredentials } })
                }
            });
    }

    const onTextChange = (e) => {
        var { name, value } = e.target;
        setLoginModel({ ...loginModel, [name]: value });
    }
    return (
        <>
            <div className="modal fade" id="accessLoginModel" tabIndex="-1" role="dialog" aria-labelledby="accessLoginModelLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="accessLoginModelLabel">Login To Access</h5>
                            <button type="button" className="btn-close" id='closeAccessLoginModel' data-bs-dismiss="modal" aria-label="Close">
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className='row'>
                                <div className='col-12'>
                                    <Inputbox type="text" errorMessage={errors?.userName} onChangeHandler={onTextChange} value={loginModel?.userName} name="userName" className="form-control-sm" labelText="Username" isRequired={true} />
                                </div>
                                <div className='col-12'>
                                    <Inputbox type="password" errorMessage={errors?.password} onChangeHandler={onTextChange} value={loginModel?.password} name="password" className="form-control-sm" labelText="Password" isRequired={true} />
                                </div>
                                {loginModel?.message !== "" && <div className='col-12 text-danger'>
                                    {loginModel?.message}
                                </div>
                                }
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type="save" text="Login" onClickHandler={login} className="btn btn-sm"></ButtonBox>
                            <ButtonBox type="cancel" modelDismiss={true} className="btn btn-sm"></ButtonBox>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
