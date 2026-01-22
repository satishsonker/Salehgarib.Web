import { Api } from '../apis/Api';
import { apiUrls } from '../apis/ApiUrls';

/**
 * WhatsApp Message Queue Service
 * Handles all API calls related to WhatsApp Message Queue
 */

/**
 * Get queue messages with optional filters
 * @param {Object} filters - Filter options
 * @param {number} filters.OrderId - Filter by Order ID
 * @param {string} filters.ToNumber - Filter by phone number
 * @param {number} filters.Status - Filter by status (0=Pending, 1=Processing, 2=Sent, 3=Failed)
 * @param {string} filters.FromDate - Filter from date (ISO string)
 * @param {string} filters.ToDate - Filter to date (ISO string)
 * @param {number} filters.PageNo - Page number for pagination
 * @param {number} filters.PageSize - Page size for pagination
 * @returns {Promise} API response
 */
export const getQueueMessages = (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.OrderId) params.append('OrderId', filters.OrderId);
    if (filters.ToNumber) params.append('ToNumber', filters.ToNumber);
    if (filters.Status !== undefined && filters.Status !== null) params.append('Status', filters.Status);
    if (filters.FromDate) params.append('FromDate', filters.FromDate);
    if (filters.ToDate) params.append('ToDate', filters.ToDate);
    if (filters.PageNo) params.append('PageNo', filters.PageNo);
    if (filters.PageSize) params.append('PageSize', filters.PageSize);
    
    const queryString = params.toString();
    const url = queryString ? `${apiUrls.whatsAppMessageQueueController.getQueueMessages}?${queryString}` : apiUrls.whatsAppMessageQueueController.getQueueMessages;
    
    return Api.Get(url);
};

/**
 * Get single message by ID
 * @param {number} id - Message ID
 * @returns {Promise} API response
 */
export const getMessageById = (id) => {
    return Api.Get(`${apiUrls.whatsAppMessageQueueController.getMessageById}${id}`);
};

/**
 * Retry failed messages
 * @param {Array<number>} messageIds - Array of message IDs to retry
 * @returns {Promise} API response
 */
export const retryMessages = (messageIds) => {
    return Api.Post(apiUrls.whatsAppMessageQueueController.retryMessages, {
        MessageIds: messageIds
    });
};

/**
 * Webhook for notifications
 * @param {Object} webhookData - Webhook data
 * @param {number} webhookData.MessageId - Message ID
 * @param {number} webhookData.Status - Status
 * @param {string} webhookData.ErrorMessage - Error message (optional)
 * @param {string} webhookData.ProcessedAt - Processed timestamp (ISO string)
 * @returns {Promise} API response
 */
export const sendWebhook = (webhookData) => {
    return Api.Post(apiUrls.whatsAppMessageQueueController.webhook, webhookData);
};

/**
 * Get queue statistics
 * @returns {Promise} API response with statistics
 */
export const getStatistics = () => {
    return Api.Get(apiUrls.whatsAppMessageQueueController.getStatistics);
};

