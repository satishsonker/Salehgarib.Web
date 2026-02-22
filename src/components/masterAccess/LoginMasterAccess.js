import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ButtonBox from '../common/ButtonBox'
import Inputbox from '../common/Inputbox'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { common } from '../../utils/common';
import Cookies from 'universal-cookie';
import { validationMessage } from '../../constants/validationMessage';
export default function LoginMasterAccess({ setAccessLogin, accessLogin }) {
    const navigate = useNavigate();

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
                    // Navigate to Dashboard after successful login
                    navigate('/dashboard');
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
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content shadow-lg border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                        <div className="modal-header border-0 pb-0" style={{ background: 'linear-gradient(135deg, #015f95 0%, #0178b8 100%)', padding: '1.5rem' }}>
                            <div className="w-100 text-center">
                                <div className="mb-3">
                                    <i className="bi bi-shield-lock-fill" style={{ fontSize: '3rem', color: 'white' }}></i>
                                </div>
                                <h4 className="modal-title text-white mb-2" id="accessLoginModelLabel" style={{ fontWeight: '600' }}>
                                    Master Access Authentication
                                </h4>
                                <p className="text-white-50 mb-0" style={{ fontSize: '0.9rem' }}>
                                    Secure access required for administrative functions
                                </p>
                            </div>
                            <button type="button" className="btn-close btn-close-white position-absolute top-0 end-0 m-3" id='closeAccessLoginModel' data-bs-dismiss="modal" aria-label="Close">
                            </button>
                        </div>
                        <div className="modal-body p-4">
                            
                            
                            <div className='row g-3'>
                                <div className='col-12'>
                                    <label className="form-label fw-semibold" style={{ color: '#293445', fontSize: '0.9rem' }}>
                                        <i className="bi bi-person-fill me-2 text-primary"></i>Username
                                        <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0" style={{ borderRadius: '10px 0 0 10px' }}>
                                            <i className="bx bx-user text-primary"></i>
                                        </span>
                                        <input 
                                            type="text" 
                                            name="userName"
                                            value={loginModel?.userName}
                                            onChange={onTextChange}
                                            className={`form-control ${errors?.userName ? 'is-invalid' : ''}`}
                                            placeholder="Enter your master access username"
                                            style={{ borderRadius: '0 10px 10px 0', borderLeft: 'none' }}
                                        />
                                    </div>
                                    {errors?.userName && (
                                        <div className="text-danger small mt-1">
                                            <i className="bi bi-exclamation-circle me-1"></i>{errors.userName}
                                        </div>
                                    )}
                                </div>
                                <div className='col-12'>
                                    <label className="form-label fw-semibold" style={{ color: '#293445', fontSize: '0.9rem' }}>
                                        <i className="bi bi-lock-fill me-2 text-primary"></i>Password
                                        <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0" style={{ borderRadius: '10px 0 0 10px' }}>
                                            <i className="bx bx-lock text-primary"></i>
                                        </span>
                                        <input 
                                            type="password" 
                                            name="password"
                                            value={loginModel?.password}
                                            onChange={onTextChange}
                                            className={`form-control ${errors?.password ? 'is-invalid' : ''}`}
                                            placeholder="Enter your master access password"
                                            style={{ borderRadius: '0 10px 10px 0', borderLeft: 'none' }}
                                        />
                                    </div>
                                    {errors?.password && (
                                        <div className="text-danger small mt-1">
                                            <i className="bi bi-exclamation-circle me-1"></i>{errors.password}
                                        </div>
                                    )}
                                </div>
                                {loginModel?.message !== "" && (
                                    <div className='col-12'>
                                        <div className="alert alert-danger border-0 d-flex align-items-center" style={{ borderRadius: '10px', fontSize: '0.875rem' }}>
                                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                            <span>{loginModel?.message}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="mt-4 pt-3 border-top">
                                <div className="d-flex align-items-center text-muted" style={{ fontSize: '0.8rem' }}>
                                    <i className="bi bi-shield-check me-2 text-success"></i>
                                    <span>Your session is secured with encrypted authentication</span>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-0 pt-0 pb-4 px-4">
                            <ButtonBox 
                                type="cancel" 
                                modelDismiss={true} 
                                className="btn-sm px-4" 
                                style={{ borderRadius: '10px' }}
                            />
                            <ButtonBox 
                                type="save" 
                                text="Authenticate & Continue" 
                                onClickHandler={login} 
                                className="btn-sm px-4"
                                style={{ borderRadius: '10px' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
