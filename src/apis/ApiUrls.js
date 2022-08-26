const apiPrfix = "api";
export const apiUrls = {
    authController: {
        token: `${apiPrfix}/user/token/login`
    },
    customerController: {
        add: `${apiPrfix}/customers`,
        update: `${apiPrfix}/customers`,
        delete: `${apiPrfix}/customers/`,
        get: `${apiPrfix}/customers/get/`,
        getAll: `${apiPrfix}/customers`,
        search: `${apiPrfix}/customers/search`,
    },
    employeeController: {
        add: `${apiPrfix}/employees`,
        update: `${apiPrfix}/employees`,
        delete: `${apiPrfix}/employees/`,
        get: `${apiPrfix}/employees/get/`,
        getAll: `${apiPrfix}/employees`,
        search: `${apiPrfix}/employees/search`,
    },
    productController: {
        add: `${apiPrfix}/product`,
        update: `${apiPrfix}/product`,
        delete: `${apiPrfix}/product/`,
        get: `${apiPrfix}/product/get/`,
        getAll: `${apiPrfix}/product`,
        search: `${apiPrfix}/product/search`,
    },
    supplierController: {
        add: `${apiPrfix}/suppliers`,
        update: `${apiPrfix}/suppliers`,
        delete: `${apiPrfix}/suppliers/`,
        get: `${apiPrfix}/suppliers/get/`,
        getAll: `${apiPrfix}/suppliers`,
        search: `${apiPrfix}/suppliers/search`,
    },
    monthlyAttendenceController: {
        add: `${apiPrfix}/monthly-attendence`,
        update: `${apiPrfix}/monthly-attendence`,
        delete: `${apiPrfix}/monthly-attendence/`,
        get: `${apiPrfix}/monthly-attendence/get/`,
        getAll: `${apiPrfix}/monthly-attendence`,
        search: `${apiPrfix}/monthly-attendence/search`,
        getByEmpId: `${apiPrfix}/monthly-attendence/get/emp/`,
        getByEmpIdMonthYear: `${apiPrfix}/monthly-attendence/get/emp-month-year/`,
        addUpdateDailyAttendence: `${apiPrfix}/daily-attendence`,
        getDailyAttendence: `${apiPrfix}/get/daily-attendence`,
    },
    dropdownController: {
        jobTitle: `${apiPrfix}/dropdown/job-titles`,
        experies: `${apiPrfix}/dropdown/experties`,
        employee: `${apiPrfix}/dropdown/employees`,
        customerOrders: `${apiPrfix}/dropdown/customer-orders`,
        customers: `${apiPrfix}/dropdown/customers`,
        products: `${apiPrfix}/dropdown/products`,
        suppliers: `${apiPrfix}/dropdown/suppliers`,
        designCategory: `${apiPrfix}/dropdown/design-category`
    },
    masterDataController: {
        add: `${apiPrfix}/master-data`,
        update: `${apiPrfix}/master-data`,
        delete: `${apiPrfix}/master-data/`,
        get: `${apiPrfix}/master-data/get/`,
        getAll: `${apiPrfix}/master-data`,
        search: `${apiPrfix}/master-data/search`,
        getByMasterDataType: `${apiPrfix}/master-data/get/by-type`,
        getByMasterDataTypes: `${apiPrfix}/master-data/get/by-types`,
        addDataType: `${apiPrfix}/master-data-type`,
        updateDataType: `${apiPrfix}/master-data-type`,
        deleteDataType: `${apiPrfix}/master-data-type/`,
        getDataType: `${apiPrfix}/master-data-type/get/`,
        getAllDataType: `${apiPrfix}/master-data-type`,
        searchDataType: `${apiPrfix}/master-data-type/search`,
    },
    masterController: {
        designCategory: {
            add: `${apiPrfix}/design-category`,
            update: `${apiPrfix}/design-category`,
            delete: `${apiPrfix}/design-category/`,
            search: `${apiPrfix}/design-category/search`,
            get: `${apiPrfix}/design-category/get/`,
            getAll: `${apiPrfix}/design-category`
        },
        designSample: {
            add: `${apiPrfix}/design-sample`,
            update: `${apiPrfix}/design-sample`,
            delete: `${apiPrfix}/design-sample/`,
            search: `${apiPrfix}/design-sample/search`,
            get: `${apiPrfix}/design-sample/get/`,
            getAll: `${apiPrfix}/design-sample`,
            getByDesignCategory: `${apiPrfix}/design-sample/get/category/`
        },
        jobTitle: {
            add: `${apiPrfix}/job-title`,
            update: `${apiPrfix}/job-title`,
            delete: `${apiPrfix}/job-title/`,
            search: `${apiPrfix}/job-title/search`,
            get: `${apiPrfix}/job-title/get/`,
            getAll: `${apiPrfix}/job-title`
        }
    },
    orderController:{
        add: `${apiPrfix}/orders`,
        update: `${apiPrfix}/orders`,
        delete: `${apiPrfix}/orders/`,
        get: `${apiPrfix}/orders/get/`,
        getAll: `${apiPrfix}/orders`,
        search: `${apiPrfix}/orders/search`,
        searchCancelledOrders: `${apiPrfix}/orders/search/cancelled-orders`, 
        searchDeletedOrders: `${apiPrfix}/orders/search/deleted-orders`,

        searchByCustomer: `${apiPrfix}/orders/search/by-customer`,
        searchBySalesman: `${apiPrfix}/orders/search/by-salesman`,
        searchBySalesmanAndDateRange: `${apiPrfix}/orders/search/by-salesman/`, 
        getBySalesmanAndDateRange:`${apiPrfix}/orders/get/by-salesman/`,

        getOrderNo:`${apiPrfix}/orders/get/order-no`,
        cancelOrder: `${apiPrfix}/orders/cancel/order`,
        cancelOrderDetail: `${apiPrfix}/orders/cancel/order-detail`,
        getPreviousAmount:`${apiPrfix}/orders/get/previous-amount`,
        getCustomerMeasurement:`${apiPrfix}/orders/get/customer-measurement`,
        getCancelledOrder:`${apiPrfix}/orders/get/cancelled-orders`,
        getDeletedOrder:`${apiPrfix}/orders/get/deleted-orders`,
        getByCustomer:`${apiPrfix}/orders/get/by-customer`,
        getBySalesman:`${apiPrfix}/orders/get/by-salesman`,
        getByDeliveryDate:`${apiPrfix}/orders/get/delivery-date/`,
        getByOrderNumber:`${apiPrfix}/orders/get/order-nos`,
        getOrderDetails:`${apiPrfix}/orders/get/order-details`,
    },
    purchaseEntryController:{
        add: `${apiPrfix}/purchase-entry`,
        update: `${apiPrfix}/purchase-entry`,
        delete: `${apiPrfix}/purchase-entry/`,
        get: `${apiPrfix}/purchase-entry/get/`,
        getAll: `${apiPrfix}/purchase-entry`,
        search: `${apiPrfix}/purchase-entry/search`,
        getPurchaseNo:`${apiPrfix}/purchase-entry/get/purchase-no`,
    }
}