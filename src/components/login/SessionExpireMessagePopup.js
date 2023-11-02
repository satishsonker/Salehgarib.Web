import React from 'react'
import ButtonBox from '../common/ButtonBox'

export default function SessionExpireMessagePopup({ setAccessLogin }) {
    const loggOff = () => {
        setAccessLogin({});
        window.localStorage.setItem(process.env.REACT_APP_ACCESS_STORAGE_KEY, "{}");
        window.location ="#/NOACCESS";
    }
    return (
        <>
            <div className="modal fade" id="sessionExpireMessagePopupModel" tabIndex="-1" role="dialog" aria-labelledby="sessionExpireMessagePopupModelLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="sessionExpireMessagePopupModelLabel">Important Message</h5>
                            <button type="button" onClick={e=>loggOff()} className="btn-close" id='closeSessionExpireMessagePopupModel' data-bs-dismiss="modal" aria-label="Close">
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className='row'>
                                <div className='col-12 text-center'>
                                    <h6>Your login session has been expired. Please Login again.</h6>
                                    <p>
                                        As per new policy Master access login session is only valid for two days only.Its will autometically logoff and you need to login again after specified time.
                                    </p>

                                    <h6>आपका लॉगिन सत्र समाप्त हो गया है। कृपया दोबारा लॉग इन करें।</h6>
                                    <p>नई नीति के अनुसार मास्टर एक्सेस लॉगिन सत्र केवल दो दिनों के लिए वैध है। यह स्वचालित रूप से लॉगऑफ हो जाएगा और आपको निर्दिष्ट समय के बाद फिर से लॉगिन करना होगा।</p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type="cancel" onClickHandler={loggOff} modelDismiss={true} className="btn btn-sm"></ButtonBox>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
