import React, { useEffect } from 'react'
import ChangePasswordPopup from '../login/ChangePasswordPopup';

export default function Header({ authData, setAuthData, isSidebarCollapsed,setIsSidebarCollapsed }) {
    const tokenStorageKey = process.env.REACT_APP_TOKEN_STORAGE_KEY;
    const logoutHandler = (e) => {
        e.preventDefault();
        setAuthData({
            isAuthenticated: false
        });
        localStorage.removeItem(tokenStorageKey);
    }

    useEffect(() => {

    }, [authData])

    const toggleHandler = () => {
        var wrapper = document.getElementsByClassName('sidebar-wrapper');
        if (wrapper.length > 0) {
            wrapper[0].className = wrapper[0].className.indexOf('sidebar-wrapper-slide') === -1 ? 'sidebar-wrapper sidebar-wrapper-slide' : 'sidebar-wrapper';
            //setIsSidebarCollapsed(false);
        }
    }

    return (
        <>
            <header className="top-header">
                <nav className={!isSidebarCollapsed ? "navbar navbar-expand" : "navbar navbar-collaps"}>
                    <div className="mobile-toggle-icon d-xl-none" onClick={e => toggleHandler()}>
                        <i className="bi bi-list"></i>
                    </div>
                    <div className="top-navbar d-none d-xl-block">
                        <ul className="navbar-nav align-items-center">
                            <li className="nav-item sidebar-header">

                                <div>
                                    {isSidebarCollapsed && <h4 className="logo-text">Saleh Garib Tailoring Shop</h4>}
                                </div>
                            </li>
                        </ul>
                    </div>
                    {/* <div className="search-toggle-icon d-xl-none ms-auto">
                        <i className="bi bi-search"></i>
                    </div> */}
                    <form className="searchbar d-none d-xl-flex ms-auto">
                        {/* <div className="position-absolute top-50 translate-middle-y search-icon ms-3"><i
                            className="bi bi-search"></i></div> */}
                        {/* <input className="form-control" type="text" placeholder="Type here to search" /> */}
                        {/* <div
                            className="position-absolute top-50 translate-middle-y d-block d-xl-none search-close-icon">
                            <i className="bi bi-x-lg"></i></div> */}
                    </form>
                    <div className="top-navbar-right ms-3">
                        <ul className="navbar-nav align-items-center">
                            <li className="nav-item dropdown dropdown-large">
                                <a className="nav-link dropdown-toggle dropdown-toggle-nocaret" href="#"
                                    data-bs-toggle="dropdown">
                                    <div className="user-setting d-flex align-items-center gap-1">
                                        <img src="assets/images/user.jpg" className="user-img" alt="" />
                                        <div className="user-name d-none d-sm-block" style={{fontSize:'var(--app-font-size)'}}>{authData?.name}</div>
                                    </div>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <a className="dropdown-item" href="#">
                                            <div className="d-flex align-items-center">
                                                <img src="assets/images/user.jpg" alt="" className="rounded-circle"
                                                    width="40" height="40" />
                                                <div className="ms-3">
                                                    <h6 className="mb-0 dropdown-user-name" style={{fontSize:'var(--app-font-size)'}}>{authData?.name}</h6>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="pages-user-profile.html">
                                            <div className="d-flex align-items-center">
                                                <div className="setting-icon"><i className="bi bi-person-fill"></i>
                                                </div>
                                                <div className="setting-text ms-3" style={{fontSize:'var(--app-font-size)'}}><span>Profile</span></div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="#">
                                            <div className="d-flex align-items-center">
                                                <div className="setting-icon"><i
                                                    className="bi bi-cloud-arrow-down-fill"></i></div>
                                                <div className="setting-text ms-3" 
                                                style={{fontSize:'var(--app-font-size)'}} 
                                                data-bs-toggle="modal"  
                                                data-bs-target="#change-password-popup"
                                                data-bs-placement="bottom"><span>Change Password</span></div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="#" onClick={e => logoutHandler(e)}>
                                            <div className="d-flex align-items-center">
                                                <div className="setting-icon"><i className="bi bi-lock-fill"></i></div>
                                                <div className="setting-text ms-3" style={{fontSize:'var(--app-font-size)'}}><span>Logout</span></div>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
            <ChangePasswordPopup authData={authData}></ChangePasswordPopup>
        </>
    )
}
