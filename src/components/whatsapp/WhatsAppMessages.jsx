import React, { useState, useEffect, useMemo } from 'react'
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toast } from 'react-toastify';
import { toastMessage } from '../../constants/ConstantValues';
import Dropdown from '../common/Dropdown';
import Label from '../common/Label';
import ErrorLabel from '../common/ErrorLabel';
import ButtonBox from '../common/ButtonBox';
import Breadcrumb from '../common/Breadcrumb';
import Inputbox from '../common/Inputbox';

export default function WhatsAppMessages() {
    const [templateList, setTemplateList] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [templateVariables, setTemplateVariables] = useState([]);
    const [variableValues, setVariableValues] = useState({});
    const [customerList, setCustomerList] = useState([]);
    const [formattedCustomerList, setFormattedCustomerList] = useState([]);
    const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
    const [customerSearchTerm, setCustomerSearchTerm] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [messagePreview, setMessagePreview] = useState("");

    const breadcrumbOption = {
        title: 'WhatsApp Messages',
        items: [
            {
                title: "WhatsApp Messages",
                icon: "bi bi-whatsapp",
                isActive: false,
            }
        ]
    }

    // Filtered customers based on search
    const filteredCustomers = useMemo(() => {
        if (!customerSearchTerm || customerSearchTerm.trim() === "") {
            return formattedCustomerList;
        }
        return formattedCustomerList.filter(customer => {
            const searchLower = customerSearchTerm.toLowerCase();
            return (
                customer.value.toLowerCase().includes(searchLower) ||
                customer.firstName?.toLowerCase().includes(searchLower) ||
                customer.lastName?.toLowerCase().includes(searchLower) ||
                customer.contact1?.includes(customerSearchTerm)
            );
        });
    }, [formattedCustomerList, customerSearchTerm]);

    // Check if all filtered customers are selected
    const allFilteredSelected = useMemo(() => {
        return filteredCustomers.length > 0 && 
               filteredCustomers.every(customer => selectedCustomerIds.includes(customer.id));
    }, [filteredCustomers, selectedCustomerIds]);

    // Fetch templates and customers on component mount
    useEffect(() => {
        fetchTemplates();
        fetchCustomers();
    }, []);

    // Update preview when template or variables change
    useEffect(() => {
        updateMessagePreview();
    }, [selectedTemplate, variableValues]);

    const fetchTemplates = () => {
        setIsLoading(true);
        Api.Get(apiUrls.whatsappMessageTemplateController.getAll + '?pageNo=1&pageSize=1000')
            .then(res => {
                if (res.data && res.data.data && res.data.data.length > 0) {
                    const templates = res.data.data.map(template => ({
                        id: template.id,
                        value: template.templateName,
                        templateName: template.templateName,
                        body: template.body,
                        mediaUrl: template.mediaUrl,
                        hasMedia: template.hasMedia,
                        mediaVariable: template.mediaVariable,
                        variableData: template.variableData
                    }));
                    setTemplateList(templates);
                } else {
                    toast.warn('No templates found. Please create templates first.');
                }
            })
            .catch(err => {
                toast.error(toastMessage.loadError || 'Failed to load templates');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const fetchCustomers = () => {
        Api.Get(apiUrls.customerController.getAllShort)
            .then(res => {
                if (res.data && res.data.length > 0) {
                    setCustomerList(res.data);
                    debugger;
                    const formatted = res.data.map(customer => ({
                        id: customer.id,
                        value: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || customer.contact1 || 'Unknown',
                        firstName: customer.firstName,
                        lastName: customer.lastName,
                        contact1: customer.contact1
                    }));
                    setFormattedCustomerList(formatted);
                }
            })
            .catch(err => {
                toast.error(toastMessage.loadError || 'Failed to load customers');
            });
    };

    const extractVariables = (text) => {
        if (!text) return [];
        const regex = /\{\{(\d+)\}\}/g;
        const matches = [];
        let match;
        const found = new Set();
        
        while ((match = regex.exec(text)) !== null) {
            const variableKey = match[0]; // {{1}}, {{2}}, etc.
            const variableNumber = match[1]; // 1, 2, etc.
            
            if (!found.has(variableKey)) {
                found.add(variableKey);
                matches.push({ key: variableKey, number: variableNumber });
            }
        }
        
        return matches.sort((a, b) => parseInt(a.number) - parseInt(b.number));
    };

    const handleTemplateChange = (e) => {
        const templateId = e.target.value;
        if (!templateId || templateId === "0" || templateId === "") {
            setSelectedTemplate(null);
            setTemplateVariables([]);
            setVariableValues({});
            setMessagePreview("");
            setErrors({});
            return;
        }

        const template = templateList.find(t => t.id === parseInt(templateId));
        if (!template) {
            console.error('Template not found for ID:', templateId);
            return;
        }

        setSelectedTemplate(template);
        setVariableValues({});
        setErrors({});

        // Extract variables from body, mediaUrl, and mediaVariable
        const bodyVars = extractVariables(template.body || '');
        const mediaUrlVars = extractVariables(template.mediaUrl || '');
        const mediaVariableVars = extractVariables(template.mediaVariable || '');
        
        // Combine all variables
        const allVars = [...bodyVars, ...mediaUrlVars, ...mediaVariableVars];
        const uniqueVars = [];
        const seen = new Set();
        
        allVars.forEach(v => {
            if (!seen.has(v.key)) {
                seen.add(v.key);
                uniqueVars.push(v);
            }
        });

        // Parse variableData to get variable names
        let variableNames = {};
        if (template.variableData) {
            try {
                const parsed = JSON.parse(template.variableData);
                if (parsed.variables && Array.isArray(parsed.variables)) {
                    parsed.variables.forEach(v => {
                        if (v.key && v.name) {
                            variableNames[v.key] = v.name;
                        }
                    });
                }
            } catch (e) {
                console.error('Error parsing variableData:', e);
            }
        }

        // Set variables with their names
        const varsWithNames = uniqueVars.map(v => ({
            ...v,
            name: variableNames[v.key] || `Variable ${v.number}`
        }));

        setTemplateVariables(varsWithNames);
        
        // Initialize variable values
        const initialValues = {};
        varsWithNames.forEach(v => {
            initialValues[v.key] = '';
        });
        setVariableValues(initialValues);
    };

    const handleVariableChange = (variableKey, value) => {
        setVariableValues(prev => ({
            ...prev,
            [variableKey]: value
        }));
        
        // Clear error for this variable
        if (errors[`variable_${variableKey}`]) {
            setErrors(prev => ({
                ...prev,
                [`variable_${variableKey}`]: null
            }));
        }
    };

    const updateMessagePreview = () => {
        if (!selectedTemplate) {
            setMessagePreview("");
            return;
        }

        let preview = selectedTemplate.body || '';
        
        // Replace variables with values
        templateVariables.forEach(variable => {
            const value = variableValues[variable.key] || `[${variable.name}]`;
            preview = preview.replace(new RegExp(`\\{\\{${variable.number}\\}\\}`, 'g'), value);
        });

        setMessagePreview(preview);
    };

    const handleCustomerToggle = (customerId) => {
        setSelectedCustomerIds(prev => {
            if (prev.includes(customerId)) {
                return prev.filter(id => id !== customerId);
            } else {
                return [...prev, customerId];
            }
        });
        
        // Clear error
        if (errors.selectedCustomers) {
            setErrors(prev => ({
                ...prev,
                selectedCustomers: null
            }));
        }
    };

    const handleSelectAllFiltered = () => {
        if (allFilteredSelected) {
            // Deselect all filtered customers
            setSelectedCustomerIds(prev => 
                prev.filter(id => !filteredCustomers.some(c => c.id === id))
            );
        } else {
            // Select all filtered customers
            const filteredIds = filteredCustomers.map(c => c.id);
            setSelectedCustomerIds(prev => {
                const combined = [...new Set([...prev, ...filteredIds])];
                return combined;
            });
        }
    };

    const handleSelectAll = () => {
        if (selectedCustomerIds.length === formattedCustomerList.length) {
            setSelectedCustomerIds([]);
        } else {
            setSelectedCustomerIds(formattedCustomerList.map(c => c.id));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!selectedTemplate) {
            newErrors.template = "Please select a template";
        }

        if (selectedCustomerIds.length === 0) {
            newErrors.selectedCustomers = "Please select at least one customer";
        }

        // Validate all variables are filled
        templateVariables.forEach(variable => {
            if (!variableValues[variable.key] || variableValues[variable.key].trim() === "") {
                newErrors[`variable_${variable.key}`] = `${variable.name} is required`;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }

        return true;
    };

    const handleSendMessage = () => {
        if (!validateForm()) {
            return;
        }

        setIsSending(true);

        // Get customer contact numbers from selected customer IDs
        const selectedCustomers = formattedCustomerList.filter(c => selectedCustomerIds.includes(c.id));
        const customerNumbers = selectedCustomers
            .map(c => c.contact1)
            .filter(contact => contact && contact.trim() !== '');

        if (customerNumbers.length === 0) {
            toast.error('Selected customers do not have valid contact numbers');
            setIsSending(false);
            return;
        }

        // Format variableData as JSON string
        // Create an object with variable numbers as keys and values as values
        const variableDataObject = {};
        templateVariables.forEach(variable => {
            variableDataObject[variable.number] = variableValues[variable.key] || '';
        });

        // Convert to JSON string
        const variableDataString = JSON.stringify(variableDataObject);

        // Prepare request payload
        const requestPayload = {
            templateId: selectedTemplate.id,
            variableData: variableDataString,
            customerNumbers: customerNumbers
        };

        // Call API to send bulk messages
        Api.Post(apiUrls.whatsAppMessageQueueController.sendBulkMessage, requestPayload)
            .then(res => {
                toast.success(`Message queued successfully for ${customerNumbers.length} customer(s)`);
                setIsSending(false);
                
                // Reset form
                setSelectedTemplate(null);
                setTemplateVariables([]);
                setVariableValues({});
                setSelectedCustomerIds([]);
                setCustomerSearchTerm("");
                setMessagePreview("");
                setErrors({});
            })
            .catch(err => {
                const errorMessage = err?.response?.data?.message || err?.message || 'Failed to send message';
                toast.error(errorMessage);
                setIsSending(false);
            });
    };

    const getSelectedCustomers = () => {
        return formattedCustomerList.filter(c => selectedCustomerIds.includes(c.id));
    };

    return (
        <div className="container-fluid">
            <Breadcrumb options={breadcrumbOption} />
            <h6 className="mb-0 text-uppercase">WhatsApp Messages</h6>
            <hr />
            
            <div className="row">
                <div className="col-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white border-bottom">
                            <h5 className="card-title mb-0 fw-bold">
                                <i className="bi bi-whatsapp me-2 text-success"></i>
                                Send WhatsApp Messages
                            </h5>
                        </div>
                        <div className="card-body p-4">
                            <div className="row g-4">
                                {/* Template Selection */}
                                <div className="col-12">
                                    <div className="card bg-light border-0">
                                        <div className="card-body">
                                            <Label text="Select Template" isRequired={true} fontSize="14px" />
                                            <Dropdown
                                                data={templateList}
                                                elementKey="id"
                                                text="value"
                                                name="template"
                                                value={selectedTemplate?.id || ""}
                                                onChange={handleTemplateChange}
                                                searchable={true}
                                                defaultText="-- Select Template --"
                                                className="form-control-lg"
                                                disabled={isLoading}
                                            />
                                            <ErrorLabel message={errors?.template} />
                                            {isLoading && (
                                                <small className="text-muted">
                                                    <i className="bi bi-arrow-repeat spin me-1"></i>
                                                    Loading templates...
                                                </small>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Template Variables */}
                                {selectedTemplate && templateVariables.length > 0 && (
                                    <div className="col-12">
                                        <div className="card border-primary">
                                            <div className="card-header bg-primary text-white">
                                                <h6 className="mb-0">
                                                    <i className="bi bi-sliders me-2"></i>
                                                    Template Variables
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                <div className="row g-3">
                                                    {templateVariables.map((variable, index) => (
                                                        <div key={variable.key} className="col-md-6">
                                                            <Inputbox
                                                                name={`variable_${variable.key}`}
                                                                isRequired={true}
                                                                labelText={variable?.name?.toUpperCase() || `Variable ${variable.number}`}
                                                                value={variableValues[variable.key] || ''}
                                                                onChangeHandler={(e) => handleVariableChange(variable.key, e.target.value)}
                                                                placeholder={`Enter ${variable.name.toLowerCase()}`}
                                                                className="form-control-sm"
                                                                errorMessage={errors[`variable_${variable.key}`]}
                                                            />
                                                            <small className="text-muted">
                                                                Variable: {variable.key}
                                                            </small>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Message Preview */}
                                {selectedTemplate && messagePreview && (
                                    <div className="col-12">
                                        <div className="card border-info">
                                            <div className="card-header bg-info text-white">
                                                <h6 className="mb-0">
                                                    <i className="bi bi-eye me-2"></i>
                                                    Message Preview
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                <div 
                                                    className="p-3 bg-light rounded"
                                                    style={{ 
                                                        whiteSpace: 'pre-wrap',
                                                        wordWrap: 'break-word',
                                                        minHeight: '100px',
                                                        fontSize: '14px',
                                                        lineHeight: '1.6'
                                                    }}
                                                >
                                                    {messagePreview}
                                                </div>
                                                {selectedTemplate.hasMedia && selectedTemplate.mediaUrl && (
                                                    <div className="mt-2">
                                                        <small className="text-muted">
                                                            <i className="bi bi-image me-1"></i>
                                                            Media: {selectedTemplate.mediaUrl}
                                                        </small>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Customer Selection */}
                                <div className="col-12">
                                    <div className="card border-success">
                                        <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                                            <h6 className="mb-0">
                                                <i className="bi bi-people me-2"></i>
                                                Select Recipients
                                            </h6>
                                            <div className="d-flex align-items-center gap-3">
                                                <span className="badge bg-light text-dark fs-6">
                                                    {selectedCustomerIds.length} selected
                                                </span>
                                                <div className="btn-group btn-group-sm">
                                                    <button
                                                        type="button"
                                                        className="btn btn-light"
                                                        onClick={handleSelectAllFiltered}
                                                        disabled={filteredCustomers.length === 0}
                                                        title="Select/Deselect filtered customers"
                                                    >
                                                        {allFilteredSelected ? 'Deselect Filtered' : 'Select Filtered'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-light"
                                                        onClick={handleSelectAll}
                                                        title="Select/Deselect all customers"
                                                    >
                                                        {selectedCustomerIds.length === formattedCustomerList.length ? 'Deselect All' : 'Select All'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <Label 
                                                text="Search Customers" 
                                                fontSize="14px" 
                                            />
                                            <Inputbox
                                                name="customerSearch"
                                                value={customerSearchTerm}
                                                onChangeHandler={(e) => setCustomerSearchTerm(e.target.value)}
                                                placeholder="Search by name or contact number..."
                                                className="form-control-sm"
                                                icon="bi bi-search"
                                            />
                                            <ErrorLabel message={errors?.selectedCustomers} />
                                            
                                            <div className="mt-3" style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: '4px' }}>
                                                <table className="table table-hover table-sm mb-0">
                                                    <thead className="table-light sticky-top">
                                                        <tr>
                                                            <th style={{ width: '50px' }}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={allFilteredSelected && filteredCustomers.length > 0}
                                                                    onChange={handleSelectAllFiltered}
                                                                    disabled={filteredCustomers.length === 0}
                                                                    className="form-check-input"
                                                                />
                                                            </th>
                                                            <th>Customer Name</th>
                                                            <th>Contact</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredCustomers.length === 0 ? (
                                                            <tr>
                                                                <td colSpan="3" className="text-center text-muted py-4">
                                                                    {customerSearchTerm ? 'No customers found matching your search' : 'No customers available'}
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            filteredCustomers.map(customer => (
                                                                <tr 
                                                                    key={customer.id}
                                                                    className={selectedCustomerIds.includes(customer.id) ? 'table-active' : ''}
                                                                    style={{ cursor: 'pointer' }}
                                                                    onClick={() => handleCustomerToggle(customer.id)}
                                                                >
                                                                    <td onClick={(e) => e.stopPropagation()}>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedCustomerIds.includes(customer.id)}
                                                                            onChange={() => handleCustomerToggle(customer.id)}
                                                                            className="form-check-input"
                                                                        />
                                                                    </td>
                                                                    <td>{customer.firstName}</td>
                                                                    <td>{customer.contact1 || '-'}</td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="mt-2">
                                                <small className="text-muted">
                                                    <i className="bi bi-info-circle me-1"></i>
                                                    Showing {filteredCustomers.length} of {formattedCustomerList.length} customers. 
                                                    {selectedCustomerIds.length > 0 && ` ${selectedCustomerIds.length} selected.`}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="col-12">
                                    <div className="d-flex gap-2 justify-content-end">
                                        <ButtonBox
                                            type="cancel"
                                            text="Reset"
                                            onClickHandler={() => {
                                                setSelectedTemplate(null);
                                                setTemplateVariables([]);
                                                setVariableValues({});
                                                setSelectedCustomerIds([]);
                                                setCustomerSearchTerm("");
                                                setMessagePreview("");
                                                setErrors({});
                                            }}
                                            className="btn-lg"
                                            disabled={isSending}
                                        />
                                        <ButtonBox
                                            type="save"
                                            text={isSending ? "Sending..." : `Send to ${selectedCustomerIds.length} Recipient(s)`}
                                            onClickHandler={handleSendMessage}
                                            className="btn-lg"
                                            icon="bi bi-send"
                                            disabled={isSending || !selectedTemplate || selectedCustomerIds.length === 0}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .table tbody tr:hover {
                    background-color: rgba(0, 123, 255, 0.1) !important;
                }
                .table-active {
                    background-color: rgba(0, 123, 255, 0.15) !important;
                }
            `}</style>
        </div>
    )
}
