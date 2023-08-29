import './App.css';
import { useState, useEffect } from 'react';
import { Route, Routes, HashRouter as Router } from "react-router-dom";
import Footer from './components/common/Footer';
import Header from './components/common/Header';
import LeftMenu from './components/common/LeftMenu';
import Login from './components/login/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/dashboard/Dashboard';
import EmployeeDashboard from './components/dashboard/EmployeeDashboard';
import EmployeeDetails from './components/employee/EmployeeDetails';
import CustomerDetails from './components/customer/CustomerDetails';
import CustomerOrders from './components/customer/CustomerOrders';
import CancelOrders from './components/customer/CancelOrders';
import CuttingOrders from './components/customer/CuttingOrders';
import EmployeeAttendence from './components/employee/EmployeeAttendence';
import Products from './components/stocks/products/Products';
import Suppliers from './components/stocks/suppliers/Suppliers';
import DesignCategory from './components/masters/DesignCategory';
import DesignSamples from './components/masters/DesignSamples';
import JobTitle from './components/masters/JobTitle';
import MasterData from './components/masters/MasterData';
import MasterDataType from './components/masters/MasterDataType';
import DeletedOrders from './components/customer/DeletedOrders';
import SearchOrders from './components/customer/SearchOrders';
import OrdersByDeliveryDate from './components/customer/OrdersByDeliveryDate';
import DailyAttendence from './components/employee/DailyAttendence';
import PurchaseEntry from './components/stocks/purchase/PurchaseEntry';
import WorkerSheet from './components/workers/WorkerSheet';
import EmployeeAlert from './components/employee/EmployeeAlert';
import SalesmanReport from './components/employee/SalesmanReport';
import KandooraHead from './components/masters/KandooraHead';
import KandooraExpense from './components/masters/KandooraExpense';
import EmployeeAdvancePayment from './components/employee/EmployeeAdvancePayment';
import OrderAlert from './components/customer/OrderAlert';
import Loader from './components/common/Loader';
import useLoader from './hooks/useLoader';
import UserPermission from './components/userPermission/UserPermission';
import Holiday from './components/holiday/Holiday';
import HolidayName from './components/holiday/HolidayName';
import HolidayType from './components/holiday/HolidayType';
import EmployeeActive from './components/admin/EmployeeActive';
import ProductType from './components/stocks/products/ProductType';
import SummaryReport from './components/admin/SummaryReport';
import OrderDashboard from './components/dashboard/OrderDashboard';
import ShopDashboard from './components/dashboard/ShopDashboard';
import ExpenseType from './components/expense/ExpenseType';
import ExpenseName from './components/expense/ExpenseName';
import CompanyShopCompany from './components/expense/CompanyShopName';
import Expenses from './components/expense/Expenses';
import PendingOrders from './components/customer/PendingOrders';
import ExpenseDashboard from './components/dashboard/ExpenseDashboard';
import ErrorBoundary from './components/errorHandler/ErrorBoundary';
import RentLocation from './components/rent/RentLocation';
import RentDetail from './components/rent/RentDetails';
import DeuRent from './components/rent/DeuRent';
import WorkerPerformance from './components/report/WorkerPerformance';
import OrderDetailByWorkType from './components/customer/OrderDetailByWorkType';
import EmployeeSalarySlip from './components/account/EmployeeSalarySlip';
import DailyStatusReport from './components/account/DailyStatusReport';
import BillingTaxReport from './components/account/BillingTaxReport';
import CancelTaxReport from './components/account/CancelTaxReport';
import WorkDescription from './components/masters/WorkDescription';
import DeliveryCashVisaReport from './components/account/DeliveryCashVisaReport';
import AdvanceCashVisaReport from './components/account/AdvanceCashVisaReport';
import CrystalMaster from './components/crystal/CrystalMaster';
import CrystalPurchase from './components/crystal/CrystalPurchase';
import CrystalStockAlert from './components/crystal/CrystalStockAlert';
import CrystalStockUpdate from './components/crystal/CrystalStockUpdate';
import OrderPieceDetails from './components/customer/OrderPieceDetails';
import EachKandooraExpenseReport from './components/account/EachKandooraExpenseReport';
import CrystalStockDetails from './components/crystal/CrystalStockDetails';
import CrystalTrackingOut from './components/crystal/CrystalTrackingOut';
import DailyWorkStatement from './components/account/DailyWorkStatement';
import CrystalStockConsumedDetails from './components/crystal/CrystalStockConsumedDetails';
import CrystalDashboard from './components/dashboard/CrystalDashboard';
import UrlNotFound from './components/common/UrlNotFound';
import MasterAccess from './components/masterAccess/MasterAccess';
import NoAccess from './components/common/NoAccess';
import FabricBrandDetails from './components/fabricMaster/FabricBrandDetails';

function App() {
    const { showLoader, setShowLoader } = useLoader();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const [accessLogin, setAccessLogin] = useState({});
    const [loginDetails, setLoginDetails] = useState({
        isAuthenticated: false
    });
   
useEffect(() => { //fetching the master access data from local storage and setting the access object
    var accessJsonStr=window.localStorage.getItem(process.env.REACT_APP_ACCESS_STORAGE_KEY);
    if(accessJsonStr!==undefined && accessJsonStr!=="{}" && accessJsonStr!=="" )
    {
        try {
            var accessJson=JSON.parse(accessJsonStr);
            setAccessLogin({...accessJson});
        } catch (error) {
            setAccessLogin({});
        }
    }
}, [])

    if (!loginDetails.isAuthenticated)
        return <Login setAuthData={setLoginDetails}></Login>
    return (
        <>
            <Router>
                {/* <!--start wrapper--> */}

                <div className="wrapper">
                    {/* <!--start top header--> */}
                    <Header authData={loginDetails} setIsSidebarCollapsed={setIsSidebarCollapsed} isSidebarCollapsed={isSidebarCollapsed} setAuthData={setLoginDetails}></Header>
                    {/* <!--end top header--> */}

                    {/* <!--start sidebar --> */}
                    <div className='menu-slider'>
                        <LeftMenu
                            authData={loginDetails}
                            isSidebarCollapsed={isSidebarCollapsed}
                            setIsSidebarCollapsed={setIsSidebarCollapsed}
                            setAuthData={setLoginDetails} accessLogin={accessLogin} setAccessLogin={setAccessLogin} ></LeftMenu>
                    </div>
                    {/* <!--end sidebar --> */}

                    {/* <!--start content--> */}
                    <main className={isSidebarCollapsed ? "page-content page-content-collaps" : "page-content page-content-expand"}>
                        <ErrorBoundary>
                            <Routes>
                                <Route path='*' element={<UrlNotFound />} />
                                <Route exact path="/" element={<Dashboard />} />
                                <Route exact path="/dashboard" element={<Dashboard />} />
                                <Route exact path="/employee-details" element={<EmployeeDetails />} />
                                <Route exact path="/employee-alert" element={<EmployeeAlert />} />
                                <Route exact path="/salesman-report" element={<SalesmanReport />} />
                                <Route exact path="/employee-attendence" element={<EmployeeAttendence />} />
                                <Route exact path="/daily-attendence" element={<DailyAttendence />} />
                                <Route exact path="/customer-details" element={<CustomerDetails />} />
                                <Route exact path="/customer-orders" element={<CustomerOrders userData={loginDetails} accessLogin={accessLogin} />} />
                                <Route exact path="/customer-order-cancel" element={<CancelOrders />} />
                                <Route exact path="/customer-order-delete" element={<DeletedOrders />} />
                                <Route exact path="/customer-order-search" element={<SearchOrders />} />
                                <Route exact path="/customer-order-by-delivery" element={<OrdersByDeliveryDate />} />
                                <Route exact path="/customer-order-cutting" element={<CuttingOrders />} />
                                <Route exact path="/products" element={<Products />} />
                                <Route exact path="/product/product-type" element={<ProductType />} />
                                <Route exact path="/suppliers" element={<Suppliers />} />
                                <Route exact path="/design-category" element={<DesignCategory />} />
                                <Route exact path="/design-samples" element={<DesignSamples />} />
                                <Route exact path="/job-title" element={<JobTitle />} />
                                <Route exact path="/master-data" element={<MasterData />} />
                                <Route exact path="/master-data-type" element={<MasterDataType />} />
                                <Route exact path="/master-data/kandoora-head" element={<KandooraHead />} />
                                <Route exact path="/master-data/kandoora-expense" element={<KandooraExpense />} />
                                <Route exact path="/purchase-entry" element={<PurchaseEntry />} />
                                <Route exact path="/worker-sheet" element={<WorkerSheet />} />
                                <Route exact path="/emp-adv-payment" element={<EmployeeAdvancePayment />} />
                                <Route exact path="/emp-salary-slip" element={<EmployeeSalarySlip />} />
                                <Route exact path="/order-alert" element={<OrderAlert />} />
                                <Route exact path="/order-piece-details" element={<OrderPieceDetails />} />
                                <Route exact path="/user-permission" element={<UserPermission></UserPermission>} />
                                <Route exact path="/master-data/holidays" element={<Holiday></Holiday>} />
                                <Route exact path="/master-data/work-description" element={<WorkDescription></WorkDescription>} />
                                <Route exact path="/master-data/holidays/name" element={<HolidayName></HolidayName>} />
                                <Route exact path="/master-data/holidays/type" element={<HolidayType></HolidayType>} />
                                <Route exact path="admin/emp/active" element={<EmployeeActive></EmployeeActive>} />
                                <Route exact path="admin/acc/summary-report" element={<SummaryReport></SummaryReport>} />
                                <Route exact path="/dashboard/emp" element={<EmployeeDashboard></EmployeeDashboard>} />
                                <Route exact path="/dashboard/order" element={<OrderDashboard></OrderDashboard>} />
                                <Route exact path="/dashboard/shop" element={<ShopDashboard></ShopDashboard>} />
                                <Route exact path="/dashboard/expense" element={<ExpenseDashboard></ExpenseDashboard>} />
                                <Route exact path="/dashboard/crystal" element={<CrystalDashboard></CrystalDashboard>} />
                                <Route exact path="/expense/type" element={<ExpenseType></ExpenseType>} />
                                <Route exact path="/expense/name" element={<ExpenseName></ExpenseName>} />
                                <Route exact path="/expense/company" element={<CompanyShopCompany></CompanyShopCompany>} />
                                <Route exact path="/expense" element={<Expenses></Expenses>} />
                                <Route exact path="/customer-order-pending" element={<PendingOrders></PendingOrders>} />
                                <Route exact path="/rent/location" element={<RentLocation></RentLocation>} />
                                <Route exact path="/account/rent-details" element={<RentDetail></RentDetail>} />
                                <Route exact path="/account/rent-due" element={<DeuRent></DeuRent>} />
                                <Route exact path="/report/worker/performance" element={<WorkerPerformance></WorkerPerformance>} />
                                <Route exact path="/report/order/daily-status" element={<DailyStatusReport></DailyStatusReport>} />
                                <Route exact path="/report/order/billing-tax-report" element={<BillingTaxReport></BillingTaxReport>} />
                                <Route exact path="/report/order/cancel-tax-report" element={<CancelTaxReport></CancelTaxReport>} />
                                <Route exact path="/report/order/delivery-cash-visa" element={<DeliveryCashVisaReport></DeliveryCashVisaReport>} />
                                <Route exact path="/report/order/advance-cash-visa" element={<AdvanceCashVisaReport></AdvanceCashVisaReport>} />
                                <Route exact path="/report/order/eack-kandoora-exp-report" element={<EachKandooraExpenseReport></EachKandooraExpenseReport>} />
                                <Route exact path="/report/order/daily-work-statement-report" element={<DailyWorkStatement></DailyWorkStatement>} />
                                <Route exact path="/customer/order/details/by/work-type" element={<OrderDetailByWorkType></OrderDetailByWorkType>} />
                                <Route exact path="/master/access" element={<MasterAccess></MasterAccess>} />
                                <Route exact path="/crystal/master" element={<CrystalMaster></CrystalMaster>} />
                                <Route exact path="/crystal/purchase" element={<CrystalPurchase></CrystalPurchase>} />
                                <Route exact path="/crystal/stock/get/alert" element={<CrystalStockAlert></CrystalStockAlert>} />
                                <Route exact path="/crystal/stock/update" element={<CrystalStockUpdate></CrystalStockUpdate>} />
                                <Route exact path="/crystal/stock/details" element={<CrystalStockDetails></CrystalStockDetails>} />
                                <Route exact path="/crystal/stock/tracking/out" element={<CrystalTrackingOut></CrystalTrackingOut>} />
                                <Route exact path="/crystal/stock/consumed/details" element={<CrystalStockConsumedDetails></CrystalStockConsumedDetails>} />
                                <Route exact path="/fabric/master/brand" element={<FabricBrandDetails></FabricBrandDetails>} />
                                <Route exact path="/NOACCESS" element={<NoAccess></NoAccess>} />
                            </Routes>
                        </ErrorBoundary>
                    </main>
                    {/* <!--end page main--> */}

                    {/* <!--start overlay--> */}
                    <div className="overlay nav-toggle-icon"></div>
                    {/* <!--end overlay--> */}

                    {/* <!--Start Back To Top Button--> */}
                    <a href="#" className="back-to-top"><i className='bx bxs-up-arrow-alt'></i></a>
                    {/* <!--End Back To Top Button--> */}

                    {/* <!--start switcher-->
       
       <!--end switcher--> */}
                    <Footer isSidebarCollapsed={isSidebarCollapsed}></Footer>
                </div>
                <ToastContainer></ToastContainer>
            </Router>
            <Loader show={showLoader}></Loader>
        </>
    )
}

export default App;
