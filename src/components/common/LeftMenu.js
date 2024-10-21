import React, { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom";
import usePermission from '../../hooks/usePermission';
import Login from '../login/Login';
import LeftMenuItem from './LeftMenuItem';
import { common } from '../../utils/common';
import Cookies from 'universal-cookie';
import LoginMasterAccess from '../masterAccess/LoginMasterAccess';
export default function LeftMenu({ setAuthData, authData, isSidebarCollapsed, setIsSidebarCollapsed, accessLogin, setAccessLogin }) {
    const tokenStorageKey = process.env.REACT_APP_TOKEN_STORAGE_KEY;
    const [hasUserPermission] = usePermission();
    const [selectParentMenu, setSelectParentMenu] = useState("shop");
    const location = useLocation();

    useEffect(() => {
        //if (accessLogin?.masterAccessDetails === undefined)
        //    return;
        var roleName = accessLogin?.roleName?.toLowerCase();
        if (roleName === "superadmin" || roleName === "admin")
            return;

        var hasAccess = accessLogin?.masterAccessDetails?.filter(x => window.location.hash?.indexOf(x?.url) > -1 || window.location.hash==="/");
        if (hasAccess === undefined || hasAccess?.length === 0)
            window.location = window.location.origin + '/#/NOACCESS'
    }, [location]);

    const logoutHandler = (e) => {
        e.preventDefault();
        localStorage.removeItem(tokenStorageKey);
        setAuthData({
            isAuthenticated: false
        });
        return <Login setAuthData={setAuthData}></Login>
    }
    useEffect(() => {

    }, [authData]);

    const menuClickHandler = (e) => {
        e.target.parentElement.childNodes.forEach(res => {
            if (res.classList.contains('mm-collapse')) {
                document.getElementsByClassName('mm-show').forEach(res => {
                    res.classList.remove('mm-show');
                });
                res.classList.add('mm-show')
            }
        });
    }
    const hasAccess = (menuName) => {
        var roleName = accessLogin?.roleName?.toLowerCase();
        if (menuName === "")
            return true;
        if (accessLogin?.masterAccessDetails === undefined)
            return false;
        if (roleName === "superadmin" || roleName === "admin")
            return true;
        var hasData = accessLogin?.masterAccessDetails?.find(x => x?.menuName?.toLowerCase() === menuName?.toLowerCase());
        return hasData !== undefined;
    }

    const accessLogout = () => {
        setAccessLogin({});
        window.localStorage.setItem(process.env.REACT_APP_ACCESS_STORAGE_KEY, "{}");
        window.location = window.location.origin;
        const cookies = new Cookies();
        cookies.remove(process.env.REACT_APP_ACCESS_STORAGE_KEY);
    }
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
                                                {!isSidebarCollapsed && <h4 className="logo-text">{process.env.REACT_APP_COMPANY_NAME} {process.env.REACT_APP_COMPANY_SUBNAME}</h4>}
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
                                                <LeftMenuItem hasAccess={hasAccess} link="dashboard" icon="bi bi-speedometer2" menuName="Dashboard" />
                                            </li>
                                            <li className="mm-active" onClick={e => menuClickHandler(e)}>
                                                {hasAccess("shop") && <>
                                                    <a href="#" data-bs-toggle="modal" data-bs-target="#accessLoginModel" onClick={e => common.doNothing(e)} className="has-arrow" aria-expanded="true">
                                                        <div className="parent-icon">
                                                            <i className="bi bi-shop"></i>
                                                        </div>
                                                        <div className="menu-title">Shop</div>
                                                    </a>

                                                    <ul name="shop" className={selectParentMenu === 'shop' ? 'mm-collapse mm-show' : "mm-collapse"}>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="customer-orders" icon="bi-cart" menuName="Order Details" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="customer-details" icon="bi-person-bounding-box" menuName="Customer Details" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="report/order/advance-cash-visa" icon="bi bi-cash-stack" menuName="Advance Cash/Visa" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="report/order/delivery-cash-visa" icon="bi bi-cash" menuName="Delivery Cash/Visa" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-file-bar-graph" menuName="Daily Status" link="report/order/daily-status" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="customer-order-pending" icon="bi bi-hourglass-split" menuName="Pending Orders" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="customer-order-cancel" icon="bi bi-x-octagon-fill" menuName="Cancelled Orders" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="customer-order-delete" icon="bi bi-trash" menuName="Deleted Orders" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="customer-order-search" icon="bi bi-binoculars" menuName="Search Orders" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="customer-order-by-delivery" icon="bi bi-calendar-week" menuName="Order By Delivery Date" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="order-alert" icon="bi bi-bell" menuName="Order Alert" />
                                                        </li> 
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="missing-kandoora-images" icon="bi bi-file-earmark-image" menuName="Missing Images" />
                                                        </li>
                                                        {/* <li>
                                                        <LeftMenuItem hasAccess={hasAccess} link="shop-expense" icon="bi bi-scissors" menuName="Cutting Orders" />
                                                    </li> */}
                                                    </ul>
                                                </>}
                                            </li>
                                            <li className="mm-active" onClick={e => menuClickHandler(e)}>
                                                {hasAccess("fabric shop") && <>
                                                    <a href="#" data-bs-toggle="modal" data-bs-target="#accessLoginModel" onClick={e => common.doNothing(e)} className="has-arrow" aria-expanded="true">
                                                        <div className="parent-icon">
                                                            <i className="bi bi-cart4"></i>
                                                        </div>
                                                        <div className="menu-title">Fabric Shop</div>
                                                    </a>

                                                    <ul name="fabric shop" className={selectParentMenu === 'fabric shop' ? 'mm-collapse mm-show' : "mm-collapse"}>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="fabric-sell-details" icon="bi bi-view-list" menuName="Sale Details" />
                                                        </li>                                                        
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="fabric/purchase/detail" icon="bi bi-view-list" menuName="Fabric Purchase Detail" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="fabric/stock" icon="bi bi-view-list" menuName="Fabric Stock" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="fabric/stock/low" icon="bi bi-view-list" menuName="Fabric Low Stock" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="fabric/customers" icon="bi bi-view-list" menuName="Fabric Customers" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="fabric-cancel-sale-details" icon="bi bi-view-list" menuName="Cancel/Deleted Invoices" />
                                                        </li> 
                                                    </ul>
                                                </>
                                                }
                                            </li>
                                            {/* </>
                                            } */}
                                            <li onClick={e => menuClickHandler(e)}>
                                                {hasAccess("Design") && <>
                                                    <a href="#" className="has-arrow" aria-expanded="true" data-bs-toggle="modal" data-bs-target="#accessLoginModel">
                                                        <div className="parent-icon"><i className="bi bi-bezier"></i>
                                                        </div>
                                                        <div className="menu-title">Design</div>
                                                    </a>
                                                    <ul name="design" className={selectParentMenu === 'design' ? 'mm-collapse mm-show' : "mm-collapse"}>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-bezier" menuName="Design Category" link="design-category" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-flower2" menuName="Design Details" link="design-samples" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-flower1" menuName="Model Quantity" link="design-category" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-flower3" menuName="Design Images" link="design-samples" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-diagram-3" menuName="All Search" link="design-category" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-whatsapp text-success" menuName="Paper WhatsApp" link="design-samples" />
                                                        </li>
                                                    </ul>
                                                </>
                                                }
                                            </li>
                                            <li onClick={e => menuClickHandler(e)}>
                                                {hasAccess("workshop") && <>
                                                    <a href="#/dashboard/order" className="has-arrow" aria-expanded="true" data-bs-toggle="modal" data-bs-target="#accessLoginModel">
                                                        <div className="parent-icon"><i className="bi bi-bar-chart-steps"></i>
                                                        </div>
                                                        <div className="menu-title">Workshop</div>
                                                    </a>
                                                    <ul name="workshop" className={selectParentMenu === 'workshop' ? 'mm-collapse mm-show' : "mm-collapse"}>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-file-spreadsheet" menuName="Worker Sheet" link="worker-sheet" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="order-piece-details" icon="bi-minecart-loaded" menuName="Piece Details" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="customer/order/details/by/work-type?workType=1" icon="bi-basket3" menuName="Designing Details" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="customer/order/details/by/work-type?workType=2" icon="bi-basket" menuName="Cutting Details" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="customer/order/details/by/work-type?workType=3" icon="bi-bag-fill" menuName="M.Emb Details" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="customer/order/details/by/work-type?workType=5" icon="bi-cart-plus-fill" menuName="H.Emb Details" />
                                                        </li>

                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="customer/order/details/by/work-type?workType=4" icon="bi-cart4" menuName="Hfix Details" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="customer/order/details/by/work-type?workType=6" icon="bi-cart3" menuName="Apliq Details" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="customer/order/details/by/work-type?workType=7" icon="bi-cart-x" menuName="Stitch Details" />
                                                        </li>
                                                    </ul>
                                                </>
                                                }
                                            </li>
                                            <li onClick={e => menuClickHandler(e)}>
                                                {hasAccess("Crystal") && <>
                                                    <a href="#/dashboard/crystal" className="has-arrow" aria-expanded="true" data-bs-toggle="modal" data-bs-target="#accessLoginModel">
                                                        <div className="parent-icon"><i className="bi bi-gem"></i>
                                                        </div>
                                                        <div className="menu-title">Crystal</div>
                                                    </a>
                                                    <ul name="crystal" className={selectParentMenu === 'crystal' ? 'mm-collapse mm-show' : "mm-collapse"}>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-gem" menuName="Crystal Master" link="crystal/master" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-tag" menuName="Low Stock Alert" link="crystal/stock/get/alert" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-tag" menuName="Update Stock" link="crystal/stock/update" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-receipt" menuName="Consume Details" link="crystal/stock/consumed/details" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-box-seam" menuName="Consume by Brand" link="crystal-brand" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-cloud-fog2-fill" menuName="Stock Details" link="crystal/stock/details" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-cone" menuName="All Stock in Brand" link="crystal-brand" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-handbag" menuName="Add Stock" link="crystal/purchase" />
                                                        </li>
                                                    </ul>
                                                </>
                                                }
                                            </li>
                                            <li onClick={e => menuClickHandler(e)}>
                                                {hasAccess("Employee") && <>
                                                    <a href="#/dashboard/emp" className="has-arrow" aria-expanded="true" data-bs-toggle="modal" data-bs-target="#accessLoginModel">
                                                        <div className="parent-icon"><i className="bi bi-people"></i>
                                                        </div>
                                                        <div className="menu-title">Employee</div>
                                                    </a>
                                                    <ul name="employee" className={selectParentMenu === 'employee' ? 'mm-collapse mm-show' : "mm-collapse"}>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="employee-details?type=employee" icon="bi-person-badge-fill" menuName="Employee Details" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="employee-details?type=staff" icon="bi-person-badge-fill" menuName="Staff Details" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="employee-details?title=machine_emb" icon="bi-person-badge-fill" menuName="M.Emb Details" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="employee-details?title=hand_emb" icon="bi-person-badge-fill" menuName="H.Emb Details" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="employee-details?title=hot_fixer" icon="bi-person-badge-fill" menuName="HFix Details" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="employee-details?title=sticher" icon="bi-person-badge-fill" menuName="Stitch Details" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="employee-details?title=aplik_cutter" icon="bi-person-badge-fill" menuName="Apliq Details" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="employee-details?title=designer" icon="bi-person-badge-fill" menuName="Designers Details" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="employee-alert" icon="bi-bell" menuName="Employee Alert" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="daily-attendence" icon="bi-calendar-date" menuName="Daily Attendence" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="employee-attendence" icon="bi-calendar-week" menuName="Monthly Attendence" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="emp-adv-payment" icon="bi-calendar-week" menuName="Advance Payment" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="report/worker/performance" icon="bi-file-bar-graph" menuName="Worker Performance" />
                                                        </li>
                                                    </ul>
                                                </>
                                                }
                                            </li>
                                            <li onClick={e => menuClickHandler(e)}>
                                                {hasAccess("Account") && <>
                                                    <a href="#/dashboard/expense" className="has-arrow" aria-expanded="true" data-bs-toggle="modal" data-bs-target="#accessLoginModel">
                                                        <div className="parent-icon"><i className="bi bi-stack"></i>
                                                        </div>
                                                        <div className="menu-title">Account</div>
                                                    </a>
                                                    <ul name="account" className={selectParentMenu === 'account' ? 'mm-collapse mm-show' : "mm-collapse"}>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-layers" menuName="Products" link="products" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-building" menuName="Suppliers" link="suppliers" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-building" menuName="Stock Details" link="account/stock-details" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-bag" menuName="Purchase Entry" link="purchase-entry" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-bag" menuName="Rent Details" link="account/rent-details" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-journal-code" menuName="Due Balance" link="account/rent-due" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-journal-plus" menuName="Cash Expense" link="account/exp-cash" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-cash" menuName="Expenses" link="expense" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-cash-stack" menuName="Visa Expense" link="account/exp-visa" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-journals" menuName="Summary Report" link="admin/acc/summary-report" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-file-bar-graph" menuName="Billing Tax Report" link="report/order/billing-tax-report" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-x-diamond-fill" menuName="Cancel Tax Report" link="report/order/cancel-tax-report" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-book-half" menuName="Daily Status" link="report/order/daily-status" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-card-list" menuName="Employee Salary" link="emp-salary-slip" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-list-stars" menuName="Kandoora Exp. Report" link="report/order/eack-kandoora-exp-report" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-hdd-network" menuName="Daily Work Statement" link="report/order/daily-work-statement-report" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-credit-card-2-back-fill" menuName="Salary Payment" link="emp/salary/payment" />
                                                        </li>
                                                    </ul>
                                                </>}
                                            </li>
                                            <li onClick={e => menuClickHandler(e)}>
                                                {hasAccess("Master Data") && <>
                                                    <a href="#" className="has-arrow" aria-expanded="true" data-bs-toggle="modal" data-bs-target="#accessLoginModel">
                                                        <div className="parent-icon">
                                                            <i className="bi bi-life-preserver"></i>
                                                        </div>
                                                        <div className="menu-title">Master Data</div>
                                                    </a>
                                                    <ul name="master" className={selectParentMenu === 'master' ? 'mm-collapse mm-show' : "mm-collapse"}>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-discord" menuName="Job Title" link="job-title" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-diagram-3-fill" menuName="Master Data" link="master-data" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-diagram-2-fill" menuName="Master Data Type" link="master-data-type" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-eyeglasses" menuName="Kandoora Head" link="master-data/kandoora-head" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-gem" menuName="Kandoora Expense" link="master-data/kandoora-expense" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-brightness-high" menuName="Holiday" link="master-data/holidays" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-brightness-alt-high" menuName="Holiday Name" link="master-data/holidays/name" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-brightness-alt-low" menuName="Holiday Type" link="master-data/holidays/type" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-brightness-alt-low" menuName="Rent Location" link="rent/location" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-brightness-alt-low" menuName="Work Descriptipn" link="master-data/work-description" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-broadcast-pin" menuName="Fabric Brand" link="fabric/master/brand" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-broadcast-pin" menuName="Fabric Size" link="fabric/master/size" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-broadcast-pin" menuName="Fabric Type" link="fabric/master/type" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-broadcast-pin" menuName="Fabric Print Type" link="fabric/master/print/type" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-broadcast-pin" menuName="Fabric Color" link="fabric/master/color" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-broadcast-pin" menuName="Fabric Sale Mode" link="fabric/master/sale/mode" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-broadcast-pin" menuName="Fabric Discount Type" link="fabric/master/discount/type" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-broadcast-pin" menuName="Add Fabric" link="fabric/master" />
                                                        </li>
                                                    </ul>
                                                </>
                                                }
                                            </li>
                                            <li onClick={e => menuClickHandler(e)}>
                                                {hasAccess("Admin Data") && <>
                                                    <a href="#" className="has-arrow" aria-expanded="true" data-bs-toggle="modal" data-bs-target="#accessLoginModel">
                                                        <div className="parent-icon">
                                                            <i className="bi bi-life-preserver"></i>
                                                        </div>
                                                        <div className="menu-title">Admin Data</div>
                                                    </a>
                                                    <ul name="admin" className={selectParentMenu === 'admin' ? 'mm-collapse mm-show' : "mm-collapse"}>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-person-check-fill" menuName="Master Access" link="master/access" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-person-check-fill" menuName="Activate Employee" link="admin/emp/active" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-grid" menuName="User Permission" link="user-permission" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} icon="bi bi-journals" menuName="Summary Report" link="admin/acc/summary-report" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="salesman-report" icon="bi-file-earmark-bar-graph" menuName="Salesman Report" />
                                                        </li>
                                                        <li>
                                                            <LeftMenuItem hasAccess={hasAccess} link="admin/order/edit-payments" icon="bi-pen-fill" menuName="Edit Payments" />
                                                        </li>
                                                    </ul>
                                                </>
                                                }
                                            </li>
                                            {(accessLogin?.roleName ?? "").length === 0 && <>
                                                <li>
                                                    <a href="#" className='text-danger' onClick={e => common.doNothing(e)} data-bs-toggle="modal" data-bs-target="#accessLoginModel">
                                                        <div className="parent-icon">
                                                            <i className="bi bi-lock"></i>
                                                        </div>
                                                        <div className="menu-title">Access Login</div>
                                                    </a>
                                                </li>
                                            </>
                                            }
                                            {(accessLogin?.roleName ?? "").length > 0 && <>
                                                <li>
                                                    <a href="#" className='text-danger' onClick={e => common.doNothing(e)}>
                                                        <div className="parent-icon">
                                                            <i className="bi bi-person-fill"></i>
                                                        </div>
                                                        <div className="menu-title">User : {accessLogin?.employeeName}</div>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#" className='text-danger' onClick={e => { common.doNothing(e); accessLogout(); }} data-bs-toggle="modal" data-bs-target="#accessLoginModel">
                                                        <div className="parent-icon">
                                                            <i className="bi bi-lock"></i>
                                                        </div>
                                                        <div className="menu-title">Access Logout</div>
                                                    </a>
                                                </li>
                                            </>
                                            }
                                            <li>
                                                <a href="#" onClick={e => logoutHandler(e)} data-bs-toggle="modal" data-bs-target="#accessLoginModel">
                                                    <div className="parent-icon">
                                                        <i className="bi bi-lock"></i>
                                                    </div>
                                                    <div className="menu-title">App Logout</div>
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
            {(accessLogin?.id ?? 0) === 0 && <LoginMasterAccess setAccessLogin={setAccessLogin} accessLogin={accessLogin}></LoginMasterAccess>}
        </>
    )
}
