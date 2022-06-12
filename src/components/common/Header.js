import React from 'react'

export default function Header() {
    return (
        <>
            <header className="top-header">
                <nav className="navbar navbar-expand">
                    <div className="mobile-toggle-icon d-xl-none">
                        <i className="bi bi-list"></i>
                    </div>
                    <div className="top-navbar d-none d-xl-block">
                        <ul className="navbar-nav align-items-center">
                            <li className="nav-item">
                                <a className="nav-link" href="index.html"> Important News </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="app-emailbox.html">Notice</a>
                            </li>

                        </ul>
                    </div>
                    <div className="search-toggle-icon d-xl-none ms-auto">
                        <i className="bi bi-search"></i>
                    </div>
                    <form className="searchbar d-none d-xl-flex ms-auto">
                        <div className="position-absolute top-50 translate-middle-y search-icon ms-3"><i className="bi bi-search"></i></div>
                        <input className="form-control" type="text" placeholder="Type here to search" />
                        <div className="position-absolute top-50 translate-middle-y d-block d-xl-none search-close-icon"><i className="bi bi-x-lg"></i></div>
                    </form>
                    <div className="top-navbar-right ms-3">
                        <ul className="navbar-nav align-items-center">
                            <li className="nav-item dropdown dropdown-large">
                                <a className="nav-link dropdown-toggle dropdown-toggle-nocaret" href="#" data-bs-toggle="dropdown">
                                    <div className="user-setting d-flex align-items-center gap-1">
                                        <img src="assets/images/user.jpg" className="user-img" alt="" />
                                        <div className="user-name d-none d-sm-block">Arun</div>
                                    </div>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <a className="dropdown-item" href="#">
                                            <div className="d-flex align-items-center">
                                                <img src="assets/images/user.jpg" alt="" className="rounded-circle" width="60" height="60" />
                                                <div className="ms-3">
                                                    <h6 className="mb-0 dropdown-user-name">Arun</h6>

                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <a className="dropdown-item" href="pages-user-profile.html">
                                            <div className="d-flex align-items-center">
                                                <div className="setting-icon"><i className="bi bi-person-fill"></i></div>
                                                <div className="setting-text ms-3"><span>Profile</span></div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="#">
                                            <div className="d-flex align-items-center">
                                                <div className="setting-icon"><i className="bi bi-cloud-arrow-down-fill"></i></div>
                                                <div className="setting-text ms-3"><span>Change Password</span></div>
                                            </div>
                                        </a>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <a className="dropdown-item" href="authentication-signup-with-header-footer.html">
                                            <div className="d-flex align-items-center">
                                                <div className="setting-icon"><i className="bi bi-lock-fill"></i></div>
                                                <div className="setting-text ms-3"><span>Logout</span></div>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        </>
    )
}
