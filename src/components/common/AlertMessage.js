import React from 'react'
import { common } from '../../utils/common'

export default function AlertMessage({ type, message,textAlign }) {
    type = common.defaultIfEmpty(type, "info");
    textAlign = common.defaultIfEmpty(textAlign, "start");
    message = common.defaultIfEmpty(message, "This is an alter message!");

    const getAlertColor = () => {
        switch (type) {
            case 'info':
                return 'primary';
            case 'warn':
                return 'warning';
            case 'success':
                return 'success';
            case 'error':
                return 'danger';
            default:
                return 'primary';
        }
    }

    const getAlertIcon = () => {
        switch (type) {
            case 'info':
                return 'info-circle-fill';
            case 'warn':
                return 'exclamation-triangle-fill';
            case 'success':
                return 'check-circle-fill';
            case 'error':
                return 'exclamation-triangle-fill';
            default:
                return 'info-circle-fill';
        }
    }
    return (
        <>
            <div className={`alert alert-${getAlertColor()} d-flex align-items-${textAlign}`} role="alert">
                <i className={`bi bi-${getAlertIcon()}`}/>
                <div>
                   {message}
                </div>
            </div>
        </>
    )
}
