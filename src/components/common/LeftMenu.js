import React, { useEffect } from 'react'
import { Link } from "react-router-dom";
import usePermission from '../../hooks/usePermission';
import Login from '../login/Login';
import LeftMenuItem from './LeftMenuItem';
export default function LeftMenu({ setAuthData, authData, isSidebarCollapsed, setIsSidebarCollapsed }) {
    const tokenStorageKey = process.env.REACT_APP_TOKEN_STORAGE_KEY;
    const [hasUserPermission] = usePermission();
    const logoutHandler = (e) => {
        e.preventDefault();
        localStorage.removeItem(tokenStorageKey);
        setAuthData({
            isAuthenticated: false
        });
        return <Login setAuthData={setAuthData}></Login>
    }
    useEffect(() => {

    }, [authData])
    return (
        <>
            <section>
                <aside className={isSidebarCollapsed ? "sidebar-wrapper sidebar-collaps" : "sidebar-wrapper sidebar"} data-simplebar="init">
                    <div className="simplebar-wrapper" style={{ margin: '0px' }}>
                        <div className="simplebar-height-auto-observer-wrapper">
                            <div className="simplebar-height-auto-observer"></div>
                        </div>
                        <div className="simplebar-mask">
                            <div className="simplebar-offset" style={{ right: '0px', bottom: '0px' }}>
                                <div className="simplebar-content-wrapper" style={{ height: '100%', overflow: 'hidden' }}>
                                    <div className="simplebar-content" style={{ padding: '0px' }}>
                                        <div className={isSidebarCollapsed ? "sidebar-header sidebar-collaps" : "sidebar-header sidebar"}>
                                            <div>
                                                <img src={process.env.REACT_APP_LOGO} className="logo-icon" alt="logo icon" />
                                            </div>
                                            <div>
                                                {!isSidebarCollapsed && <h4 className="logo-text">{process.env.REACT_APP_COMPANY_NAME}</h4>}
                                            </div>
                                            <div className="toggle-icon ms-auto" onClick={e => setIsSidebarCollapsed(!isSidebarCollapsed)}>
                                                {!isSidebarCollapsed && <i className="bi bi-chevron-double-left"></i>}
                                                {isSidebarCollapsed && <i className="bi bi-chevron-double-right"></i>}
                                            </div>
                                        </div>
                                        <ul className="metismenu" id="menu">
                                            {hasUserPermission('dashobardview') &&
                                                <li>
                                                    <Link to="/dashboard">
                                                        <div className="parent-icon">
                                                            <i className="bi bi-speedometer2"></i>
                                                        </div>
                                                        <div className="menu-title">Dashboard</div>
                                                    </Link>
                                                </li>
                                            }
                                            <li>
                                                <a href="#" className="has-arrow" aria-expanded="true">
                                                    <div className="parent-icon"><i className="bi bi-house-door"></i>
                                                    </div>
                                                    <div className="menu-title">Employee</div>
                                                </a>
                                                <ul className='mm-collapse mm-show'>
                                                    <li>
                                                        <LeftMenuItem link="employee-details" icon="bi-person-badge-fill" menuName="Employee Details" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="employee-alert" icon="bi-bell" menuName="Employee Alert" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="salesman-report" icon="bi-file-earmark-bar-graph" menuName="Salesman Report" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="daily-attendence" icon="bi-calendar-date" menuName="Daily Attendence" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="employee-attendence" icon="bi-calendar-week" menuName="Monthly Attendence" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="emp-adv-payment" icon="bi-calendar-week" menuName="Advance Payment" />
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
                                                        <LeftMenuItem link="customer-details" icon="bi-person-bounding-box" menuName="Customer Details" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="customer-orders" icon="bi bi-cart3" menuName="Customer Orders" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="customer-order-cancel" icon="bi bi-x-octagon-fill" menuName="Cancelled Orders" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="customer-order-delete" icon="bi bi-trash" menuName="Deleted Orders" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="customer-order-search" icon="bi bi-binoculars" menuName="Search Orders" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="customer-order-by-delivery" icon="bi bi-calendar-week" menuName="Order By Delivery Date" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="order-alert" icon="bi bi-bell" menuName="Order Alert" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="customer-order-cutting" icon="bi bi-scissors" menuName="Cutting Orders" />
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
                                                        <LeftMenuItem icon="bi bi-layers" menuName="Products" link="products" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-cup" menuName="Product Type" link="product/product-type" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-building" menuName="Suppliers" link="suppliers" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-bag" menuName="Purchase Entry" link="purchase-entry" />
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
                                                        <LeftMenuItem icon="bi bi-file-spreadsheet" menuName=">Worker Sheet" link="worker-sheet" />
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                <a href="#" className="has-arrow" aria-expanded="true">
                                                    <div className="parent-icon">
                                                        <i className="bi bi-person-square"></i>
                                                    </div>
                                                    <div className="menu-title">Admin</div>
                                                </a>
                                                <ul className='mm-collapse'>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-person-check-fill" menuName="Activate Employee" link="admin/emp/active" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-journals" menuName="Summary Report" link="admin/acc/summary-report" />
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
                                                        <LeftMenuItem icon="bi bi-bezier" menuName="Design Category" link="design-category" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="design-samples" menuName="Design Samples" link="design-samples" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-discord" menuName="Job Title" link="job-title" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-diagram-3-fill" menuName="Master Data" link="master-data" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-diagram-2-fill" menuName="Master Data Type" link="master-data-type" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-eyeglasses" menuName="Kandoora Head" link="master-data/kandoora-head" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-gem" menuName="Kandoora Expense" link="master-data/kandoora-expense" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-brightness-high" menuName="Holiday" link="master-data/holidays" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-brightness-alt-high" menuName="Holiday Name" link="master-data/holidays/name" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-brightness-alt-low" menuName="Holiday Type" link="master-data/holidays/type" />
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                <LeftMenuItem icon="bi bi-grid" menuName="User Permission" link="user-permission" />
                                            </li>
                                            <li>
                                                <a href="/dashboard/emp" className="has-arrow" aria-expanded="true">
                                                    <div className="parent-icon"><i className="bi bi-person-badge"></i>
                                                    </div>
                                                    <div className="menu-title">Employee Dashboard</div>
                                                </a>
                                                <ul className='mm-collapse mm-show'>
                                                    <li>
                                                        <LeftMenuItem link="employee-details" icon="bi-person-badge-fill" menuName="Employee Details" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="employee-alert" icon="bi-bell" menuName="Employee Alert" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="salesman-report" icon="bi-file-earmark-bar-graph" menuName="Salesman Report" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="daily-attendence" icon="bi-calendar-date" menuName="Daily Attendence" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="employee-attendence" icon="bi-calendar-week" menuName="Monthly Attendence" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="emp-adv-payment" icon="bi-calendar-week" menuName="Advance Payment" />
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                <a href="#" onClick={e => logoutHandler(e)}>
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
            </section>
        </>
    )
}
