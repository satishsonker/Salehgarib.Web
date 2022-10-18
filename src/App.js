import './App.css';
import { useState } from 'react';
import { Route, Routes, HashRouter as Router } from "react-router-dom";
import Footer from './components/common/Footer';
import Header from './components/common/Header';
import LeftMenu from './components/common/LeftMenu';
import Login from './components/login/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/dashboard/Dashboard';
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

function App() {
   const  {showLoader,setShowLoader}=useLoader();
    const [isSidebarCollapsed, setIsSidebarCollapsed ] = useState(false);
    const [loginDetails, setLoginDetails] = useState({
        isAuthenticated: false
    });

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
                        <LeftMenu authData={loginDetails} isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed} setAuthData={setLoginDetails}></LeftMenu>
                    </div>
                    {/* <!--end sidebar --> */}

                    {/* <!--start content--> */}
                    <main className={isSidebarCollapsed? "page-content page-content-collaps":"page-content page-content-expand"}>
                        <Routes>
                            <Route exact path="/" element={<Dashboard />} />
                            <Route exact path="/dashboard" element={<Dashboard />} />
                            <Route exact path="/employee-details" element={<EmployeeDetails />} />
                            <Route exact path="/employee-alert" element={<EmployeeAlert />} />
                            <Route exact path="/salesman-report" element={<SalesmanReport />} />
                            <Route exact path="/employee-attendence" element={<EmployeeAttendence />} />
                            <Route exact path="/daily-attendence" element={<DailyAttendence />} />
                            <Route exact path="/customer-details" element={<CustomerDetails />} />
                            <Route exact path="/customer-orders" element={<CustomerOrders userData={loginDetails} />} />
                            <Route exact path="/customer-order-cancel" element={<CancelOrders />} />
                            <Route exact path="/customer-order-delete" element={<DeletedOrders />} />
                            <Route exact path="/customer-order-search" element={<SearchOrders />} />
                            <Route exact path="/customer-order-by-delivery" element={<OrdersByDeliveryDate />} />
                            <Route exact path="/customer-order-cutting" element={<CuttingOrders />} />
                            <Route exact path="/products" element={<Products />} />
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
                            <Route exact path="/order-alert" element={<OrderAlert />} />
                            <Route exact path="/user-permission" element={<UserPermission></UserPermission>} />
                        </Routes>
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
