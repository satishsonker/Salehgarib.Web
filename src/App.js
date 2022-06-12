import './App.css';
import { useState } from 'react';
import { BrowserRouter,Route,Routes } from "react-router-dom";
import Footer from './components/common/Footer';
import Header from './components/common/Header';
import LeftMenu from './components/common/LeftMenu';
import Login from './components/login/Login';

function App() {
  const [loginDetails, setLoginDetails] = useState({
isAuthenticated:false
  });
  if(!loginDetails.isAuthenticated)
  return <Login setAuthData={setLoginDetails}></Login>

  return (
    <>
      {/* <!--start wrapper--> */}
      <div className="wrapper">
        {/* <!--start top header--> */}
        <Header></Header>
        {/* <!--end top header--> */}

        {/* <!--start sidebar --> */}
        <LeftMenu></LeftMenu>
        {/* <!--end sidebar --> */}

        {/* <!--start content--> */}
        <main className="page-content">
          <BrowserRouter>
            <Routes>
            <Route exact path="/dashboard" element={<Header />} />
            </Routes>
          </BrowserRouter>

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
    </>
  )
}

export default App;
