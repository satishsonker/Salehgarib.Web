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
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";
import SessionExpireMessagePopup from './components/login/SessionExpireMessagePopup';
import MissingKandooraImages from './components/customer/MissingKandooraImages';
import EmployeeSalaryPayment from './components/account/EmployeeSalaryPayment';
import EditOrderPayments from './components/admin/EditOrderPayments';
import FabricBrandDetails from './components/fabric/fabricMaster/FabricBrandDetails';
import FabricTypeDetails from './components/fabric/fabricMaster/FabricTypeDetails';
import FabricSizeDetails from './components/fabric/fabricMaster/FabricSizeDetails';
import FabricSaleModeDetail from './components/fabric/fabricMaster/FabricSaleModeDetail';
import FabricDetails from './components/fabric/fabricMaster/FabricDetails';
import FabricStocks from './components/fabric/fabricStock/FabricStocks';
import FabricLowStocks from './components/fabric/fabricStock/FabricLowStocks';
import FabricPurchaseDetails from './components/fabric/fabricPurchase/FabricPurchaseDetails';
import FabricColorDetails from './components/fabric/fabricMaster/FabricColorDetails';
import FabricPrintTypeDetails from './components/fabric/fabricMaster/FabricPrintTypeDetails';
import FabricCustomerDetails from './components/fabric/fabricCustomer/FabricCustomerDetails';
import FabricDiscountType from './components/fabric/fabricMaster/FabricDiscountType';
import FabricSaleDetails from './components/fabric/FabricSells/FabricSaleDetails';
import FabricCancelSaleDetail from './components/fabric/FabricSells/FabricCancelSaleDetail';
import FabricBillingTaxReport from './components/account/FabricBillingTaxReport';
import AssignFabricSellMode from './components/fabric/fabricMaster/AssignFabricSellMode';
import ApplicationSettings from './components/masters/ApplicationSettings';
import FabricStockTransfer from './components/fabric/fabricStock/FabricStockTransfer';
import FabricDailyStatusReport from './components/fabric/Reports/FabricDailyStatusReport';

function App() {
    const { showLoader, setShowLoader } = useLoader();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [accessLogin, setAccessLogin] = useState({});
    const [loginDetails, setLoginDetails] = useState({
        isAuthenticated: false
    });

    const cookies = new Cookies();

    useEffect(() => {
        const accessCookie = cookies.get(process.env.REACT_APP_ACCESS_STORAGE_KEY);

        // If the cookie is not available, clear the access state and exit
        if (!accessCookie) {
            setAccessLogin({});
            return;
        }

        try {
            // Decode token only if cookie exists
            const decodedToken = jwt_decode(accessCookie);

            // Check if the token has expired
            if (new Date(decodedToken.exp * 1000) <= new Date()) {
                setAccessLogin({});
                window.localStorage.setItem(process.env.REACT_APP_ACCESS_STORAGE_KEY, "{}");
                return;
            }

            // Retrieve the access data from localStorage
            const accessJsonStr = window.localStorage.getItem(process.env.REACT_APP_ACCESS_STORAGE_KEY);

            if (accessJsonStr && accessJsonStr !== "{}") {
                const accessJson = JSON.parse(accessJsonStr);
                setAccessLogin(accessJson);
            } else {
                setAccessLogin({});
            }

        } catch (error) {
            // Handle potential errors (e.g., JWT decoding failure)
            console.error("Error decoding the token or parsing localStorage:", error);
            setAccessLogin({});
            window.localStorage.setItem(process.env.REACT_APP_ACCESS_STORAGE_KEY, "{}");
        }
    }, [loginDetails]); // Ensure loginDetails is the correct dependency

    // const openSessionMessageHandler = () => {
    //     var accessCookie = cookies.get(process.env.REACT_APP_ACCESS_STORAGE_KEY);
    //     if (accessCookie === undefined || accessCookie === null) {
    //     var btnOpenSession = document.getElementById("btnOpenSession");
    //     if (btnOpenSession !== undefined && btnOpenSession !== null)
    //         btnOpenSession.click();
    //     }
    //     return true;
    // }
    // openSessionMessageHandler();
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
                            setAuthData={setLoginDetails}
                            accessLogin={accessLogin}
                            setAccessLogin={setAccessLogin}
                        ></LeftMenu>
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
                                <Route exact path="/missing-kandoora-images" element={<MissingKandooraImages />} />
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
                                <Route exact path="/emp/salary/payment" element={<EmployeeSalaryPayment />} />
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
                                <Route exact path="/fabric/master/color" element={<FabricColorDetails></FabricColorDetails>} />
                                <Route exact path="/fabric/master/print/type" element={<FabricPrintTypeDetails></FabricPrintTypeDetails>} />
                                <Route exact path="/fabric/master/type" element={<FabricTypeDetails></FabricTypeDetails>} />
                                <Route exact path="/fabric/master/size" element={<FabricSizeDetails></FabricSizeDetails>} />
                                <Route exact path="/fabric/master" element={<FabricDetails userData={loginDetails} accessLogin={accessLogin}></FabricDetails>} />
                                <Route exact path="/fabric/stock" element={<FabricStocks userData={loginDetails} accessLogin={accessLogin}></FabricStocks>} />
                                <Route exact path="/fabric/master/sale/mode" element={<FabricSaleModeDetail userData={loginDetails} accessLogin={accessLogin}></FabricSaleModeDetail>} />
                                <Route exact path="/fabric/master/discount/type" element={<FabricDiscountType></FabricDiscountType>} />
                                <Route exact path="/fabric/customers" element={<FabricCustomerDetails userData={loginDetails} accessLogin={accessLogin}></FabricCustomerDetails>} />
                                <Route exact path="/fabric/stock/low" element={<FabricLowStocks userData={loginDetails} accessLogin={accessLogin}></FabricLowStocks>} /> 
                                <Route exact path="/fabric/stock/transfer" element={<FabricStockTransfer userData={loginDetails} accessLogin={accessLogin}></FabricStockTransfer>} />
                                <Route exact path="/fabric/purchase/detail" element={<FabricPurchaseDetails userData={loginDetails} accessLogin={accessLogin}></FabricPurchaseDetails>} />
                                <Route exact path="/fabric-sell-details" element={<FabricSaleDetails userData={loginDetails} accessLogin={accessLogin}></FabricSaleDetails>} />
                                <Route exact path="/fabric-tax-report" element={<FabricBillingTaxReport userData={loginDetails} accessLogin={accessLogin}></FabricBillingTaxReport>} />
                                 <Route exact path="/fabric-daily-status" element={<FabricDailyStatusReport userData={loginDetails} accessLogin={accessLogin}></FabricDailyStatusReport>} />
                                 <Route exact path="/fabric-cancel-sale-details" element={<FabricCancelSaleDetail userData={loginDetails} accessLogin={accessLogin}></FabricCancelSaleDetail>} />
                                <Route exact path="/NOACCESS" element={<NoAccess></NoAccess>} />  
                                <Route exact path="/application/settings" element={<ApplicationSettings></ApplicationSettings>} /> 
                                <Route exact path="/fabric/assign/sellMode" element={<AssignFabricSellMode/>} />
                                <Route exact path="/admin/order/edit-payments" element={<EditOrderPayments></EditOrderPayments>} />
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
            <SessionExpireMessagePopup setAccessLogin={setAccessLogin} />
            <button id="btnOpenSession" data-bs-target="#sessionExpireMessagePopupModel" data-bs-toggle="modal"></button>
        </>
    )
}

export default App;

// export default App;
// // App.js
// import './App.css';
// import { useState, useEffect, lazy, Suspense } from 'react';
// import { Route, Routes, HashRouter as Router } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import Cookies from 'universal-cookie';
// import jwt_decode from 'jwt-decode';
// import 'react-toastify/dist/ReactToastify.css';

// import Header from './components/common/Header';
// import Footer from './components/common/Footer';
// import LeftMenu from './components/common/LeftMenu';
// import Loader from './components/common/Loader';
// import ErrorBoundary from './components/errorHandler/ErrorBoundary';
// import useLoader from './hooks/useLoader';
// import SessionExpireMessagePopup from './components/login/SessionExpireMessagePopup';

// // Lazy-load all route components
// const Login = lazy(() => import('./components/login/Login'));
// const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
// const EmployeeDashboard = lazy(() => import('./components/dashboard/EmployeeDashboard'));
// const EmployeeDetails = lazy(() => import('./components/employee/EmployeeDetails'));
// const CustomerDetails = lazy(() => import('./components/customer/CustomerDetails'));
// const CustomerOrders = lazy(() => import('./components/customer/CustomerOrders'));
// const CancelOrders = lazy(() => import('./components/customer/CancelOrders'));
// const CuttingOrders = lazy(() => import('./components/customer/CuttingOrders'));
// const EmployeeAttendance = lazy(() => import('./components/employee/EmployeeAttendence'));
// const Products = lazy(() => import('./components/stocks/products/Products'));
// const Suppliers = lazy(() => import('./components/stocks/suppliers/Suppliers'));
// const DesignCategory = lazy(() => import('./components/masters/DesignCategory'));
// const DesignSamples = lazy(() => import('./components/masters/DesignSamples'));
// const JobTitle = lazy(() => import('./components/masters/JobTitle'));
// const MasterData = lazy(() => import('./components/masters/MasterData'));
// const MasterDataType = lazy(() => import('./components/masters/MasterDataType'));
// const DeletedOrders = lazy(() => import('./components/customer/DeletedOrders'));
// const SearchOrders = lazy(() => import('./components/customer/SearchOrders'));
// const OrdersByDeliveryDate = lazy(() => import('./components/customer/OrdersByDeliveryDate'));
// const DailyAttendance = lazy(() => import('./components/employee/DailyAttendence'));
// const PurchaseEntry = lazy(() => import('./components/stocks/purchase/PurchaseEntry'));
// const WorkerSheet = lazy(() => import('./components/workers/WorkerSheet'));
// const EmployeeAlert = lazy(() => import('./components/employee/EmployeeAlert'));
// const SalesmanReport = lazy(() => import('./components/employee/SalesmanReport'));
// const KandooraHead = lazy(() => import('./components/masters/KandooraHead'));
// const KandooraExpense = lazy(() => import('./components/masters/KandooraExpense'));
// const EmployeeAdvancePayment = lazy(() => import('./components/employee/EmployeeAdvancePayment'));
// const OrderAlert = lazy(() => import('./components/customer/OrderAlert'));
// const UserPermission = lazy(() => import('./components/userPermission/UserPermission'));
// const Holiday = lazy(() => import('./components/holiday/Holiday'));
// const HolidayName = lazy(() => import('./components/holiday/HolidayName'));
// const HolidayType = lazy(() => import('./components/holiday/HolidayType'));
// const EmployeeActive = lazy(() => import('./components/admin/EmployeeActive'));
// const ProductType = lazy(() => import('./components/stocks/products/ProductType'));
// const SummaryReport = lazy(() => import('./components/admin/SummaryReport'));
// const OrderDashboard = lazy(() => import('./components/dashboard/OrderDashboard'));
// const ShopDashboard = lazy(() => import('./components/dashboard/ShopDashboard'));
// const ExpenseType = lazy(() => import('./components/expense/ExpenseType'));
// const ExpenseName = lazy(() => import('./components/expense/ExpenseName'));
// const CompanyShopCompany = lazy(() => import('./components/expense/CompanyShopName'));
// const Expenses = lazy(() => import('./components/expense/Expenses'));
// const PendingOrders = lazy(() => import('./components/customer/PendingOrders'));
// const ExpenseDashboard = lazy(() => import('./components/dashboard/ExpenseDashboard'));
// const RentLocation = lazy(() => import('./components/rent/RentLocation'));
// const RentDetail = lazy(() => import('./components/rent/RentDetails'));
// const DeuRent = lazy(() => import('./components/rent/DeuRent'));
// const WorkerPerformance = lazy(() => import('./components/report/WorkerPerformance'));
// const OrderDetailByWorkType = lazy(() => import('./components/customer/OrderDetailByWorkType'));
// const EmployeeSalarySlip = lazy(() => import('./components/account/EmployeeSalarySlip'));
// const DailyStatusReport = lazy(() => import('./components/account/DailyStatusReport'));
// const BillingTaxReport = lazy(() => import('./components/account/BillingTaxReport'));
// const CancelTaxReport = lazy(() => import('./components/account/CancelTaxReport'));
// const WorkDescription = lazy(() => import('./components/masters/WorkDescription'));
// const DeliveryCashVisaReport = lazy(() => import('./components/account/DeliveryCashVisaReport'));
// const AdvanceCashVisaReport = lazy(() => import('./components/account/AdvanceCashVisaReport'));
// const CrystalMaster = lazy(() => import('./components/crystal/CrystalMaster'));
// const CrystalPurchase = lazy(() => import('./components/crystal/CrystalPurchase'));
// const CrystalStockAlert = lazy(() => import('./components/crystal/CrystalStockAlert'));
// const CrystalStockUpdate = lazy(() => import('./components/crystal/CrystalStockUpdate'));
// const OrderPieceDetails = lazy(() => import('./components/customer/OrderPieceDetails'));
// const EachKandooraExpenseReport = lazy(() => import('./components/account/EachKandooraExpenseReport'));
// const CrystalStockDetails = lazy(() => import('./components/crystal/CrystalStockDetails'));
// const CrystalTrackingOut = lazy(() => import('./components/crystal/CrystalTrackingOut'));
// const DailyWorkStatement = lazy(() => import('./components/account/DailyWorkStatement'));
// const CrystalStockConsumedDetails = lazy(() => import('./components/crystal/CrystalStockConsumedDetails'));
// const CrystalDashboard = lazy(() => import('./components/dashboard/CrystalDashboard'));
// const MasterAccess = lazy(() => import('./components/masterAccess/MasterAccess'));
// const NoAccess = lazy(() => import('./components/common/NoAccess'));
// const MissingKandooraImages = lazy(() => import('./components/customer/MissingKandooraImages'));
// const EmployeeSalaryPayment = lazy(() => import('./components/account/EmployeeSalaryPayment'));
// const EditOrderPayments = lazy(() => import('./components/admin/EditOrderPayments'));
// const FabricBrandDetails = lazy(() => import('./components/fabric/fabricMaster/FabricBrandDetails'));
// const FabricTypeDetails = lazy(() => import('./components/fabric/fabricMaster/FabricTypeDetails'));
// const FabricSizeDetails = lazy(() => import('./components/fabric/fabricMaster/FabricSizeDetails'));
// const FabricSaleModeDetail = lazy(() => import('./components/fabric/fabricMaster/FabricSaleModeDetail'));
// const FabricDetails = lazy(() => import('./components/fabric/fabricMaster/FabricDetails'));
// const FabricStocks = lazy(() => import('./components/fabric/fabricStock/FabricStocks'));
// const FabricLowStocks = lazy(() => import('./components/fabric/fabricStock/FabricLowStocks'));
// const FabricPurchaseDetails = lazy(() => import('./components/fabric/fabricPurchase/FabricPurchaseDetails'));
// const FabricColorDetails = lazy(() => import('./components/fabric/fabricMaster/FabricColorDetails'));
// const FabricPrintTypeDetails = lazy(() => import('./components/fabric/fabricMaster/FabricPrintTypeDetails'));
// const FabricCustomerDetails = lazy(() => import('./components/fabric/fabricCustomer/FabricCustomerDetails'));
// const FabricDiscountType = lazy(() => import('./components/fabric/fabricMaster/FabricDiscountType'));
// const FabricSaleDetails = lazy(() => import('./components/fabric/FabricSells/FabricSaleDetails'));
// const FabricCancelSaleDetail = lazy(() => import('./components/fabric/FabricSells/FabricCancelSaleDetail'));
// const FabricBillingTaxReport = lazy(() => import('./components/account/FabricBillingTaxReport'));
// const UrlNotFound = lazy(() => import('./components/common/UrlNotFound'));

// function App() {
//     const { showLoader } = useLoader();
//     const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//     const [accessLogin, setAccessLogin] = useState({});
//     const [loginDetails, setLoginDetails] = useState({ isAuthenticated: false });
//     const cookies = new Cookies();

//     useEffect(() => {
//         const accessCookie = cookies.get(process.env.REACT_APP_ACCESS_STORAGE_KEY);
//         if (!accessCookie) {
//             setAccessLogin({});
//             return;
//         }
//         const decodedToken = jwt_decode(accessCookie);
//         if (new Date(decodedToken.exp * 1000) <= new Date()) {
//             setAccessLogin({});
//             window.localStorage.setItem(process.env.REACT_APP_ACCESS_STORAGE_KEY, '{}');
//             return;
//         }

//         const accessJsonStr = window.localStorage.getItem(process.env.REACT_APP_ACCESS_STORAGE_KEY);
//         if (accessJsonStr) {
//             try {
//                 const accessJson = JSON.parse(accessJsonStr);
//                 setAccessLogin(accessJson);
//             } catch {
//                 setAccessLogin({});
//                 window.localStorage.setItem(process.env.REACT_APP_ACCESS_STORAGE_KEY, '{}');
//             }
//         }
//     }, [loginDetails]);

//     if (!loginDetails.isAuthenticated) {
//         return (
//             <Suspense fallback={<Loader show={true} />}>
//                 <Login setAuthData={setLoginDetails} />
//             </Suspense>
//         );
//     }

//     return (
//         <Router>
//             <div className="wrapper">
//                 <Header
//                     authData={loginDetails}
//                     setIsSidebarCollapsed={setIsSidebarCollapsed}
//                     isSidebarCollapsed={isSidebarCollapsed}
//                     setAuthData={setLoginDetails}
//                 />

//                 <div className="menu-slider">
//                     <LeftMenu
//                         authData={loginDetails}
//                         isSidebarCollapsed={isSidebarCollapsed}
//                         setIsSidebarCollapsed={setIsSidebarCollapsed}
//                         setAuthData={setLoginDetails}
//                         accessLogin={accessLogin}
//                         setAccessLogin={setAccessLogin}
//                     />
//                 </div>

//                 <main className={isSidebarCollapsed ? 'collapsed' : ''}>
//                     <Suspense fallback={<Loader show={showLoader} />}>
//                         <ErrorBoundary>
//                             <Routes>
//                                 <Route path="/" element={<Dashboard />} />
//                                 <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
//                                 <Route path="/employee-details" element={<EmployeeDetails />} />
//                                 <Route path="/customer-details" element={<CustomerDetails />} />
//                                 <Route path="/customer-orders" element={<CustomerOrders />} />
//                                 <Route path="/cancel-orders" element={<CancelOrders />} />
//                                 <Route path="/cutting-orders" element={<CuttingOrders />} />
//                                 <Route path="/employee-attendance" element={<EmployeeAttendance />} />
//                                 <Route path="/products" element={<Products />} />
//                                 <Route path="/suppliers" element={<Suppliers />} />
//                                 <Route path="/design-category" element={<DesignCategory />} />
//                                 <Route path="/design-samples" element={<DesignSamples />} />
//                                 <Route path="/job-title" element={<JobTitle />} />
//                                 <Route path="/master-data" element={<MasterData />} />
//                                 <Route path="/master-data-type" element={<MasterDataType />} />
//                                 <Route path="/deleted-orders" element={<DeletedOrders />} />
//                                 <Route path="/search-orders" element={<SearchOrders />} />
//                                 <Route path="/orders-by-delivery-date" element={<OrdersByDeliveryDate />} />
//                                 <Route path="/daily-attendance" element={<DailyAttendance />} />
//                                 <Route path="/purchase-entry" element={<PurchaseEntry />} />
//                                 <Route path="/worker-sheet" element={<WorkerSheet />} />
//                                 <Route path="/employee-alert" element={<EmployeeAlert />} />
//                                 <Route path="/salesman-report" element={<SalesmanReport />} />
//                                 <Route path="/kandoora-head" element={<KandooraHead />} />
//                                 <Route path="/kandoora-expense" element={<KandooraExpense />} />
//                                 <Route path="/employee-advance-payment" element={<EmployeeAdvancePayment />} />
//                                 <Route path="/order-alert" element={<OrderAlert />} />
//                                 <Route path="/user-permission" element={<UserPermission />} />
//                                 <Route path="/holiday" element={<Holiday />} />
//                                 <Route path="/holiday-name" element={<HolidayName />} />
//                                 <Route path="/holiday-type" element={<HolidayType />} />
//                                 <Route path="/employee-active" element={<EmployeeActive />} />
//                                 <Route path="/product-type" element={<ProductType />} />
//                                 <Route path="/summary-report" element={<SummaryReport />} />
//                                 <Route path="/order-dashboard" element={<OrderDashboard />} />
//                                 <Route path="/shop-dashboard" element={<ShopDashboard />} />
//                                 <Route path="/expense-type" element={<ExpenseType />} />
//                                 <Route path="/expense-name" element={<ExpenseName />} />
//                                 <Route path="/company-shop-company" element={<CompanyShopCompany />} />
//                                 <Route path="/expenses" element={<Expenses />} />
//                                 <Route path="/pending-orders" element={<PendingOrders />} />
//                                 <Route path="/expense-dashboard" element={<ExpenseDashboard />} />
//                                 <Route path="/rent-location" element={<RentLocation />} />
//                                 <Route path="/rent-detail" element={<RentDetail />} />
//                                 <Route path="/deu-rent" element={<DeuRent />} />
//                                 <Route path="/worker-performance" element={<WorkerPerformance />} />
//                                 <Route path="/order-detail-by-work-type" element={<OrderDetailByWorkType />} />
//                                 <Route path="/employee-salary-slip" element={<EmployeeSalarySlip />} />
//                                 <Route path="/daily-status-report" element={<DailyStatusReport />} />
//                                 <Route path="/billing-tax-report" element={<BillingTaxReport />} />
//                                 <Route path="/cancel-tax-report" element={<CancelTaxReport />} />
//                                 <Route path="/work-description" element={<WorkDescription />} />
//                                 <Route path="/delivery-cash-visa-report" element={<DeliveryCashVisaReport />} />
//                                 <Route path="/advance-cash-visa-report" element={<AdvanceCashVisaReport />} />
//                                 <Route path="/crystal-master" element={<CrystalMaster />} />
//                                 <Route path="/crystal-purchase" element={<CrystalPurchase />} />
//                                 <Route path="/crystal-stock-alert" element={<CrystalStockAlert />} />
//                                 <Route path="/crystal-stock-update" element={<CrystalStockUpdate />} />
//                                 <Route path="/order-piece-details" element={<OrderPieceDetails />} />
//                                 <Route path="/each-kandoora-expense-report" element={<EachKandooraExpenseReport />} />
//                                 <Route path="/crystal-stock-details" element={<CrystalStockDetails />} />
//                                 <Route path="/crystal-tracking-out" element={<CrystalTrackingOut />} />
//                                 <Route path="/daily-work-statement" element={<DailyWorkStatement />} />
//                                 <Route path="/crystal-stock-consumed-details" element={<CrystalStockConsumedDetails />} />
//                                 <Route path="/crystal-dashboard" element={<CrystalDashboard />} />
//                                 <Route path="/master-access" element={<MasterAccess />} />
//                                 <Route path="/no-access" element={<NoAccess />} />
//                                 <Route path="/missing-kandoora-images" element={<MissingKandooraImages />} />
//                                 <Route path="/employee-salary-payment" element={<EmployeeSalaryPayment />} />
//                                 <Route path="/edit-order-payments" element={<EditOrderPayments />} />
//                                 <Route path="/fabric-brand-details" element={<FabricBrandDetails />} />
//                                 <Route path="/fabric-type-details" element={<FabricTypeDetails />} />
//                                 <Route path="/fabric-size-details" element={<FabricSizeDetails />} />
//                                 <Route path="/fabric-sale-mode-detail" element={<FabricSaleModeDetail />} />
//                                 <Route path="/fabric-details" element={<FabricDetails />} />
//                                 <Route path="/fabric-stocks" element={<FabricStocks />} />
//                                 <Route path="/fabric-low-stocks" element={<FabricLowStocks />} />
//                                 <Route path="/fabric-purchase-details" element={<FabricPurchaseDetails />} />
//                                 <Route path="/fabric-color-details" element={<FabricColorDetails />} />
//                                 <Route path="/fabric-print-type-details" element={<FabricPrintTypeDetails />} />
//                                 <Route path="/fabric-customer-details" element={<FabricCustomerDetails />} />
//                                 <Route path="/fabric-discount-type" element={<FabricDiscountType />} />
//                                 <Route path="/fabric-sale-details" element={<FabricSaleDetails />} />
//                                 <Route path="/fabric-cancel-sale-detail" element={<FabricCancelSaleDetail />} />
//                                 <Route path="/fabric-billing-tax-report" element={<FabricBillingTaxReport />} />
//                                 <Route path="/*" element={<UrlNotFound />} />
//                             </Routes>
//                         </ErrorBoundary>
//                     </Suspense>
//                 </main>
                
//                 <Footer />
//                 <ToastContainer />
//                 <SessionExpireMessagePopup />
//             </div>
//         </Router>
//     );
// }

// export default App;

