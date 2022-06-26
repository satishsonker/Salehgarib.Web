import './App.css';
import {useState} from 'react';
import {Route, Routes, BrowserRouter as Router} from "react-router-dom";
import Footer from './components/common/Footer';
import Header from './components/common/Header';
import LeftMenu from './components/common/LeftMenu';
import Login from './components/login/Login';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/dashboard/Dashboard';
import EmployeeDetails from './components/employee/EmployeeDetails';
import CustomerDetails from './components/customer/CustomerDetails';
import CustomerOrders from './components/customer/CustomerOrders';
import CancelOrders from './components/customer/CancelOrders';

function App() {
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
                <Header authData={loginDetails} setAuthData={setLoginDetails}></Header>
                {/* <!--end top header--> */}

                {/* <!--start sidebar --> */}
                <LeftMenu></LeftMenu>
                {/* <!--end sidebar --> */}

                {/* <!--start content--> */}
                <main className="page-content">
                   
                        <Routes>
                            <Route exact path="/dashboard" element={<Dashboard/>}/>
                            <Route exact path="/employee-details" element={<EmployeeDetails/>}/>
                            <Route exact path="/customer-details" element={<CustomerDetails/>}/>
                            <Route exact path="/customer-orders" element={<CustomerOrders/>}/>
                            <Route exact path="/customer-order-cancel" element={<CancelOrders/>}/>
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
                <Footer></Footer>
            </div>
            <ToastContainer></ToastContainer>
            </Router>
        </>
    )
}

export default App;
