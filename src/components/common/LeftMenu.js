import React,{useEffect} from 'react'
import { Link } from "react-router-dom";
import useScript from '../../hooks/UseScript';
export default function LeftMenu({setAuthData,authData}) {
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
    return (
        <>
            <aside className="sidebar-wrapper" data-simplebar="init">
                <div className="simplebar-wrapper" style={{ margin: '0px' }}>
                    <div className="simplebar-height-auto-observer-wrapper">
                        <div className="simplebar-height-auto-observer"></div>
                    </div>
                    <div className="simplebar-mask">
                        <div className="simplebar-offset" style={{ right: '0px', bottom: '0px' }}>
                            <div className="simplebar-content-wrapper" style={{ height: '100%', overflow: 'hidden' }}>
                                <div className="simplebar-content" style={{ padding: '0px' }}>
                                    <div className="sidebar-header">
                                        <div>
                                            <img src="assets/images/logo.png" className="logo-icon" alt="logo icon" />
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
                                                <div className="parent-icon">
                                                <i className="bi bi-speedometer2"></i>
                                                </div>
                                                <div className="menu-title">Dashboard</div>
                                            </Link>
                                        </li>
                                        <li>
                                            <a href="#" className="has-arrow" aria-expanded="true">
                                                <div className="parent-icon"><i className="bi bi-house-door"></i>
                                                </div>
                                                <div className="menu-title">Employee</div>
                                            </a>
                                            <ul className='mm-collapse'>
                                                <li>
                                                    <Link to="/employee-details">
                                                        <div className="parent-icon"><i className="bi bi-person-badge-fill"></i>
                                                        </div>
                                                        <div className="menu-title">Employee Details</div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/daily-attendence">
                                                        <div className="parent-icon"><i className="bi bi-calendar-date"></i>
                                                        </div>
                                                        <div className="menu-title">Daily Attendence</div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/employee-attendence">
                                                        <div className="parent-icon"><i className="bi bi-calendar-week"></i>
                                                        </div>
                                                        <div className="menu-title">Monthly Attendence</div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            <a href="#" className="has-arrow" aria-expanded="true">
                                                <div className="parent-icon"><i className="bi bi-person-bounding-box"></i>
                                                </div>
                                                <div className="menu-title">Customer</div>
                                            </a>
                                            <ul className='mm-collapse'>
                                                <li>
                                                    <Link to="/customer-details">
                                                        <div className="parent-icon"><i className="bi bi-person-bounding-box"></i>
                                                        </div>
                                                        <div className="menu-title">Customers</div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/customer-orders">
                                                        <div className="parent-icon"><i className="bi bi-cart3"></i>
                                                        </div>
                                                        <div className="menu-title">Customer Orders</div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/customer-order-cancel">
                                                        <div className="parent-icon"><i className="bi bi-x-octagon-fill"></i>
                                                        </div>
                                                        <div className="menu-title">Cancelled Orders</div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/customer-order-delete">
                                                        <div className="parent-icon"><i className="bi bi-trash"></i>
                                                        </div>
                                                        <div className="menu-title">Deleted Orders</div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/customer-order-search">
                                                        <div className="parent-icon"><i className="bi bi-binoculars"></i>
                                                        </div>
                                                        <div className="menu-title">Search Orders</div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/customer-order-by-delivery">
                                                        <div className="parent-icon"><i className="bi bi-calendar-week"></i>
                                                        </div>
                                                        <div className="menu-title">Order By Delivery Date</div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/customer-order-cutting">
                                                        <div className="parent-icon"><i className="bi bi-scissors"></i>
                                                        </div>
                                                        <div className="menu-title">Cutting Orders</div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            <a href="#" className="has-arrow" aria-expanded="true">
                                                <div className="parent-icon"><i className="bi bi-stack"></i>
                                                </div>
                                                <div className="menu-title">Stock</div>
                                            </a>
                                            <ul className='mm-collapse'>
                                                <li>
                                                    <Link to="/products">
                                                        <div className="parent-icon">
                                                        <i className="bi bi-layers"></i>
                                                        </div>
                                                        <div className="menu-title">Products</div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/suppliers">
                                                        <div className="parent-icon">
                                                            <i className="bi bi-building"></i>
                                                        </div>
                                                        <div className="menu-title">Suppliers</div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/purchase-entry">
                                                        <div className="parent-icon">
                                                            <i className="bi bi-bag"></i>
                                                        </div>
                                                        <div className="menu-title">Purchase Entry</div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            <a href="#" className="has-arrow" aria-expanded="true">
                                                <div className="parent-icon"><i className="bi bi-bar-chart-steps"></i>
                                                </div>
                                                <div className="menu-title">Workers</div>
                                            </a>
                                            <ul className='mm-collapse'>
                                                <li>
                                                    <Link to="/worker-sheet">
                                                        <div className="parent-icon">
                                                        <i className="bi bi-file-spreadsheet"></i>
                                                        </div>
                                                        <div className="menu-title">Worker Sheet</div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            <a href="#" className="has-arrow" aria-expanded="true">
                                                <div className="parent-icon">
                                                <i className="bi bi-life-preserver"></i>
                                                </div>
                                                <div className="menu-title">Master Data</div>
                                            </a>
                                            <ul className='mm-collapse'>
                                                <li>
                                                    <Link to="/design-category">
                                                        <div className="parent-icon">
                                                        <i className="bi bi-bezier"></i>
                                                        </div>
                                                        <div className="menu-title">Design Category</div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/design-samples">
                                                        <div className="parent-icon">
                                                        <i className="bi bi-menu-button"></i>
                                                        </div>
                                                        <div className="menu-title">Design Samples</div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/job-title">
                                                        <div className="parent-icon">
                                                        <i className="bi bi-menu-button"></i>
                                                        </div>
                                                        <div className="menu-title">Job Title</div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/master-data">
                                                        <div className="parent-icon">
                                                        <i className="bi bi-menu-button"></i>
                                                        </div>
                                                        <div className="menu-title">Master Data</div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/master-data-type">
                                                        <div className="parent-icon">
                                                        <i className="bi bi-menu-button"></i>
                                                        </div>
                                                        <div className="menu-title">Master Data Type</div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            <a href="#" className="has-arrow" aria-expanded="true">
                                                <div className="parent-icon"><i className="bi bi-grid"></i>
                                                </div>
                                                <div className="menu-title">Assest Management</div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="has-arrow" aria-expanded="true">
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
                                            <a href="#" className="has-arrow" aria-expanded="true">
                                                <div className="parent-icon">
                                                    <i className="bi bi-people"></i>
                                                </div>
                                                <div className="menu-title">User Setting</div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="has-arrow" aria-expanded="true">
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
                                            <a href="#" onChange={e=>logoutHandler(e)}>
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
                    <div className="simplebar-placeholder" style={{ width: 'auto', height: '427px' }}></div>
                </div>
                <div className="simplebar-track simplebar-horizontal" style={{ visibility: 'hidden' }}>
                    <div className="simplebar-scrollbar"
                        style={{ width: '0px', display: 'none', transform: 'translate3d(0px, 0px, 0px)' }}></div>
                </div>
                <div className="simplebar-track simplebar-vertical" style={{ visibility: 'hidden' }}>
                    <div className="simplebar-scrollbar" style={{ height: '0px', display: 'none' }}></div>
                </div>
            </aside>
        </>
    )
}
