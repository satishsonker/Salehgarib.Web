import React, { useState, useEffect } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toast } from 'react-toastify';
import { toastMessage } from '../../constants/ConstantValues';
import Dropdown from '../common/Dropdown';
import Label from '../common/Label';
import ErrorLabel from '../common/ErrorLabel';
import ButtonBox from '../common/ButtonBox';
import Breadcrumb from '../common/Breadcrumb';

export default function WhatsAppMessages() {
    const [tabPageIndex, setTabPageIndex] = useState(0);
    const [customerList, setCustomerList] = useState([]);
    const [formattedCustomerList, setFormattedCustomerList] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

      const breadcrumbOption = {
        title: 'WhatsApp Messages',
        items: [
            {
                title: "WhatsApp Messages'",
                icon: "bi bi-whatsapp",
                isActive: false,
            }
        ]
    }
    // Fetch customers on component mount
    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = () => {
        setIsLoading(true);
        Api.Get(apiUrls.customerController.getAllShort)
            .then(res => {
                if (res.data && res.data.length > 0) {
                    setCustomerList(res.data);
                    // Format customers for dropdown with combined name
                    const formatted = res.data.map(customer => ({
                        id: customer.id,
                        value: `${customer.firstname || ''} ${customer.lastname || ''}`.trim() || customer.contact1 || 'Unknown',
                        firstname: customer.firstname,
                        lastname: customer.lastname,
                        contact1: customer.contact1
                    }));
                    setFormattedCustomerList(formatted);
                }
            })
            .catch(err => {
                toast.error(toastMessage.loadError || 'Failed to load customers');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleTextChange = (e) => {
        const { name, value } = e.target;
        setErrors({ ...errors, [name]: null });

        if (name === 'selectedCustomers') {
            setSelectedCustomers(value);
        } else if (name === 'message') {
            setMessage(value);
        }
    };

    const handleSendMessage = () => {
        const newErrors = {};

        if (!selectedCustomers || selectedCustomers === "" || selectedCustomers === "0") {
            newErrors.selectedCustomers = "Please select at least one customer";
        }

        if (!message || message.trim() === "") {
            newErrors.message = "Please enter a message";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Map selected customer names (from multiSelect) back to customer IDs
        const selectedCustomerNames = selectedCustomers.split(',').filter(name => name && name.trim() !== '');
        const customerIds = selectedCustomerNames.map(name => {
            const customer = formattedCustomerList.find(c => c.value === name.trim());
            return customer ? customer.id : null;
        }).filter(id => id !== null);

        if (customerIds.length === 0) {
            newErrors.selectedCustomers = "Please select valid customers";
            setErrors(newErrors);
            return;
        }

        console.log('Sending promotional message to customer IDs:', customerIds);
        console.log('Selected customers:', selectedCustomerNames);
        console.log('Message:', message);

        // TODO: Implement API call to send WhatsApp messages
        // Api.Post(apiUrls.whatsappController.sendPromotionalMessage, {
        //     customerIds: customerIds,
        //     message: message
        // }).then(res => {
        //     toast.success('Message sent successfully');
        //     setSelectedCustomers("");
        //     setMessage("");
        //     setErrors({});
        // }).catch(err => {
        //     toast.error('Failed to send message');
        // });

        toast.success(`Message will be sent to ${customerIds.length} customer(s)`);
        setSelectedCustomers("");
        setMessage("");
        setErrors({});
    };

    return (
        <div className="container-fluid">
            <Breadcrumb options={breadcrumbOption} />
            <h6 className="mb-0 text-uppercase">WhatsApp Messages</h6>
            <hr />
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">WhatsApp Messages</h5>
                        </div>
                        <div className="card-body">
                            {/* Tab Header */}
                            <div className='tab-header'>
                                <div className="d-flex flex-row justify-content-start" style={{ fontSize: 'var(--app-font-size)' }}>
                                    <div
                                        className={tabPageIndex === 0 ? "p-2 tab-header-button tab-header-button-active" : "p-2 tab-header-button"}
                                        onClick={e => setTabPageIndex(0)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Promotional Messages
                                    </div>
                                    <div
                                        className={tabPageIndex === 1 ? "p-2 tab-header-button tab-header-button-active" : "p-2 tab-header-button"}
                                        onClick={e => setTabPageIndex(1)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Order Message
                                    </div>
                                    <div
                                        className={tabPageIndex === 2 ? "p-2 tab-header-button tab-header-button-active" : "p-2 tab-header-button"}
                                        onClick={e => setTabPageIndex(2)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Advance Message
                                    </div>
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className='tab-page p-3'>
                                {/* Promotional Messages Tab */}
                                {tabPageIndex === 0 && (
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <Label text="Select Customers" isRequired={true} fontSize="13px" />
                                            <Dropdown
                                                data={formattedCustomerList}
                                                elementKey="id"
                                                text="value"
                                                name="selectedCustomers"
                                                value={selectedCustomers}
                                                onChange={handleTextChange}
                                                searchable={true}
                                                multiSelect={true}
                                                defaultText="Select customers..."
                                                className="form-control-sm"
                                                disabled={isLoading}
                                            />
                                            <ErrorLabel message={errors?.selectedCustomers} />
                                        </div>
                                        <div className="col-12">
                                            <Label text="Message" isRequired={true} fontSize="13px" />
                                            <textarea
                                                name="message"
                                                value={message}
                                                onChange={handleTextChange}
                                                className="form-control form-control-sm"
                                                rows={8}
                                                placeholder="Enter your promotional message here..."
                                                style={{ width: '100%', resize: 'vertical' }}
                                            />
                                            <ErrorLabel message={errors?.message} />
                                        </div>
                                        <div className="col-12">
                                            <ButtonBox
                                                type="save"
                                                text="Send Message"
                                                onClickHandler={handleSendMessage}
                                                className="btn-sm"
                                                icon="bi bi-send"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Order Message Tab */}
                                {tabPageIndex === 1 && (
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <p className="text-muted">Order Message functionality will be implemented here.</p>
                                        </div>
                                    </div>
                                )}

                                {/* Advance Message Tab */}
                                {tabPageIndex === 2 && (
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <p className="text-muted">Advance Message functionality will be implemented here.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
