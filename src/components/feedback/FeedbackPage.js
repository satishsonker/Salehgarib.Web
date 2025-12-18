import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import { toast } from 'react-toastify';
import StarRating from './StarRating';
import useAppSettings from '../../hooks/useApplicationSettings';
import { common } from '../../utils/common';
import Label from '../common/Label';
import ButtonBox from '../common/ButtonBox';
import ErrorLabel from '../common/ErrorLabel';

export default function FeedbackPage() {
    const { uniqueCode } = useParams();
    const applicationSettings = useAppSettings();
    const companyName = common.defaultIfEmpty(applicationSettings?.en_companyname?.value, process.env.REACT_APP_COMPANY_NAME);
    const companySubName = common.defaultIfEmpty(applicationSettings?.en_companysubname?.value, process.env.REACT_APP_COMPANY_SUBNAME);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [feedbackData, setFeedbackData] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    const [ratings, setRatings] = useState({
        overallRating: null,
        fittingRating: null,
        stitchingRating: null,
        embroideryRating: null,
        designingRating: null,
        appliqueRating: null
    });

    const [comment, setComment] = useState('');

    useEffect(() => {
        if (uniqueCode) {
            fetchFeedbackData();
        } else {
            toast.error('Invalid feedback link');
            setLoading(false);
        }
    }, [uniqueCode]);

    const fetchFeedbackData = async () => {
        try {
            setLoading(true);
            const response = await Api.Get(apiUrls.feedbackController.getFeedbackByUniqueCode + uniqueCode);
            
            if (response.status === 200) {
                const data = response.data;
                
                if (data.isSubmitted) {
                    setIsSubmitted(true);
                    toast.info(data.message || 'Feedback already submitted!');
                } else if (data.feedback) {
                    setFeedbackData(data.feedback);
                    setOrderData(data.feedback.order);
                    
                    // Set existing ratings if any
                    if (data.feedback.overallRating) {
                        setRatings(prev => ({
                            ...prev,
                            overallRating: data.feedback.overallRating,
                            fittingRating: data.feedback.fittingRating,
                            stitchingRating: data.feedback.stitchingRating,
                            embroideryRating: data.feedback.embroideryRating,
                            designingRating: data.feedback.designingRating,
                            appliqueRating: data.feedback.appliqueRating
                        }));
                        setComment(data.feedback.comment || '');
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching feedback:', error);
            if (error.response?.status === 400) {
                toast.error(error.response.data?.message || 'Feedback does not exist!');
            } else {
                toast.error('Failed to load feedback data');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRatingChange = (ratingType, value) => {
        setRatings(prev => ({
            ...prev,
            [ratingType]: value
        }));
        // Clear error for this rating
        if (errors[ratingType]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[ratingType];
                return newErrors;
            });
        }
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const validateForm = () => {
        const newErrors = {};
        
        // At least overallRating is required
        if (!ratings.overallRating) {
            newErrors.overallRating = 'Overall rating is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error('Please provide at least an overall rating');
            return;
        }

        try {
            setSubmitting(true);
            const submitData = {
                uniqueCode: uniqueCode,
                overallRating: ratings.overallRating,
                fittingRating: ratings.fittingRating,
                stitchingRating: ratings.stitchingRating,
                embroideryRating: ratings.embroideryRating,
                designingRating: ratings.designingRating,
                appliqueRating: ratings.appliqueRating,
                comment: comment || null
            };

            const response = await Api.Post(apiUrls.feedbackController.submitFeedback, submitData);
            
            if (response.status === 200) {
                toast.success('Thank you for your feedback!');
                setIsSubmitted(true);
                setFeedbackData(response.data);
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            if (error.response?.status === 400) {
                const errorData = error.response.data;
                if (errorData.errors) {
                    setErrors(errorData.errors);
                }
                toast.error(errorData.message || 'Failed to submit feedback');
            } else {
                toast.error('Failed to submit feedback. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return common.getHtmlDate(date, 'ddmmyyyy');
        } catch {
            return dateString;
        }
    };

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return '0.00';
        return common.printDecimal(amount);
    };

    if (loading) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#f8f9fa'
            }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                backgroundColor: '#f8f9fa',
                padding: '20px'
            }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <div className="card shadow-sm">
                        <div className="card-body text-center" style={{ padding: '40px 20px' }}>
                            <div style={{ fontSize: '48px', color: '#28a745', marginBottom: '20px' }}>
                                <i className="bi bi-check-circle-fill"></i>
                            </div>
                            <h2 style={{ color: '#28a745', marginBottom: '15px' }}>Thank You!</h2>
                            <p style={{ fontSize: '16px', color: '#6c757d', marginBottom: '30px' }}>
                                Your feedback has been submitted successfully. We appreciate your time and valuable input.
                            </p>
                            {feedbackData && (
                                <div style={{ 
                                    backgroundColor: '#f8f9fa', 
                                    padding: '20px', 
                                    borderRadius: '8px',
                                    marginTop: '20px',
                                    textAlign: 'left'
                                }}>
                                    <h5 style={{ marginBottom: '15px' }}>Your Feedback Summary</h5>
                                    {feedbackData.overallRating && (
                                        <p><strong>Overall Rating:</strong> {feedbackData.overallRating}/10</p>
                                    )}
                                    {feedbackData.comment && (
                                        <p><strong>Comment:</strong> {feedbackData.comment}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundColor: '#f8f9fa',
            padding: '20px 10px'
        }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                {/* Company Name Header */}
                <div className="text-center mb-4">
                    <h1 style={{ 
                        fontSize: 'clamp(24px, 5vw, 32px)',
                        fontWeight: 'bold',
                        color: '#212529',
                        marginBottom: '5px'
                    }}>
                        {companyName}
                    </h1>
                    {companySubName && (
                        <p style={{ 
                            fontSize: 'clamp(14px, 3vw, 18px)',
                            color: '#6c757d',
                            marginBottom: '0'
                        }}>
                            {companySubName}
                        </p>
                    )}
                    <hr style={{ marginTop: '20px', marginBottom: '20px' }} />
                </div>

                {/* Order Details Card */}
                {orderData && (
                    <div className="card shadow-sm mb-4">
                        <div className="card-header" style={{ backgroundColor: '#007bff', color: 'white' }}>
                            <h5 className="mb-0" style={{ fontSize: '18px' }}>
                                <i className="bi bi-receipt me-2"></i>Order Details
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-6 col-12">
                                    <Label text="Order Number" fontSize="13px" bold={true} />
                                    <p style={{ fontSize: '14px', marginTop: '5px' }}>{orderData.orderNo || 'N/A'}</p>
                                </div>
                                <div className="col-md-6 col-12">
                                    <Label text="Order Date" fontSize="13px" bold={true} />
                                    <p style={{ fontSize: '14px', marginTop: '5px' }}>{formatDate(orderData.orderDate)}</p>
                                </div>
                                <div className="col-md-6 col-12">
                                    <Label text="Delivery Date" fontSize="13px" bold={true} />
                                    <p style={{ fontSize: '14px', marginTop: '5px' }}>{formatDate(orderData.orderDeliveryDate)}</p>
                                </div>
                                <div className="col-md-6 col-12">
                                    <Label text="Status" fontSize="13px" bold={true} />
                                    <p style={{ fontSize: '14px', marginTop: '5px' }}>{orderData.status || 'N/A'}</p>
                                </div>
                                <div className="col-md-6 col-12">
                                    <Label text="Total Amount" fontSize="13px" bold={true} />
                                    <p style={{ fontSize: '14px', marginTop: '5px' }}>{formatCurrency(orderData.totalAmount)} AED</p>
                                </div>
                                <div className="col-md-6 col-12">
                                    <Label text="Advance Amount" fontSize="13px" bold={true} />
                                    <p style={{ fontSize: '14px', marginTop: '5px' }}>{formatCurrency(orderData.advanceAmount)} AED</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Feedback Form Card */}
                <div className="card shadow-sm">
                    <div className="card-header" style={{ backgroundColor: '#28a745', color: 'white' }}>
                        <h5 className="mb-0" style={{ fontSize: '18px' }}>
                            <i className="bi bi-star-fill me-2"></i>Please Share Your Feedback
                        </h5>
                    </div>
                    <div className="card-body" style={{ padding: '30px 20px' }}>
                        <form>
                            {/* Overall Rating */}
                            <div className="mb-4">
                                <StarRating
                                    value={ratings.overallRating}
                                    onChange={(value) => handleRatingChange('overallRating', value)}
                                    maxStars={10}
                                    label="Overall Rating *"
                                />
                                {errors.overallRating && (
                                    <ErrorLabel message={errors.overallRating} />
                                )}
                            </div>

                            {/* Fitting Rating */}
                            <div className="mb-4">
                                <StarRating
                                    value={ratings.fittingRating}
                                    onChange={(value) => handleRatingChange('fittingRating', value)}
                                    maxStars={10}
                                    label="Fitting Rating"
                                />
                            </div>

                            {/* Stitching Rating */}
                            <div className="mb-4">
                                <StarRating
                                    value={ratings.stitchingRating}
                                    onChange={(value) => handleRatingChange('stitchingRating', value)}
                                    maxStars={10}
                                    label="Stitching Rating"
                                />
                            </div>

                            {/* Embroidery Rating */}
                            <div className="mb-4">
                                <StarRating
                                    value={ratings.embroideryRating}
                                    onChange={(value) => handleRatingChange('embroideryRating', value)}
                                    maxStars={10}
                                    label="Embroidery Rating"
                                />
                            </div>

                            {/* Designing Rating */}
                            <div className="mb-4">
                                <StarRating
                                    value={ratings.designingRating}
                                    onChange={(value) => handleRatingChange('designingRating', value)}
                                    maxStars={10}
                                    label="Designing Rating"
                                />
                            </div>

                            {/* Applique Rating */}
                            <div className="mb-4">
                                <StarRating
                                    value={ratings.appliqueRating}
                                    onChange={(value) => handleRatingChange('appliqueRating', value)}
                                    maxStars={10}
                                    label="Applique Rating"
                                />
                            </div>

                            {/* Comment Section */}
                            <div className="mb-4">
                                <Label text="Additional Comments" fontSize="14px" />
                                <textarea
                                    name="comment"
                                    value={comment}
                                    onChange={handleCommentChange}
                                    className="form-control"
                                    rows={5}
                                    placeholder="Please share any additional comments or suggestions..."
                                    style={{ 
                                        width: '100%', 
                                        resize: 'vertical',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="text-center mt-4">
                                <ButtonBox
                                    type="save"
                                    text="Submit Feedback"
                                    onClickHandler={handleSubmit}
                                    disabled={submitting}
                                    className="btn-lg"
                                    style={{ 
                                        minWidth: '200px',
                                        padding: '12px 30px',
                                        fontSize: '16px'
                                    }}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

