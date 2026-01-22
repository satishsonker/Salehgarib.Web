import React from 'react'
import ButtonBox from '../common/ButtonBox';
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';

export default function WhatsAppActionsPopup({ orderData }) {
    if (!orderData || Object.keys(orderData).length === 0) {
        return null;
    }

    const sendPickupReminder = () => {
       if (!orderData || (orderData?.status !== 'Completed' && orderData?.status !=="PartiallyDelivered")) {
            toast.error("Order is not ready for pickup.");
            return;
        }
        Api.Post(apiUrls.whatsAppNotificationController.sendOrderPickupReminder, {
            orderId: orderData.id,
            balanceAmount: orderData.balanceAmount,
            contact: orderData.contact1,
            orderNo: orderData.orderNo,
            name: orderData?.customerName?.trim()

        })
            .then(response => {
                if (response.data?.status === true)
                    toast.success(response?.data?.message || "Pickup reminder sent successfully.");
                if (response.data?.status === false)
                    toast.warning(response?.data?.message || "Pickup reminder sent successfully.");
            })
            .catch(error => {
                toast.error("Failed to send pickup reminder: " + error.message);
            });
        // Close modal
        document.getElementById('closeWhatsAppActionsModal')?.click();
    }

    const sendBalanceReminder = () => {
        if (!orderData || orderData.balanceAmount <= 0) {
            toast.error("No balance amount to remind.");
            return;
        }
        Api.Post(apiUrls.whatsAppNotificationController.sendOrderBalanceReminder, {
            orderId: orderData.id,
            balanceAmount: orderData.balanceAmount,
            contact: orderData.contact1,
            orderNo: orderData.orderNo,
            name: orderData?.customerName?.trim()

        })
            .then(response => {
                if (response.data?.status === true)
                    toast.success(response?.data?.message || "Balance reminder sent successfully.");
                if (response.data?.status === false)
                    toast.warning(response?.data?.message || "Balance reminder sent successfully.");
            })
            .catch(error => {
                toast.error("Failed to send balance reminder: " + error.message);
            });
        // Close modal
        document.getElementById('closeWhatsAppActionsModal')?.click();
    }

    const sendAdvanceReminder = () => {
        if (!orderData || orderData.advanceAmount > 0) {
            toast.error("Advance is already paid.");
            return;
        }
        Api.Post(apiUrls.whatsAppNotificationController.sendOrderAdvanceReminder, {
            orderId: orderData.id,
            contact: orderData.contact1,
            orderNo: orderData.orderNo,
            name: orderData?.customerName?.trim()

        })
            .then(response => {
                if (response.data?.status === true)
                    toast.success(response?.data?.message || "Advance reminder sent successfully.");
                if (response.data?.status === false)
                    toast.warning(response?.data?.message || "Advance reminder sent successfully.");
            })
            .catch(error => {
                toast.error("Failed to send advance reminder: " + error.message);
            });
        document.getElementById('closeWhatsAppActionsModal')?.click();
    }

    const isOrderComplete = orderData?.status === 'Completed';
    const isOrderActive = orderData?.status === 'Active';
    const hasBalance = orderData?.balanceAmount > 0;
    const hasAdvance = orderData?.advanceAmount > 0;

    return (
        <div id="whatsapp-actions-popup-model" className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" role="dialog" aria-labelledby="whatsappActionsModalLabel"
            aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="whatsappActionsModalLabel">WhatsApp Actions for {orderData.customerName}</h5>
                        <button type="button" id="closeWhatsAppActionsModal" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                    </div>
                    <div className="modal-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className="mb-3">
                                <strong>Order No.:</strong> {orderData.orderNo}</div>
                            <div className="mb-3">
                                <strong>Status:</strong> {orderData.status}</div>
                            <div className="mb-3">
                                <strong>Balance Amount:</strong> {orderData.balanceAmount.toFixed(2)}</div>
                            <div className="mb-3">
                                <strong>Advance Amount:</strong> {orderData.advanceAmount.toFixed(2)}</div>
                        </div>
                        <div className="d-flex flex-column gap-3">
                            {isOrderComplete && (
                                <ButtonBox
                                    type="send"
                                    text="Send Pickup Reminder"
                                    icon="bi bi-send"
                                    className="btn btn-success w-100"
                                    onClickHandler={sendPickupReminder}
                                />
                            )}
                            {hasBalance && isOrderComplete && (
                                <ButtonBox
                                    type="send"
                                    text="Send Balance Reminder"
                                    icon="bi bi-send"
                                    className="btn btn-warning w-100"
                                    onClickHandler={sendBalanceReminder}
                                />
                            )}

                            {!hasAdvance && isOrderActive && (
                                <ButtonBox
                                    type="send"
                                    text="Send Advance Reminder"
                                    icon="bi bi-send"
                                    className="btn btn-warning w-100"
                                    onClickHandler={sendAdvanceReminder}
                                />
                            )}
                            {!isOrderComplete && !(!hasAdvance && isOrderActive) && (
                                <p className="text-muted text-center text-danger">No whatsapp notification available for this order.</p>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <ButtonBox type="cancel" className="btn btn-sm" modelDismiss={true}>Close</ButtonBox>
                    </div>
                </div>
            </div>
        </div>
    )
}