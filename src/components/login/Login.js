import React from 'react'

export default function Login({setAuthData}) {
    const loginHandler=()=>{
        debugger;
        setAuthData({isAuthenticated:true});
    }

    return (
        <>
            <div className="wrapper">
                <main className="authentication-content">
                    <div className="container-fluid">
                        <div className="authentication-card">
                            <div className="card shadow rounded-0 overflow-hidden">
                                <div className="row g-0">
                                    <h4 className="mainheading">Saleh Garib Tailoring Shop</h4>

                                    <div className="col-lg-6 d-flex align-items-center justify-content-center border-end">
                                        <img src="assets/images/enter_mobile.jpg" className="img-fluid" alt="" />
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="card-body p-4 p-sm-5">
                                            <h5 className="card-title text-center mb-2 font-20"><strong>Employee User Login</strong></h5>
                                            <p className="card-text mb-3 text-center pt-2" style={{lineHeight:'30px'}}>Please enter you Login &amp; Your Password</p>
                                            <form className="form-body">
                                                <div className="row g-3">
                                                    <div className="col-12">
                                                        <div className="input-group flex-nowrap"> <span className="input-group-text" id="addon-wrapping"><i className="bx bx-user"></i></span>
                                                            <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="addon-wrapping" />
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="input-group flex-nowrap"> <span className="input-group-text" id="addon-wrapping"><i className="bx bx-lock"></i></span>
                                                            <input type="pass" className="form-control" placeholder="Password" aria-label="Username" aria-describedby="addon-wrapping" />
                                                        </div>
                                                    </div>
                                                    <div className="col-4 offset-md-8">
                                                        <div className="d-grid gap-3">
                                                            <button type="button" onClick={e=>loginHandler()} className="btn  btn-lg btn-primary radius-30">login<i className="bx bx-right-arrow-alt"></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
