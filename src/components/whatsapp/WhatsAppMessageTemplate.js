import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toastMessage } from '../../constants/ConstantValues';
import { validationMessage } from '../../constants/validationMessage';
import { common } from '../../utils/common';
import Breadcrumb from '../common/Breadcrumb';
import ButtonBox from '../common/ButtonBox';
import Dropdown from '../common/Dropdown';
import ErrorLabel from '../common/ErrorLabel';
import Inputbox from '../common/Inputbox';
import Label from '../common/Label';
import TableView from '../tables/TableView';

export default function WhatsAppMessageTemplate() {
    const templateModelTemplate = {
        id: 0,
        contentSID: '',
        body: '',
        templateName: '',
        mediaUrl: '',
        templateCategory: '',
        templateGroup: '',
        variableData: ''
    }
    const [templateModel, setTemplateModel] = useState(templateModelTemplate);
    const [isRecordSaving, setIsRecordSaving] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [errors, setErrors] = useState({});
    const [categoryList, setCategoryList] = useState([]);
    const [groupList, setGroupList] = useState([]);
    const [extractedVariables, setExtractedVariables] = useState([]);
    const [variableNames, setVariableNames] = useState({});
    const [duplicateVariables, setDuplicateVariables] = useState([]);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showImageGallery, setShowImageGallery] = useState(false);

    const handleDelete = (id) => {
        Api.Delete(apiUrls.whatsappMessageTemplateController.delete + id).then(res => {
            if (res.data === 1) {
                handleSearch('');
                toast.success(toastMessage.deleteSuccess);
            }
        }).catch(err => {
            toast.error(toastMessage.deleteError);
        });
    }

    const handleSearch = (searchTerm) => {
        if (searchTerm !== null && searchTerm.length > 0 && searchTerm.length < 3)
            return;
        const url = searchTerm && searchTerm.length > 0
            ? `${apiUrls.whatsappMessageTemplateController.search}?searchTerm=${searchTerm}&pageNo=${pageNo}&pageSize=${pageSize}`
            : `${apiUrls.whatsappMessageTemplateController.getAll}?pageNo=${pageNo}&pageSize=${pageSize}`;
        
        Api.Get(url).then(res => {
            tableOptionTemplet.data = res.data.data || [];
            tableOptionTemplet.totalRecords = res.data.totalRecords || 0;
            setTableOption({ ...tableOptionTemplet });
        }).catch(err => {
            toast.error(toastMessage.loadError);
        });
    }

    const extractVariables = (...texts) => {
        const allMatches = [];
        const variableCount = {};
        const duplicates = [];
        const regex = /\{\{(\d+)\}\}/g;
        
        texts.forEach(text => {
            if (!text) return;
            let match;
            while ((match = regex.exec(text)) !== null) {
                const variableKey = match[0]; // {{1}}, {{2}}, etc.
                const variableNumber = match[1]; // 1, 2, etc.
                
                // Count occurrences
                if (!variableCount[variableKey]) {
                    variableCount[variableKey] = 0;
                }
                variableCount[variableKey]++;
                
                // Add to matches if not already added
                if (!allMatches.find(m => m.key === variableKey)) {
                    allMatches.push({ key: variableKey, number: variableNumber });
                }
            }
        });
        
        // Find duplicates (variables that appear more than once)
        Object.keys(variableCount).forEach(key => {
            if (variableCount[key] > 1) {
                duplicates.push(key);
            }
        });
        
        setDuplicateVariables(duplicates);
        
        return allMatches.sort((a, b) => parseInt(a.number) - parseInt(b.number));
    };

    const updateVariableData = (vars, names) => {
        if (vars.length === 0) {
            setTemplateModel(prev => ({ ...prev, variableData: '' }));
            return;
        }
        const variables = vars.map(v => ({
            key: v.key,
            name: names[v.key] || ''
        }));
        const jsonData = JSON.stringify({ variables });
        setTemplateModel(prev => ({ ...prev, variableData: jsonData }));
    };

    const handleTextChange = (e) => {
        const { name, value } = e.target;
        setTemplateModel({ ...templateModel, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }

        // Extract variables when body or mediaUrl changes
        if (name === 'body' || name === 'mediaUrl') {
            // Extract from both body and mediaUrl
            const bodyText = name === 'body' ? value : templateModel.body;
            const mediaUrlText = name === 'mediaUrl' ? value : templateModel.mediaUrl;
            const vars = extractVariables(bodyText, mediaUrlText);
            setExtractedVariables(vars);
            // Initialize variable names if new variables are found
            const newVariableNames = { ...variableNames };
            vars.forEach(v => {
                if (!newVariableNames[v.key]) {
                    newVariableNames[v.key] = '';
                }
            });
            // Remove old variable names that are no longer in body or mediaUrl
            Object.keys(newVariableNames).forEach(key => {
                if (!vars.find(v => v.key === key)) {
                    delete newVariableNames[key];
                }
            });
            setVariableNames(newVariableNames);
            // Update variableData
            updateVariableData(vars, newVariableNames);
        }
    }

    const handleVariableNameChange = (variableKey, name) => {
        const newVariableNames = { ...variableNames, [variableKey]: name };
        setVariableNames(newVariableNames);
        // Update variableData
        updateVariableData(extractedVariables, newVariableNames);
        // Clear error for this variable
        if (errors[`variable_${variableKey}`]) {
            setErrors({ ...errors, [`variable_${variableKey}`]: null });
        }
    }

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }
        
        setSelectedImageFile(file);
        setIsUploading(true);
        
        const formData = new FormData();
        formData.append('File', file);
        formData.append('DirectoryPath', 'whatsapp/templates/media');
        formData.append('FileName', file.name);
        
        Api.FileUploadPut(apiUrls.whatsAppMessageQueueController.uploadmedia, formData)
            .then(res => {
                if (res.data) {
                    // API may return filePath, url, or a string
                    let fullUrl = res.data.filePath || res.data.url || res.data;
                    // If it's a relative path, prepend the API URL
                    if (fullUrl && !fullUrl.startsWith('http')) {
                        fullUrl = process.env.REACT_APP_API_URL + (fullUrl.startsWith('/') ? fullUrl : '/' + fullUrl);
                    }
                    setTemplateModel(prev => ({ ...prev, mediaUrl: fullUrl }));
                    toast.success(toastMessage.saveSuccess || 'Image uploaded successfully');
                    // Reload uploaded images list
                    loadUploadedImages();
                    // Trigger variable extraction for mediaUrl
                    const bodyText = templateModel.body || '';
                    const vars = extractVariables(bodyText, fullUrl);
                    setExtractedVariables(vars);
                }
            })
            .catch(err => {
                if (err?.response?.data?.errors?.File?.[0] !== undefined) {
                    toast.error(err.response.data.errors.File[0]);
                    return;
                }
                toast.error(toastMessage.saveError || 'Failed to upload image');
            })
            .finally(() => {
                setIsUploading(false);
                setSelectedImageFile(null);
                e.target.value = ''; // Reset file input
            });
    }

    const handleImageSelect = (image) => {
        // image.fullUrl is already the complete URL
        const fullUrl = image.fullUrl || (image.filePath?.startsWith('http') ? image.filePath : (process.env.REACT_APP_API_URL + image.filePath));
        setTemplateModel(prev => ({ ...prev, mediaUrl: fullUrl }));
        setShowImageGallery(false);
        toast.success('Image selected');
        // Trigger variable extraction for mediaUrl
        const bodyText = templateModel.body || '';
        const vars = extractVariables(bodyText, fullUrl);
        setExtractedVariables(vars);
    }

    const loadUploadedImages = () => {
        // Load images from WhatsApp media endpoint
        Api.Get(apiUrls.whatsAppMessageQueueController.getMedia + '?directoryPath=whatsapp/templates/media')
            .then(res => {
                if (res.data && res.data.length > 0) {
                    const images = res.data.map((img, index) => {
                        const filePath = img.filePath || img.url || img;
                        const fullUrl = filePath.startsWith('http') ? filePath : (process.env.REACT_APP_API_URL + filePath);
                        return {
                            id: img.id || index,
                            filePath: filePath,
                            fullUrl: fullUrl,
                            thumbPath: img.thumbPath || filePath,
                            fileName: img.fileName || img
                        };
                    });
                    setUploadedImages(images);
                } else {
                    setUploadedImages([]);
                }
            })
            .catch(err => {
                console.error('Error loading images:', err);
                setUploadedImages([]);
            });
    }

    const handleSave = (e) => {
        e.preventDefault();
        const formError = validateError();
        if (Object.keys(formError).length > 0) {
            setErrors(formError);
            return;
        }

        let data = common.assignDefaultValue(templateModelTemplate, templateModel);
        if (isRecordSaving) {
            Api.Put(apiUrls.whatsappMessageTemplateController.add, data).then(res => {
                if (res.data && res.data.id > 0) {
                    common.closePopup('closePopupWhatsAppTemplate');
                    toast.success(toastMessage.saveSuccess);
                    handleSearch('');
                    setTemplateModel({ ...templateModelTemplate });
                }
            }).catch(err => {
                toast.error(toastMessage.saveError);
            });
        } else {
            Api.Post(apiUrls.whatsappMessageTemplateController.update, templateModel).then(res => {
                if (res.data && res.data.id > 0) {
                    common.closePopup('closePopupWhatsAppTemplate');
                    toast.success(toastMessage.updateSuccess);
                    handleSearch('');
                    setTemplateModel({ ...templateModelTemplate });
                }
            }).catch(err => {
                toast.error(toastMessage.updateError);
            });
        }
    }

    const handleEdit = (templateId) => {
        setIsRecordSaving(false);
        setErrors({});
        Api.Get(apiUrls.whatsappMessageTemplateController.getById + templateId).then(res => {
            if (res.data && res.data.id > 0) {
                setTemplateModel(res.data);
                // Extract variables from both body and mediaUrl
                const vars = extractVariables(res.data.body || '', res.data.mediaUrl || '');
                setExtractedVariables(vars);
                
                // Parse variableData if exists
                let names = {};
                if (res.data.variableData) {
                    try {
                        const parsed = JSON.parse(res.data.variableData);
                        if (parsed.variables && Array.isArray(parsed.variables)) {
                            parsed.variables.forEach(v => {
                                if (v.key && v.name) {
                                    names[v.key] = v.name;
                                }
                            });
                        }
                    } catch (e) {
                        console.error('Error parsing variableData:', e);
                    }
                }
                setVariableNames(names);
            }
        }).catch(err => {
            toast.error(toastMessage.getError);
        });
    };

    const validateError = () => {
        const { templateName, body, templateCategory, templateGroup } = templateModel;
        const newError = {};
        if (!templateName || templateName.trim() === "") {
            newError.templateName = validationMessage.templateNameRequired || "Template name is required";
        }
        if (!body || body.trim() === "") {
            newError.body = validationMessage.templateBodyRequired || "Message body is required";
        }
        if (!templateCategory || templateCategory.trim() === "") {
            newError.templateCategory = validationMessage.templateCategoryRequired || "Template category is required";
        }
        if (!templateGroup || templateGroup.trim() === "") {
            newError.templateGroup = validationMessage.templateGroupRequired || "Template group is required";
        }
        // Validate variable names
        extractedVariables.forEach(v => {
            if (!variableNames[v.key] || variableNames[v.key].trim() === "") {
                newError[`variable_${v.key}`] = `Variable name for ${v.key} is required`;
            }
        });
        return newError;
    }

    const tableOptionTemplet = {
        headers: [
            { name: 'Template Name', prop: 'templateName' },
            { name: 'Category', prop: 'templateCategory' },  
            { name: 'Group', prop: 'templateGroup' },
            { name: 'Body', prop: 'body', customColumn: (data) => {
                const body = data.body || '';
                return body.length > 50 ? body.substring(0, 50) + '...' : body;
            }},
            { name: 'Content SID', prop: 'contentSID' }
        ],
        data: [],
        totalRecords: 0,
        pageSize: pageSize,
        pageNo: pageNo,
        setPageNo: setPageNo,
        setPageSize: setPageSize,
        searchHandler: handleSearch,
        actions: {
            showView: false,
            popupModelId: "add-whatsapp-template",
            delete: {
                handler: handleDelete
            },
            edit: {
                handler: handleEdit
            }
        }
    };

    useEffect(() => {
      Api.Get(apiUrls.masterDataController.getByMasterDataTypes+'?masterDataTypes=whatsApp_template_category&masterDataTypes=whatsApp_template_group').then(res => {
        if (res.data && res.data.length > 0) {
          const groupList = res.data.filter(x => x.masterDataTypeCode === "whatsApp_template_group");
          const categoryList = res.data.filter(x => x.masterDataTypeCode === "whatsApp_template_category");
          setGroupList(groupList);
          setCategoryList(categoryList);
        }
      }).catch(err => {
        toast.error(toastMessage.getError);
      });
      // Load uploaded images
      loadUploadedImages();
    }, [])
    

    const saveButtonHandler = () => {
        setTemplateModel({ ...templateModelTemplate });
        setErrors({});
        setIsRecordSaving(true);
        setExtractedVariables([]);
        setVariableNames({});
        setDuplicateVariables([]);
        setShowImageGallery(false);
    }

    const [tableOption, setTableOption] = useState(tableOptionTemplet);
    const breadcrumbOption = {
        title: 'WhatsApp Message Template',
        items: [
            {
                title: "WhatsApp Message Template",
                icon: "bi bi-whatsapp",
                isActive: false,
            }
        ],
        buttons: [
            {
                text: "Template",
                icon: 'bx bx-plus',
                modelId: 'add-whatsapp-template',
                handler: saveButtonHandler
            }
        ]
    }

    useEffect(() => {
        setIsRecordSaving(true);
        handleSearch('');
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (isRecordSaving) {
            setTemplateModel({ ...templateModelTemplate });
            setExtractedVariables([]);
            setVariableNames({});
            setDuplicateVariables([]);
            setShowImageGallery(false);
        }
    }, [isRecordSaving]);

    return (
        <>
            <Breadcrumb option={breadcrumbOption}></Breadcrumb>
            <h6 className="mb-0 text-uppercase">WhatsApp Message Template Details</h6>
            <hr />
            <TableView option={tableOption}></TableView>

            {/* Add/Edit Template Popup Model */}
            <div id="add-whatsapp-template" className="modal fade in" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{isRecordSaving ? 'New' : 'Edit'} WhatsApp Message Template</h5>
                            <button type="button" className="btn-close" id='closePopupWhatsAppTemplate' data-bs-dismiss="modal" aria-hidden="true"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal form-material">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="row g-3">
                                            <div className="col-md-12">
                                                <Inputbox 
                                                    labelText="Template Name" 
                                                    className="form-control-sm" 
                                                    isRequired={true} 
                                                    onChangeHandler={handleTextChange} 
                                                    name="templateName" 
                                                    value={templateModel.templateName} 
                                                    errorMessage={errors?.templateName} 
                                                />
                                            </div>
                                            <div className="col-md-12">
                                                <Label text="Category" />
                                                <Dropdown 
                                                    data={categoryList} 
                                                    className="form-control-sm" 
                                                    onChange={handleTextChange} 
                                                    value={templateModel.templateCategory} 
                                                    name="templateCategory" 
                                                    elementKey="code" 
                                                    text="value"
                                                    defaultText='Select Category' 
                                                    defaultValue=''
                                                />
                                                <ErrorLabel message={errors?.templateCategory}></ErrorLabel>
                                            </div>
                                            <div className="col-md-12">
                                                <Label text="Group" />
                                                <Dropdown 
                                                    data={groupList} 
                                                    className="form-control-sm" 
                                                    onChange={handleTextChange} 
                                                    value={templateModel.templateGroup} 
                                                    name="templateGroup" 
                                                    elementKey="code" 
                                                    text="value"
                                                    defaultText='Select Group' 
                                                    defaultValue=''
                                                />
                                                <ErrorLabel message={errors?.templateGroup}></ErrorLabel>
                                            </div>
                                            <div className="col-md-12">
                                                <Label text="Message Body" isRequired={true} />
                                                <textarea
                                                    name="body"
                                                    value={templateModel.body}
                                                    onChange={handleTextChange}
                                                    className="form-control form-control-sm"
                                                    rows={6}
                                                    placeholder="Enter message body. Use {{1}}, {{2}} for variables..."
                                                />
                                                <ErrorLabel message={errors?.body} />
                                                <small className="text-muted">Use {'{{1}}'}, {'{{2}}'}, etc. for variables (e.g., Hello {'{{1}}'}, your order {'{{2}}'} is ready)</small>
                                            </div>
                                            {duplicateVariables.length > 0 && (
                                                <div className="col-md-12">
                                                    <div className="alert alert-warning" role="alert">
                                                        <strong>Warning:</strong> Duplicate variables found: {duplicateVariables.join(', ')}. Each variable should appear only once.
                                                    </div>
                                                </div>
                                            )}
                                            {extractedVariables.length > 0 && (
                                                <div className="col-md-12">
                                                    <Label text="Variable Names" isRequired={true} />
                                                    <div className="card" style={{ backgroundColor: '#f8f9fa', padding: '10px' }}>
                                                        {extractedVariables.map((variable) => (
                                                            <div key={variable.key} className="mb-2">
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <Label text={`${variable.key} -`} fontSize="13px" style={{ minWidth: '60px', margin: 0 }} />
                                                                    <Inputbox
                                                                        labelText="Name"
                                                                        className="form-control-sm"
                                                                        isRequired={true}
                                                                        onChangeHandler={(e) => handleVariableNameChange(variable.key, e.target.value)}
                                                                        name={`variable_${variable.key}`}
                                                                        value={variableNames[variable.key] || ''}
                                                                        errorMessage={errors[`variable_${variable.key}`]}
                                                                        placeholder={`Enter name for ${variable.key}`}
                                                                        style={{ flex: 1 }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="col-md-12">
                                                <Inputbox 
                                                    labelText="Content SID" 
                                                    className="form-control-sm" 
                                                    onChangeHandler={handleTextChange} 
                                                    name="contentSID" 
                                                    value={templateModel.contentSID} 
                                                    errorMessage={errors?.contentSID}
                                                    placeholder="HX1234567890abcdef"
                                                />
                                            </div>
                                            <div className="col-md-12">
                                                <Label text="Media URL" />
                                                <div className="d-flex gap-2 mb-2">
                                                    <Inputbox 
                                                        labelText=""
                                                        className="form-control-sm" 
                                                        onChangeHandler={handleTextChange} 
                                                        name="mediaUrl" 
                                                        value={templateModel.mediaUrl} 
                                                        errorMessage={errors?.mediaUrl}
                                                        placeholder="https://example.com/image.jpg or select from uploaded images"
                                                        style={{ flex: 1 }}
                                                    />
                                                    <div className="d-flex gap-1" style={{ marginTop: '25px' }}>
                                                        <label className="btn btn-sm btn-outline-primary" style={{ cursor: 'pointer', margin: 0 }}>
                                                            <i className="bi bi-upload"></i> Upload
                                                            <input 
                                                                type="file" 
                                                                accept="image/*" 
                                                                onChange={handleImageUpload}
                                                                style={{ display: 'none' }}
                                                                disabled={isUploading}
                                                            />
                                                        </label>
                                                        <button 
                                                            type="button"
                                                            className="btn btn-sm btn-outline-secondary"
                                                            onClick={() => {
                                                                loadUploadedImages();
                                                                setShowImageGallery(!showImageGallery);
                                                            }}
                                                        >
                                                            <i className="bi bi-images"></i> Select
                                                        </button>
                                                    </div>
                                                </div>
                                                {isUploading && (
                                                    <div className="text-info">
                                                        <i className="bi bi-hourglass-split"></i> Uploading image...
                                                    </div>
                                                )}
                                                {showImageGallery && (
                                                    <div className="card mt-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                                        <div className="card-header">
                                                            <strong>Select Uploaded Image</strong>
                                                            <button 
                                                                type="button" 
                                                                className="btn-close float-end" 
                                                                onClick={() => setShowImageGallery(false)}
                                                            ></button>
                                                        </div>
                                                        <div className="card-body">
                                                            {uploadedImages.length === 0 ? (
                                                                <div className="text-center text-muted p-3">No images uploaded yet</div>
                                                            ) : (
                                                                <div className="row g-2">
                                                                    {uploadedImages.map((image) => (
                                                                        <div key={image.id} className="col-4 col-md-3">
                                                                            <div 
                                                                                className={`card ${templateModel.mediaUrl === image.fullUrl ? 'border-primary' : ''}`}
                                                                                style={{ cursor: 'pointer', border: '2px solid' }}
                                                                                onClick={() => handleImageSelect(image)}
                                                                                title="Click to select"
                                                                            >
                                                                                <img 
                                                                                    src={process.env.REACT_APP_API_URL + image.thumbPath} 
                                                                                    alt="Uploaded" 
                                                                                    className="card-img-top" 
                                                                                    style={{ height: '80px', objectFit: 'cover' }}
                                                                                    onError={(e) => {
                                                                                        e.target.src = process.env.REACT_APP_API_URL + image.filePath;
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                {templateModel.mediaUrl && (
                                                    <div className="mt-2">
                                                        <Label text="Preview" fontSize="12px" />
                                                        <img 
                                                            src={templateModel.mediaUrl} 
                                                            alt="Media preview" 
                                                            style={{ maxWidth: '200px', maxHeight: '150px', border: '1px solid #ddd', borderRadius: '4px' }}
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-md-12">
                                                <Label text="Variable Data (JSON)" />
                                                <textarea
                                                    name="variableData"
                                                    value={templateModel.variableData}
                                                    onChange={handleTextChange}
                                                    className="form-control form-control-sm"
                                                    rows={3}
                                                    placeholder='{"variables": [{"key": "{{1}}", "name": "CustomerName"}, {"key": "{{2}}", "name": "OrderNo"}]}'
                                                    readOnly
                                                    style={{ backgroundColor: '#f8f9fa' }}
                                                />
                                                <ErrorLabel message={errors?.variableData} />
                                                <small className="text-muted">This field is auto-generated from variable names above</small>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <ButtonBox type={isRecordSaving ? 'save' : 'update'} onClickHandler={handleSave} className="btn-sm" />
                            <ButtonBox type="cancel" className="btn-sm" modelDismiss={true} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
