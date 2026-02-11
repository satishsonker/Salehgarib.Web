import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function NoAccess() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 200px)', padding: '2rem' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-xl-7">
              <div className="card shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                {/* Header Section */}
                <div className="text-center p-5" style={{ 
                  background: 'linear-gradient(135deg, #015f95 0%, #0178b8 100%)',
                  color: 'white'
                }}>
                  <div className="mb-4">
                    <div style={{ 
                      fontSize: '8rem', 
                      fontWeight: 'bold', 
                      lineHeight: '1',
                      opacity: '0.9',
                      textShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    }}>
                      401
                    </div>
                  </div>
                  <h2 className="mb-3" style={{ fontWeight: '600', fontSize: '2rem' }}>
                    Unauthorized Access
                  </h2>
                  <p className="mb-0" style={{ fontSize: '1.1rem', opacity: '0.95' }}>
                    You don't have permission to access this resource
                  </p>
                </div>

                {/* Content Section */}
                <div className="p-5" style={{ background: '#f9f9f9' }}>
                  <div className="text-center mb-4">
                    <img 
                      style={{ width: '120px', height: 'auto', opacity: '0.8' }} 
                      src='assets/images/icons/scissor.png' 
                      alt="Access Denied"
                    />
                  </div>

                  {/* Information Cards */}
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <div className="card border-0 h-100" style={{ 
                        background: 'white', 
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                      }}>
                        <div className="card-body p-4">
                          <div className="d-flex align-items-start">
                            <div className="me-3">
                              <i className="bi bi-shield-x-fill" style={{ fontSize: '2rem', color: '#dc3545' }}></i>
                            </div>
                            <div>
                              <h6 className="fw-bold mb-2" style={{ color: '#293445' }}>Access Restricted</h6>
                              <p className="mb-0 small text-muted">
                                This page requires specific permissions that your account doesn't currently have.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card border-0 h-100" style={{ 
                        background: 'white', 
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                      }}>
                        <div className="card-body p-4">
                          <div className="d-flex align-items-start">
                            <div className="me-3">
                              <i className="bi bi-info-circle-fill" style={{ fontSize: '2rem', color: '#015f95' }}></i>
                            </div>
                            <div>
                              <h6 className="fw-bold mb-2" style={{ color: '#293445' }}>What You Can Do</h6>
                              <p className="mb-0 small text-muted">
                                Contact your administrator to request access or return to your dashboard.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Helpful Information */}
                  <div className="alert alert-info border-0 mb-4" style={{ 
                    background: '#e7f3ff', 
                    borderRadius: '12px',
                    borderLeft: '4px solid #015f95'
                  }}>
                    <div className="d-flex align-items-start">
                      <i className="bi bi-lightbulb-fill text-primary me-3 mt-1" style={{ fontSize: '1.2rem' }}></i>
                      <div>
                        <strong className="d-block mb-2">Need Help?</strong>
                        <ul className="mb-0 small" style={{ paddingLeft: '1.2rem' }}>
                          <li>Verify that you're logged in with the correct account</li>
                          <li>Check if your role has been updated recently</li>
                          <li>Contact your system administrator for access requests</li>
                          <li>Ensure your session hasn't expired</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                    <button 
                      onClick={handleGoBack}
                      className="btn btn-outline-secondary px-4 py-2"
                      style={{ borderRadius: '10px', fontWeight: '500' }}
                    >
                      <i className="bi bi-arrow-left me-2"></i>Go Back
                    </button>
                    <button 
                      onClick={handleGoHome}
                      className="btn btn-primary px-4 py-2"
                      style={{ 
                        borderRadius: '10px', 
                        fontWeight: '500',
                        background: '#015f95',
                        border: 'none'
                      }}
                    >
                      <i className="bi bi-house-fill me-2"></i>Go to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
