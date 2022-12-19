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
                                            {/* {hasUserPermission('dashobardview') &&
                                                <> */}
                                            <li>
                                                <LeftMenuItem link="dashboard" icon="bi bi-speedometer2" menuName="Dashboard" />
                                            </li>
                                            <li>
                                                <a href="#/dashboard/shop" className="has-arrow" aria-expanded="true">
                                                    <div className="parent-icon">
                                                        <i className="bi bi-shop"></i>
                                                    </div>
                                                    <div className="menu-title">Shop</div>
                                                </a>
                                                <ul className='mm-collapse'>
                                                    <li>
                                                        <LeftMenuItem link="customer-orders" icon="bi-cart" menuName="Order Details" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="customer-details" icon="bi-person-bounding-box" menuName="Customer Details" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="advance-cash-visa" icon="bi bi-cash-stack" menuName="Advance Cash/Visa" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="delivery-cash-visa" icon="bi bi-cash" menuName="Delivery Cash/Visa" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="customer-order-pending" icon="bi bi-hourglass-split" menuName="Pending Orders" />
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
                                                        <LeftMenuItem link="shop-expense" icon="bi bi-scissors" menuName="Cutting Orders" />
                                                    </li>
                                                </ul>
                                            </li>
                                            {/* </>
                                            } */}
                                            <li>
                                                <a href="#" className="has-arrow" aria-expanded="true">
                                                    <div className="parent-icon"><i className="bi bi-bezier"></i>
                                                    </div>
                                                    <div className="menu-title">Design</div>
                                                </a>
                                                <ul className='mm-collapse'>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-bezier" menuName="Design Category" link="design-category" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-flower2" menuName="Design Details" link="design-samples" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-flower1" menuName="Model Quantity" link="design-category" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-flower3" menuName="Design Images" link="design-samples" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-diagram-3" menuName="All Search" link="design-category" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-whatsapp text-success" menuName="Paper WhatsApp" link="design-samples" />
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                <a href="#/dashboard/order" className="has-arrow" aria-expanded="true">
                                                    <div className="parent-icon"><i className="bi bi-bar-chart-steps"></i>
                                                    </div>
                                                    <div className="menu-title">Workshop</div>
                                                </a>
                                                <ul className='mm-collapse'>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-file-spreadsheet" menuName="Worker Sheet" link="worker-sheet" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="customer-orders" icon="bi-cart" menuName="Piece Details" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="customer-orders" icon="bi-cart" menuName="Cutting Details" />
                                                    </li>

                                                    <li>
                                                        <LeftMenuItem link="customer-orders" icon="bi-cart" menuName="H.Emb Details" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="customer-orders" icon="bi-cart" menuName="M.Emb Details" />
                                                    </li>

                                                    <li>
                                                        <LeftMenuItem link="customer-orders" icon="bi-cart" menuName="Packet Details" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="customer-orders" icon="bi-cart" menuName="Hfix Details" />
                                                    </li>

                                                    <li>
                                                        <LeftMenuItem link="customer-orders" icon="bi-cart" menuName="Apliq Details" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="customer-orders" icon="bi-cart" menuName="Stitch Details" />
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                <a href="#" className="has-arrow" aria-expanded="true">
                                                    <div className="parent-icon"><i className="bi bi-gem"></i>
                                                    </div>
                                                    <div className="menu-title">Crystal</div>
                                                </a>
                                                <ul className='mm-collapse'>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-gem" menuName="Brand Details" link="crystal-brand" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-database-fill-up" menuName="Consume Details" link="crystal-brand" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-box-seam" menuName="Consume by Brand" link="crystal-brand" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-cloud-fog2-fill" menuName="All Stock Details" link="crystal-brand" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-cone" menuName="All Stock in Brand" link="crystal-brand" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-cup-hot" menuName="New Stock" link="crystal-brand" />
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                <a href="#/dashboard/emp" className="has-arrow" aria-expanded="true">
                                                    <div className="parent-icon"><i className="bi bi-house-door"></i>
                                                    </div>
                                                    <div className="menu-title">Employee</div>
                                                </a>
                                                <ul className='mm-collapse mm-show'>
                                                    <li>
                                                        <LeftMenuItem link="employee-details?type=employee" icon="bi-person-badge-fill" menuName="Employee Details" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="employee-details?type=staff" icon="bi-person-badge-fill" menuName="Staff Details" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="employee-details?title=machine_emb" icon="bi-person-badge-fill" menuName="M.Emb Details" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="employee-details?title=hand_emb" icon="bi-person-badge-fill" menuName="H.Emb Details" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="employee-details?title=hot_fixer" icon="bi-person-badge-fill" menuName="HFix Details" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="employee-details?title=sticher" icon="bi-person-badge-fill" menuName="Stitch Details" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="employee-details?title=aplik_cutter" icon="bi-person-badge-fill" menuName="Apliq Details" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="employee-details?title=designer" icon="bi-person-badge-fill" menuName="Designers Details" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="employee-alert" icon="bi-bell" menuName="Employee Alert" />
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
                                                    <li>
                                                        <LeftMenuItem link="report/worker/performance" icon="bi-file-bar-graph" menuName="Worker Performance" />
                                                    </li>
                                                </ul>
                                            </li>

                                            <li>
                                                <a href="#/dashboard/expense" className="has-arrow" aria-expanded="true">
                                                    <div className="parent-icon"><i className="bi bi-stack"></i>
                                                    </div>
                                                    <div className="menu-title">Account</div>
                                                </a>
                                                <ul className='mm-collapse'>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-layers" menuName="Products" link="products" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-building" menuName="Suppliers" link="suppliers" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-building" menuName="Stock Details" link="account/stock-details" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-bag" menuName="Purchase Entry" link="purchase-entry" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-bag" menuName="Rent Details" link="account/rent-details" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-bag" menuName="Due Balance" link="account/rent-due" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-bag" menuName="Cash Expense" link="account/exp-cash" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-cash" menuName="Expenses" link="expense" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-cash-stack" menuName="Visa Expense" link="account/exp-visa" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-journals" menuName="Summary Report" link="admin/acc/summary-report" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-journals" menuName="Employee Salary" link="admin/acc/summary-report" />
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
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-brightness-alt-low" menuName="Rent Location" link="rent/location" />
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                <a href="#" className="has-arrow" aria-expanded="true">
                                                    <div className="parent-icon">
                                                        <i className="bi bi-life-preserver"></i>
                                                    </div>
                                                    <div className="menu-title">Admin Data</div>
                                                </a>
                                                <ul className='mm-collapse'>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-person-check-fill" menuName="Activate Employee" link="admin/emp/active" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-grid" menuName="User Permission" link="user-permission" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem icon="bi bi-journals" menuName="Summary Report" link="admin/acc/summary-report" />
                                                    </li>
                                                    <li>
                                                        <LeftMenuItem link="salesman-report" icon="bi-file-earmark-bar-graph" menuName="Salesman Report" />
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
