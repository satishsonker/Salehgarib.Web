import React from 'react'
import {Link} from "react-router-dom";

export default function LeftMenu() {
    return (
        <>
            <aside className="sidebar-wrapper" data-simplebar="init">
                <div className="simplebar-wrapper" style={{margin: '0px'}}>
                    <div className="simplebar-height-auto-observer-wrapper">
                        <div className="simplebar-height-auto-observer"></div>
                    </div>
                    <div className="simplebar-mask">
                        <div className="simplebar-offset" style={{right: '0px', bottom: '0px'}}>
                            <div className="simplebar-content-wrapper" style={{height: '100%', overflow: 'hidden'}}>
                                <div className="simplebar-content" style={{padding: '0px'}}>
                                    <div className="sidebar-header">
                                        <div>
                                            <img src="assets/images/logo.png" className="logo-icon" alt="logo icon"/>
                                        </div>
                                        <div>
                                            <h4 className="logo-text">Saleh Garib Tailoring Shop</h4>
                                        </div>
                                        <div className="toggle-icon ms-auto">
                                            <i className="bi bi-chevron-double-left"></i>
                                        </div>
                                    </div>
                                    <ul className="metismenu" id="menu">
                                        <li>
                                        <Link to="/dashboard">
                                                <div className="parent-icon"><i className="bi bi-house-door"></i>
                                                </div>
                                                <div className="menu-title">Dashboard</div>
                                                </Link> 
                                        </li>
                                        <li>
                                        <Link to="/employee-details">
                                                <div className="parent-icon"><i className="bi bi-house-door"></i>
                                                </div>
                                                <div className="menu-title">Employee</div>
                                                </Link> 
                                        </li>
                                        <li>
                                            <a href="#" className="has-arrow">
                                                <div className="parent-icon"><i className="bi bi-grid"></i>
                                                </div>
                                                <div className="menu-title">Assest Management</div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="has-arrow">
                                                <div className="parent-icon"><i className="bi bi-award"></i>
                                                </div>
                                                <div className="menu-title">Widgets</div>
                                            </a>
                                            <ul className="mm-collapse">
                                                <li>
                                                    <a href="widgets-static-widgets.html">
                                                        <i className="bi bi-arrow-right-short"></i>Static Widgets
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="widgets-data-widgets.html">
                                                        <i className="bi bi-arrow-right-short"></i>Data Widgets
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="menu-label">Inventory</li>
                                        <li>
                                            <a href="#" className="has-arrow">
                                                <div className="parent-icon">
                                                    <i className="bi bi-people"></i>
                                                </div>
                                                <div className="menu-title">User Setting</div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="has-arrow">
                                                <div className="parent-icon">
                                                    <i className="bi bi-receipt"></i>
                                                </div>
                                                <div className="menu-title">Reports</div>
                                            </a>
                                        </li>
                                        <li>
                                            <a className="has-arrow" href="#">
                                                <div className="parent-icon">
                                                    <i className="bi bi-server"></i>
                                                </div>
                                                <div className="menu-title">Privilege</div>
                                            </a>
                                        </li>
                                        <li>
                                            <a className="has-arrow" href="#">
                                                <div className="parent-icon">
                                                    <i className="bi bi-lock"></i>
                                                </div>
                                                <div className="menu-title">Logout</div>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="simplebar-placeholder" style={{width: 'auto', height: '427px'}}></div>
                </div>
                <div className="simplebar-track simplebar-horizontal" style={{visibility: 'hidden'}}>
                    <div className="simplebar-scrollbar"
                         style={{width: '0px', display: 'none', transform: 'translate3d(0px, 0px, 0px)'}}></div>
                </div>
                <div className="simplebar-track simplebar-vertical" style={{visibility: 'hidden'}}>
                    <div className="simplebar-scrollbar" style={{height: '0px', display: 'none'}}></div>
                </div>
            </aside>
        </>
    )
}
