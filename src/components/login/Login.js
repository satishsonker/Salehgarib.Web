import React, {useEffect, useState} from 'react'
import {toast, ToastContainer} from 'react-toastify';
import {Api} from '../../apis/Api';
import {apiUrls} from '../../apis/ApiUrls';
import 'react-toastify/dist/ReactToastify.css';
import jwt_decode from "jwt-decode";


export default function Login({setAuthData}) {
    const [userCredential, setUserCredential] = useState({userName: '', password: ''});
    const tokenStorageKey = process.env.REACT_APP_TOKEN_STORAGE_KEY;
    useEffect(() => {
       tokenDecoder();
    }, []);

    const onChangeHandler = (e) => {
        setUserCredential({...userCredential, [e.target.name]: e.target.value});
    };

    const loginHandler = () => {
        if (userCredential.userName === '') {
            toast.warn('Please enter user name.');
            return;
        }
        if (userCredential.password === '') {
            toast.warn('Please enter password.');
            return;
        }
        Api.Post(apiUrls.authController.token, userCredential)
            .then(res => {
                tokenDecoder(res.data);
                //toast.success('Got Token');
            }).catch(err => {
            //toast.error('Got Token');
        });
    };

    const tokenDecoder = (tokenObj) => {
        var token;
        var tokenData;
        if (tokenObj === undefined || tokenObj === null) {
            token = localStorage.getItem(tokenStorageKey);
            if (token !== undefined && token !== null) {
                token = JSON.parse(token);
                tokenData = jwt_decode(token.accessToken);
                setAuthData({
                    isAuthenticated: true,
                    email: tokenData.email,
                    firstName: tokenData.firstname,
                    lastName: tokenData.lastname,
                    role: tokenData.role,
                    name:tokenData.fullname,
                    userName:tokenData.userName,
                    userId:parseInt(tokenData.userId)
                });
            }
        } else {
            if (tokenObj.hasOwnProperty('accessToken')) {
                localStorage.setItem(tokenStorageKey, JSON.stringify(tokenObj));
                tokenData = jwt_decode(tokenObj.accessToken);
                setAuthData({
                    isAuthenticated: true,
                    email: tokenData.email,
                    firstName: tokenData.firstname,
                    lastName: tokenData.lastname,
                    role: tokenData.role,
                    name:tokenData.fullname,
                    userName:tokenData.userName
                });
            }
        }
    }
    return (
        <>
            <div className="wrapper">
                <main className="authentication-content">
                    <div className="container-fluid">
                        <div className="authentication-card">
                            <div className="card shadow rounded-0 overflow-hidden">
                                <div className="row g-0">
                                    <h4 className="mainheading">{process.env.REACT_APP_COMPANY_NAME}</h4>

                                    <div
                                        className="col-lg-6 d-flex align-items-center justify-content-center border-end">
                                        <img src={process.env.REACT_APP_LOGIN_LOGO} className="img-fluid" alt=""/>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="card-body p-4 p-sm-5">
                                            <h5 className="card-title text-center mb-2 font-20"><strong>Employee User
                                                Login</strong></h5>
                                            <p className="card-text mb-3 text-center pt-2"
                                               style={{lineHeight: '30px'}}>Please enter you Login &amp; Your
                                                Password</p>
                                            <form className="form-body">
                                                <div className="row g-3">
                                                    <div className="col-12">
                                                        <div className="input-group flex-nowrap"><span
                                                            className="input-group-text" id="addon-wrapping"><i
                                                            className="bx bx-user"></i></span>
                                                            <input type="text" name='userName'
                                                                   onChange={e => onChangeHandler(e)}
                                                                   className="form-control" placeholder="Username"
                                                                   aria-label="Username"
                                                                   aria-describedby="addon-wrapping"/>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="input-group flex-nowrap"><span
                                                            className="input-group-text" id="addon-wrapping"><i
                                                            className="bx bx-lock"></i></span>
                                                            <input type="password" name='password'
                                                                   onChange={e => onChangeHandler(e)}
                                                                   className="form-control" placeholder="Password"
                                                                   aria-label="Username"
                                                                   aria-describedby="addon-wrapping"/>
                                                        </div>
                                                    </div>
                                                    <div className="col-4 offset-md-8">
                                                        <div className="d-grid gap-3">
                                                            <button type="button" onClick={e => loginHandler()}
                                                                    className="btn  btn-lg btn-primary radius-30">login<i
                                                                className="bx bx-right-arrow-alt"></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <ToastContainer></ToastContainer> {/*  dont remove this. its for toast message  */}
        </>
    )
}
