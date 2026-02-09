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
import DeleteConfirmation from '../tables/DeleteConfirmation';

export default function WhatsAppMessageTemplate() {
    const templateModelTemplate = {
        id: 0,
        contentSID: '',
        body: '',
        templateName: '',
        mediaUrl: '',
        templateCategory: '',
        templateGroup: '',
        variableData: '',
        selectedFileName: '',
        hasMedia: false,
        mediaVariable: ''
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
    const [imageToDelete, setImageToDelete] = useState(null);

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

    const updateMediaProperties = (mediaUrl) => {
        const hasMedia = mediaUrl && mediaUrl.trim() !== '';
        // Only update hasMedia, mediaVariable will be set by user input
        setTemplateModel(prev => ({
            ...prev,
            hasMedia: hasMedia,
            // Clear mediaVariable if media is removed
            mediaVariable: hasMedia ? prev.mediaVariable : ''
        }));
    };

    const handleTextChange = (e) => {
        const { name, value } = e.target;
        setTemplateModel({ ...templateModel, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }

        // Extract variables when body, mediaUrl, or mediaVariable changes
        if (name === 'body' || name === 'mediaUrl' || name === 'mediaVariable') {
            // Extract from body, mediaUrl, and mediaVariable
            const bodyText = name === 'body' ? value : templateModel.body;
            const mediaUrlText = name === 'mediaUrl' ? value : templateModel.mediaUrl;
            const mediaVariableText = name === 'mediaVariable' ? value : templateModel.mediaVariable;
            const vars = extractVariables(bodyText, mediaUrlText, mediaVariableText);
            setExtractedVariables(vars);
            // Initialize variable names if new variables are found
            const newVariableNames = { ...variableNames };
            vars.forEach(v => {
                if (!newVariableNames[v.key]) {
                    newVariableNames[v.key] = '';
                }
            });
            // Remove old variable names that are no longer in body, mediaUrl, or mediaVariable
            Object.keys(newVariableNames).forEach(key => {
                if (!vars.find(v => v.key === key)) {
                    delete newVariableNames[key];
                }
            });
            setVariableNames(newVariableNames);
            // Update variableData
            updateVariableData(vars, newVariableNames);
            // Update media properties if mediaUrl changed
            if (name === 'mediaUrl') {
                updateMediaProperties(value);
            }
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
        
        Api.FileUploadPost(apiUrls.whatsAppMessageQueueController.uploadMedia, formData)
            .then(res => {
                if (res.data) {
                    // Extract only the filename from the response
                    let fileName = res.data.fileName || file.name;
                    if (!fileName) {
                        // If fileName is not available, extract from filePath
                        const filePath = res.data.filePath || res.data.url || res.data;
                        if (filePath) {
                            const pathParts = filePath.split('/');
                            fileName = pathParts[pathParts.length - 1].split('?')[0];
                        }
                    }
                    setTemplateModel(prev => ({ ...prev, mediaUrl: fileName }));
                    // Update media properties
                    updateMediaProperties(fileName);
                    toast.success(toastMessage.saveSuccess || 'Image uploaded successfully');
                    // Reload uploaded images list
                    loadUploadedImages();
                    // Trigger variable extraction for body, mediaUrl, and mediaVariable
                    const bodyText = templateModel.body || '';
                    const mediaVariableText = templateModel.mediaVariable || '';
                    const vars = extractVariables(bodyText, fileName, mediaVariableText);
                    setExtractedVariables(vars);
                }
            })
            .catch(err => {
                toast.error(err?.response?.data?.message || 'Failed to upload image');
            })
            .finally(() => {
                setIsUploading(false);
                setSelectedImageFile(null);
                e.target.value = ''; // Reset file input
            });
    }

    const handleImageSelect = (image) => {
        // Set only the filename as mediaUrl
        const fileName = image.filePath.split('/').pop().split('\\')[1]  ||image.fileName ;
        var model=templateModel;
        model.selectedFileName=image.filePath;
        model.mediaUrl=fileName;
        model.hasMedia=true;
        setTemplateModel(prev => ({ ...prev, ...model }));
        // Update media properties
        updateMediaProperties(fileName);
        setShowImageGallery(false);
        toast.success('Image selected');
        // Trigger variable extraction for body, mediaUrl, and mediaVariable
        const bodyText = templateModel.body || '';
        const mediaVariableText = templateModel.mediaVariable || '';
        const vars = extractVariables(bodyText, fileName, mediaVariableText);
        setExtractedVariables(vars);
    }

    const loadUploadedImages = () => {
        // Load images from WhatsApp media endpoint
        Api.Get(apiUrls.whatsAppMessageQueueController.getMedia)
            .then(res => {
                if (res.data && res.data.length > 0) {
                    const images = res.data.map((img, index) => {
                        const filePath = img.filePath || img.url || img;
                        const fullUrl = filePath;
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
               toast.error(err?.response?.data?.message || 'Failed to load uploaded images');
                setUploadedImages([]);
            });
    }

    const handleDeleteMedia = (image, e) => {
        e.stopPropagation(); // Prevent image selection when clicking delete
        setImageToDelete(image);
    }

    const confirmDeleteMedia = (dataId) => {
        // Use imageToDelete from state (set when delete button is clicked)
        const image = imageToDelete;
        if (!image) {
            return;
        }

        // Extract filename from image object - prefer fileName, otherwise extract from filePath
        let filename = image.fileName;
        if (!filename && image.filePath) {
            // Extract filename from path (handle both URL and file path)
            const pathParts = image.filePath.split('/');
            filename = pathParts[pathParts.length - 1];
            // Remove query parameters if any
            filename = filename.split('?')[0];
        }
        
        if (!filename) {
            toast.error('Filename is required to delete media');
            setImageToDelete(null);
            return;
        }

        Api.Delete(`${apiUrls.whatsAppMessageQueueController.deleteMedia}?filename=${encodeURIComponent(filename)}`)
            .then(res => {
                if (res.data && res.data.success) {
                    toast.success(res.data.message || 'Media deleted successfully');
                    // Reload uploaded images list
                    loadUploadedImages();
                    // If the deleted image was selected, clear the mediaUrl
                    if (templateModel.mediaUrl === image.fileName) {
                        setTemplateModel(prev => ({ ...prev, mediaUrl: '' }));
                        updateMediaProperties('');
                        const bodyText = templateModel.body || '';
                        const vars = extractVariables(bodyText, '');
                        setExtractedVariables(vars);
                    }
                } else {
                    toast.error(res.data?.message || 'Failed to delete media');
                }
            })
            .catch(err => {
                toast.error(err?.response?.data?.message || 'Failed to delete media');
            })
            .finally(() => {
                setImageToDelete(null);
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
                // Extract only filename from mediaUrl if it's a full URL
                let mediaUrl = res.data.mediaUrl || '';
                if (mediaUrl && (mediaUrl.includes('/') || mediaUrl.includes('\\'))) {
                    // Extract filename from path
                    const pathParts = mediaUrl.split(/[/\\]/);
                    mediaUrl = pathParts[pathParts.length - 1].split('?')[0];
                }
                const templateData = { ...res.data, mediaUrl };
                setTemplateModel(templateData);
                // Update media properties
                updateMediaProperties(mediaUrl);
                // Extract variables from body, mediaUrl, and mediaVariable
                const mediaVariable = templateData.mediaVariable || '';
                const vars = extractVariables(templateData.body || '', mediaUrl, mediaVariable);
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
            { name: 'Content SID', prop: 'contentSID' },
            { name: 'Has Media', prop: 'hasMedia' },
            { name: 'Media URL', prop: 'mediaUrl' },
            { name: 'Media Variable', prop: 'mediaVariable' },
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
                                                
                                                {/* Selected Image Preview Section */}
                                                {templateModel.mediaUrl && (() => {
                                                    // Find the matching image by filename for preview
                                                    const selectedImage = uploadedImages.find(img => img.fileName === templateModel.selectedFileName);
                                                    const previewUrl = selectedImage ? (selectedImage.fullUrl || selectedImage.filePath) : templateModel.mediaUrl;
                                                    return (
                                                        <div className="card mb-3" style={{ backgroundColor: '#f8f9fa' }}>
                                                            <div className="card-body p-3">
                                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                                    <Label text="Selected Image Preview" fontSize="14px" style={{ fontWeight: '600', margin: 0 }} />
                                                                    <button 
                                                                        type="button"
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        onClick={() => {
                                                                            setTemplateModel(prev => ({ ...prev, mediaUrl: '' }));
                                                                            updateMediaProperties('');
                                                                            const bodyText = templateModel.body || '';
                                                                            const vars = extractVariables(bodyText, '');
                                                                            setExtractedVariables(vars);
                                                                        }}
                                                                        title="Remove selected image"
                                                                    >
                                                                        <i className="bi bi-x-circle"></i> Remove
                                                                    </button>
                                                                </div>
                                                                <div className="d-flex align-items-center gap-3">
                                                                    {selectedImage && (
                                                                        <img 
                                                                            src={previewUrl} 
                                                                            alt="Media preview" 
                                                                            style={{ 
                                                                                maxWidth: '200px', 
                                                                                maxHeight: '150px', 
                                                                                border: '2px solid #dee2e6', 
                                                                                borderRadius: '8px',
                                                                                objectFit: 'contain',
                                                                                backgroundColor: '#fff',
                                                                                padding: '4px'
                                                                            }}
                                                                            onError={(e) => {
                                                                                e.target.style.display = 'none';
                                                                            }}
                                                                        />
                                                                    )}
                                                                    <div style={{ flex: 1 }}>
                                                                        <small className="text-muted d-block mb-1">
                                                                            <strong>Filename:</strong>
                                                                        </small>
                                                                        <small className="text-break" style={{ 
                                                                            display: 'block', 
                                                                            wordBreak: 'break-all',
                                                                            color: '#495057',
                                                                            fontSize: '12px'
                                                                        }}>
                                                                            {templateModel.mediaUrl}
                                                                        </small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}

                                                {/* Media URL Input Section */}
                                                <div className="mb-3">
                                                    <Inputbox 
                                                        labelText="Media URL (Optional)" 
                                                        className="form-control-sm" 
                                                        onChangeHandler={handleTextChange} 
                                                        name="mediaUrl" 
                                                        value={templateModel.mediaUrl} 
                                                        errorMessage={errors?.mediaUrl}
                                                        placeholder="Enter image URL or use buttons below to upload/select"
                                                    />
                                                    <small className="text-muted">
                                                        You can enter a direct image URL or use the upload/select options below
                                                    </small>
                                                </div>

                                                {/* Media Variable Input - Show when media is available */}
                                                {(templateModel.hasMedia || templateModel.mediaUrl) && (
                                                    <div className="mb-3">
                                                        <Inputbox 
                                                            labelText="Media Variable" 
                                                            className="form-control-sm" 
                                                            onChangeHandler={handleTextChange} 
                                                            name="mediaVariable" 
                                                            value={templateModel.mediaVariable || ''} 
                                                            errorMessage={errors?.mediaVariable}
                                                            placeholder="Enter media variable (e.g., {{3}})"
                                                        />
                                                        <small className="text-muted">
                                                            Enter the variable placeholder for media URL (e.g., {'{{3}}'}, {'{{4}}'})
                                                        </small>
                                                    </div>
                                                )}

                                                {/* Action Buttons */}
                                                <div className="d-flex gap-2 mb-3">
                                                    <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer', margin: 0 }}>
                                                        <i className="bi bi-upload me-1"></i> Upload New Image
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
                                                        className={`btn btn-sm ${showImageGallery ? 'btn-secondary' : 'btn-outline-secondary'}`}
                                                        onClick={() => {
                                                            loadUploadedImages();
                                                            setShowImageGallery(!showImageGallery);
                                                        }}
                                                    >
                                                        <i className="bi bi-images me-1"></i> 
                                                        {showImageGallery ? 'Hide' : 'Browse'} Uploaded Images
                                                        {uploadedImages.length > 0 && (
                                                            <span className="badge bg-light text-dark ms-2">{uploadedImages.length}</span>
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Upload Status */}
                                                {isUploading && (
                                                    <div className="alert alert-info d-flex align-items-center mb-3" role="alert">
                                                        <div className="spinner-border spinner-border-sm me-2" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                        <span>Uploading image, please wait...</span>
                                                    </div>
                                                )}

                                                {/* Image Gallery */}
                                                {showImageGallery && (
                                                    <div className="card border-primary mb-3">
                                                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                                            <strong>
                                                                <i className="bi bi-images me-2"></i>
                                                                Select from Uploaded Images
                                                            </strong>
                                                            <button 
                                                                type="button" 
                                                                className="btn-close btn-close-white" 
                                                                onClick={() => setShowImageGallery(false)}
                                                                aria-label="Close"
                                                            ></button>
                                                        </div>
                                                        <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                                            {uploadedImages.length === 0 ? (
                                                                <div className="text-center text-muted p-4">
                                                                    <i className="bi bi-image" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                                                                    <p className="mt-2 mb-0">No images uploaded yet</p>
                                                                    <small>Use the "Upload New Image" button above to add images</small>
                                                                </div>
                                                            ) : (
                                                                <div className="row g-3">
                                                                    {uploadedImages.map((image) => (
                                                                        <div key={image.id} className="col-6 col-md-4 col-lg-3">
                                                                            <div 
                                                                                className={`card h-100 ${templateModel.mediaUrl === image.fileName ? 'border-primary border-3 shadow-sm' : 'border'}`}
                                                                                style={{ 
                                                                                    cursor: 'pointer', 
                                                                                    transition: 'all 0.2s ease',
                                                                                    backgroundColor: templateModel.mediaUrl === image.fileName ? '#e7f3ff' : '#fff'
                                                                                }}
                                                                                onClick={() => handleImageSelect(image)}
                                                                                onMouseEnter={(e) => {
                                                                                    if (templateModel.mediaUrl !== image.fileName) {
                                                                                        e.currentTarget.style.transform = 'scale(1.02)';
                                                                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                                                                    }
                                                                                }}
                                                                                onMouseLeave={(e) => {
                                                                                    if (templateModel.mediaUrl !== image.fileName) {
                                                                                        e.currentTarget.style.transform = 'scale(1)';
                                                                                        e.currentTarget.style.boxShadow = 'none';
                                                                                    }
                                                                                }}
                                                                                title={templateModel.mediaUrl === image.fileName ? "Currently selected - Click to keep" : "Click to select this image"}
                                                                            >
                                                                                <div className="position-relative">
                                                                                    <img 
                                                                                        src={image.thumbPath || image.filePath} 
                                                                                        alt={image.fileName || "Uploaded"} 
                                                                                        className="card-img-top" 
                                                                                        style={{ 
                                                                                            height: '120px', 
                                                                                            objectFit: 'cover',
                                                                                            width: '100%'
                                                                                        }}
                                                                                        onError={(e) => {
                                                                                            e.target.src = image.filePath;
                                                                                            if (e.target.src === image.filePath) {
                                                                                                e.target.alt = 'Image not available';
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                    <div className="position-absolute top-0 start-0 m-2">
                                                                                        <button
                                                                                            type="button"
                                                                                            className="btn btn-sm btn-danger"
                                                                                            onClick={(e) => handleDeleteMedia(image, e)}
                                                                                            data-bs-toggle="modal"
                                                                                            data-bs-target="#delete-media-confirmation"
                                                                                            title="Delete this image"
                                                                                            style={{
                                                                                                padding: '2px 6px',
                                                                                                fontSize: '12px',
                                                                                                lineHeight: '1.2'
                                                                                            }}
                                                                                        >
                                                                                            <i className="bi bi-trash"></i>
                                                                                        </button>
                                                                                    </div>
                                                                                    {templateModel.mediaUrl === image.fileName && (
                                                                                        <div className="position-absolute top-0 end-0 m-2">
                                                                                            <span className="badge bg-primary">
                                                                                                <i className="bi bi-check-circle-fill"></i> Selected
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                                <div className="card-body p-2">
                                                                                    <small className="text-muted d-block text-truncate" title={image.fileName || image.filePath}>
                                                                                        {image.fileName || 'Image'}
                                                                                    </small>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
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
            <DeleteConfirmation 
                title="Delete Media" 
                message="Are you sure you want to delete this media file?" 
                deleteHandler={confirmDeleteMedia} 
                dataId={imageToDelete?.id || 0} 
                modelId="delete-media-confirmation" 
                buttonText="Delete" 
                cancelButtonText="Cancel" 
            />
        </>
    )
}
