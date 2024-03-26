const apiPrfix = "api";
export const apiUrls = {
    accountController: {
        getSummarReport: `${apiPrfix}/account/get/summary-report`,
        getEmpSalaryPayList:`${apiPrfix}/account/get/emp/salary/pay/`,
        addEmpSalaryPay:`${apiPrfix}/account/emp/salary/pay`,
    },
    permissionController: {
        getPermissions: `${apiPrfix}/permission?roleId=`,
        getPermissionResource: `${apiPrfix}/permission/resource`,
        getRole: `${apiPrfix}/permission/roles`,
        updatePermissions: `${apiPrfix}/permission`,
        getPermissionByRoleName: `${apiPrfix}/permission/role/`,
    },
    expenseController: {
        addExpense: `${apiPrfix}/expense`,
        updateExpense: `${apiPrfix}/expense`,
        deleteExpense: `${apiPrfix}/expense/`,
        getExpense: `${apiPrfix}/expense/get/`,
        getExpenseNo: `${apiPrfix}/expense/get/expense-no`, 
        getExpenseHeadWiseSum: `${apiPrfix}/expense/get/head-wise-sum?`,
        getExpensePaymodeWiseSum: `${apiPrfix}/expense/get/paymode-wise-sum?`,
        getAllExpense: `${apiPrfix}/expense`,
        searchExpense: `${apiPrfix}/expense/search`,
        addExpenseType: `${apiPrfix}/expense/type`,
        updateExpenseType: `${apiPrfix}/expense/type`,
        deleteExpenseType: `${apiPrfix}/expense/type/`,
        getExpenseType: `${apiPrfix}/expense/type/get/`,
        getAllExpenseType: `${apiPrfix}/expense/type`,
        searchExpenseType: `${apiPrfix}/expense/type/search`,
        addExpenseName: `${apiPrfix}/expense/name`,
        updateExpenseName: `${apiPrfix}/expense/name`,
        deleteExpenseName: `${apiPrfix}/expense/name/`,
        getExpenseName: `${apiPrfix}/expense/name/get/`,
        getAllExpenseName: `${apiPrfix}/expense/name`,
        searchExpenseName: `${apiPrfix}/expense/name/search`,
        addExpenseCompany: `${apiPrfix}/expense/company`,
        updateExpenseCompany: `${apiPrfix}/expense/company`,
        deleteExpenseCompany: `${apiPrfix}/expense/company/`,
        getExpenseCompany: `${apiPrfix}/expense/company/get/`,
        getAllExpenseCompany: `${apiPrfix}/expense/company`,
        searchExpenseCompany: `${apiPrfix}/expense/company/search`
    },
    authController: {
        token: `${apiPrfix}/user/token/login`,
        changePassword: `${apiPrfix}/user/password`,
        getUsers: `${apiPrfix}/users`,
    },
    dashboardController: {
        getDashboard: `${apiPrfix}/dashboard`,
        getWeeklySale: `${apiPrfix}/dashboard/get/weekly-sales`,
        getMonthlySale: `${apiPrfix}/dashboard/get/monthly-sales`,
        getDailySale: `${apiPrfix}/dashboard/get/daily-sales`,
        getEmpDashboard: `${apiPrfix}/dashboard/get/employee`,
        getOrderDashboard: `${apiPrfix}/dashboard/get/order`,
        getExpenseDashboard: `${apiPrfix}/dashboard/get/expense`,
        getCrystalDashboard: `${apiPrfix}/dashboard/get/crystal`,
    },
    customerController: {
        add: `${apiPrfix}/customers`,
        update: `${apiPrfix}/customers`,
        delete: `${apiPrfix}/customers/`,
        get: `${apiPrfix}/customers/get/`,
        getAll: `${apiPrfix}/customers`,
        getByContactNo: `${apiPrfix}/customers/get/by-contact/`,
        getOneCustomerByContactNo: `${apiPrfix}/customers/get/one/by-contact`,
        search: `${apiPrfix}/customers/search`,
        getStatement: `${apiPrfix}/customers/get/statement?contactNo=`,
        addAdvancePayment: `${apiPrfix}/customers/add/advance-amount`
    },
    employeeController: {
        add: `${apiPrfix}/employees`,
        update: `${apiPrfix}/employees`,
        delete: `${apiPrfix}/employees/`,
        get: `${apiPrfix}/employees/get/`,
        getAll: `${apiPrfix}/employees`,
        search: `${apiPrfix}/employees/search`,
        searchAll: `${apiPrfix}/employees/search/all?searchTearm=`,
        alert: `${apiPrfix}/employees/send/alert/`,
        getAlert:`${apiPrfix}/employees/get/alert`,
        getAllActiveDeactiveEmp: `${apiPrfix}/employees/get/active-emp`,
        ActiveDeactiveEmp: `${apiPrfix}/employees/update/active-emp`,
        payMonthlySalary: `${apiPrfix}/employees/update/pay-salary/`,
        getEmployeeSalarySlip: `${apiPrfix}/employees/get/salary-slip`,
        getEmployeeSalaryOfYear: `${apiPrfix}/employees/get/salary/year/`,
        getEmployeeSalaryLedger: `${apiPrfix}/employees/get/salary-ledger`,
        getEmployeeByStatus: `${apiPrfix}/employees/get/by/status?status=`,
        getEmployeeByStatus: `${apiPrfix}/employees/get/by/status?status=`,
        markEmployeeStatusCancel: `${apiPrfix}/employees/update/mark/cancel/`,
    },
    employeeAdvancePaymentController: {
        add: `${apiPrfix}/employee-advance-payment`,
        update: `${apiPrfix}/employee-advance-payment`,
        delete: `${apiPrfix}/employee-advance-payment/`,
        get: `${apiPrfix}/employee-advance-payment/get/`,
        getAll: `${apiPrfix}/employee-advance-payment`,
        search: `${apiPrfix}/employee-advance-payment/search`,
        getStatement: `${apiPrfix}/employee-advance-payment/statement/`
    },
    productController: {
        add: `${apiPrfix}/product`,
        update: `${apiPrfix}/product`,
        delete: `${apiPrfix}/product/`,
        get: `${apiPrfix}/product/get/`,
        getAll: `${apiPrfix}/product`,
        search: `${apiPrfix}/product/search`,
        addType: `${apiPrfix}/product-type`,
        updateType: `${apiPrfix}/product-type`,
        deleteType: `${apiPrfix}/product-type/`,
        getType: `${apiPrfix}/product-type/get/`,
        getAllType: `${apiPrfix}/product-type`,
        searchType: `${apiPrfix}/product-type/search`,
    },
    supplierController: {
        add: `${apiPrfix}/suppliers`,
        update: `${apiPrfix}/suppliers`,
        delete: `${apiPrfix}/suppliers/`,
        get: `${apiPrfix}/suppliers/get/`,
        getAll: `${apiPrfix}/suppliers`,
        search: `${apiPrfix}/suppliers/search`,
    },
    holidayController: {
        addHoliday: `${apiPrfix}/holidays`,
        updateHoliday: `${apiPrfix}/holidays`,
        deleteHoliday: `${apiPrfix}/holidays/`,
        getHoliday: `${apiPrfix}/holidays/get/`,
        isHoliday: `${apiPrfix}/holidays/get/is-holiday`,
        getHolidayByDate: `${apiPrfix}/holidays/get/by-date`,
        getHolidayByMonthYear: `${apiPrfix}/holidays/get/by-month-year/`,
        getAllHoliday: `${apiPrfix}/holidays`,
        searchHoliday: `${apiPrfix}/holidays/search`,
        addHolidayName: `${apiPrfix}/holidays/name`,
        updateHolidayName: `${apiPrfix}/holidays/name`,
        deleteHolidayName: `${apiPrfix}/holidays/name/`,
        getHolidayName: `${apiPrfix}/holidays/name/get/`,
        getAllHolidayName: `${apiPrfix}/holidays/name`,
        searchHolidayName: `${apiPrfix}/holidays/name/search`,
        addHolidayType: `${apiPrfix}/holidays/type`,
        updateHolidayType: `${apiPrfix}/holidays/type`,
        deleteHolidayType: `${apiPrfix}/holidays/type/`,
        getHolidayType: `${apiPrfix}/holidays/type/get/`,
        getAllHolidayType: `${apiPrfix}/holidays/type`,
        searchHolidayType: `${apiPrfix}/holidays/type/search`
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
        getByMonthYear: `${apiPrfix}/monthly-attendence/get/month-year/`,
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
        designCategory: `${apiPrfix}/dropdown/design-category`,
        orderDetailNos: `${apiPrfix}/dropdown/order-detail-nos`,
        workTypes: `${apiPrfix}/dropdown/work-types`
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
        },
        kandooraHead: {
            add: `${apiPrfix}/master-data/kandoora/head`,
            update: `${apiPrfix}/master-data/kandoora/head`,
            delete: `${apiPrfix}/master-data/kandoora/head/`,
            search: `${apiPrfix}/master-data/kandoora/head/search`,
            get: `${apiPrfix}/master-data/kandoora/head/get/`,
            getAll: `${apiPrfix}/master-data/kandoora/head`
        },
        kandooraExpense: {
            add: `${apiPrfix}/master-data/kandoora/expense`,
            getAllExpenseSum: `${apiPrfix}/master-data/kandoora/expense/get/sum`,
            getAll: `${apiPrfix}/master-data/kandoora/expense`
        }
    },
    orderController: {
        add: `${apiPrfix}/orders`,
        update: `${apiPrfix}/orders`,
        delete: `${apiPrfix}/orders/`,
        get: `${apiPrfix}/orders/get/`,
        getAll: `${apiPrfix}/orders`,
        search: `${apiPrfix}/orders/search`,
        searchCancelledOrders: `${apiPrfix}/orders/search/cancelled-orders`,
        searchDeletedOrders: `${apiPrfix}/orders/search/deleted-orders`,
        searchPendingOrders: `${apiPrfix}/orders/search/pending-orders`,
        searchWithFilterOrders: `${apiPrfix}/orders/search/filter`,
        searchByCustomer: `${apiPrfix}/orders/search/by-customer`,
        searchBySalesman: `${apiPrfix}/orders/search/by-salesman`,
        searchBySalesmanAndDateRange: `${apiPrfix}/orders/search/by-salesman/`,
        getBySalesmanAndDateRange: `${apiPrfix}/orders/get/by-salesman/`,
        searchOrderByDeliveryDate: `${apiPrfix}/orders/search/delivery-date`,
        getUsedModalByContact:`${apiPrfix}/orders/get/modal-no/contact?contactNo=`,
        getOrderNo: `${apiPrfix}/orders/get/order-no`,
        cancelOrder: `${apiPrfix}/orders/cancel/order`,
        cancelOrderDetail: `${apiPrfix}/orders/cancel/order-detail`,
        getPreviousAmount: `${apiPrfix}/orders/get/previous-amount`,
        getCustomerMeasurement: `${apiPrfix}/orders/get/customer-measurement`,
        getCustomerMeasurements: `${apiPrfix}/orders/get/customer-measurements`,
        getCancelledOrder: `${apiPrfix}/orders/get/cancelled-orders`,
        getDeletedOrder: `${apiPrfix}/orders/get/deleted-orders`,
        getPendingOrder: `${apiPrfix}/orders/get/pending-orders`,
        getByCustomer: `${apiPrfix}/orders/get/by-customer`,
        getBySalesman: `${apiPrfix}/orders/get/by-salesman`,
        getByDeliveryDate: `${apiPrfix}/orders/get/delivery-date/`,
        getByOrderNumber: `${apiPrfix}/orders/get/order-nos`,
        getByOrderNoByContact: `${apiPrfix}/orders/get/order-no/contact?contactNo=`,
        getOrderDetails: `${apiPrfix}/orders/get/order-details`,
        getOrderAlert: `${apiPrfix}/orders/get/order-alerts?AlertBeforeDays=`,
        searchAlert: `${apiPrfix}/orders/search/alert?`,
        updateMeasurement: `${apiPrfix}/orders/update/measurement`,
        updateDeliveryPayment: `${apiPrfix}/orders/update/delivery-payment`,
        updateDesignModel: `${apiPrfix}/orders/update/design-model/`,
        updateModelNo: `${apiPrfix}/orders/update/model-no?orderDetailId=`,
        updateOrderDate: `${apiPrfix}/orders/update/order-date/`,
        getCustomerPaymentForOrder: `${apiPrfix}/orders/get/customer/payment?orderId=`,
        getSampleCountInPreOrder: `${apiPrfix}/orders/get/sample/count?customerId=`,
        getAdvancePaymentStatement: `${apiPrfix}/orders/get/customer/payment/statement?orderId=`,
        getOrdersQty: `${apiPrfix}/orders/get/order-qty`,
        getByWorkType: `${apiPrfix}/orders/detail/get/by/work-type?workType=`,
        searchByWorkType: `${apiPrfix}/orders/detail/search/by/work-type?workType=`,
        getOrderStatusList: `${apiPrfix}/orders/get/status/list`,
        editOrder: `${apiPrfix}/orders/update/edit`,
        updateCustomerStatement: `${apiPrfix}/orders/update/customer/statement`,
        getOrderDetailById: `${apiPrfix}/orders/detail/get/`,
    },
    purchaseEntryController: {
        add: `${apiPrfix}/purchase-entry`,
        update: `${apiPrfix}/purchase-entry`,
        delete: `${apiPrfix}/purchase-entry/`,
        get: `${apiPrfix}/purchase-entry/get/`,
        getAll: `${apiPrfix}/purchase-entry`,
        search: `${apiPrfix}/purchase-entry/search`,
        getPurchaseNo: `${apiPrfix}/purchase-entry/get/purchase-no`,
    },
    workTypeStatusController: {
        update: `${apiPrfix}/work-type-status`,
        get: `${apiPrfix}/work-type-status`,
        getByOrderId: `${apiPrfix}/work-type-status/get/by/order-id?orderId=`,
        getSumAmount: `${apiPrfix}/work-type-status/get/sum-amount`,
        updateExisting: `${apiPrfix}/work-type-status/update/existing?orderDetailId=`,
        updateNote: `${apiPrfix}/work-type-status/update/existing/note/`,
        addUpdateCrystalAlterRecord: `${apiPrfix}/work-type-status/update/crystal/alter`
    },
    fileStorageController: {
        uploadFile: `${apiPrfix}/file-upload`,
        deleteFile: `${apiPrfix}/file-storage/`,
        missingKandooraImages:`${apiPrfix}/file-storage/kandoora/missing/image?`,
        searchMissingKandooraImages:`${apiPrfix}/file-storage/kandoora/search/missing/image?`,
        getFileByModuleIdsAndName: `${apiPrfix}/file-storage/module-ids/`,
    },
    rentController: {
        addLocation: `${apiPrfix}/rent/location`,
        updateLocation: `${apiPrfix}/rent/location`,
        deleteLocation: `${apiPrfix}/rent/location/`,
        getLocation: `${apiPrfix}/rent/location/get/`,
        getAllLocation: `${apiPrfix}/rent/location`,
        searchLocation: `${apiPrfix}/rent/location/search`,

        addDetail: `${apiPrfix}/rent/detail`,
        updateDetail: `${apiPrfix}/rent/detail`,
        deleteDetail: `${apiPrfix}/rent/detail/`,
        getDetail: `${apiPrfix}/rent/detail/get/`,
        getAllDetail: `${apiPrfix}/rent/detail`,
        searchDetail: `${apiPrfix}/rent/detail/search`,
        getRentTransaction: `${apiPrfix}/rent/detail/transaction`,
        getDueRents: `${apiPrfix}/rent/detail/transaction/get/due-rent`,
        searchDeuRents: `${apiPrfix}/rent/detail/transaction/search/deu-rent`,
        payDeuRents: `${apiPrfix}/rent/detail/transaction/pay/deu-rent`,
    },
    reportController: {
        getWorkerPerformance: `${apiPrfix}/report/worker/performance?workType=`,
        getDailyStatusReport: `${apiPrfix}/report/order/daily-status-report?date=`,
        getBillingTaxReport: `${apiPrfix}/report/order/bill-tax-report`,
        getKandooraExpReport: `${apiPrfix}/report/order/eack-kandoora-exp-report?`,
        getBillingCancelTaxReport: `${apiPrfix}/report/order/bill-cancel-tax-report`,
        getPaymentSummaryReport: `${apiPrfix}/report/order/payment-summary`,
        searchKandooraExpReport: `${apiPrfix}/report/order/search/eack-kandoora-exp-report`,
        getDailyWorkStatement:`${apiPrfix}/report/order/daily-work-statement-report?`,
        searchDailyWorkStatement:`${apiPrfix}/report/order/search/daily-work-statement-report?`,
        getDailyCrystalWorkStatement:`${apiPrfix}/report/order/crystal/daily-work-statement-report?`,
        searchDailyCrystalWorkStatement:`${apiPrfix}/report/order/crystal/search/daily-work-statement-report?`
    },
    stockController: {
        getCrystal: `${apiPrfix}/stock/get/crystal`,
        getUsedCrystal: `${apiPrfix}/stock/get/order-used-crystal?orderDetailId=`,
        saveUsedCrystal: `${apiPrfix}/stock/save/order-used-crystal`,
    },
    workDescriptionController: {
        addWorkDescription: `${apiPrfix}/work-description`,
        updateWorkDescription: `${apiPrfix}/work-description`,
        deleteWorkDescription: `${apiPrfix}/work-description/`,
        getWorkDescription: `${apiPrfix}/work-description/get/`,
        getAllWorkDescription: `${apiPrfix}/work-description`,
        searchWorkDescription: `${apiPrfix}/work-description/search`,
        getByWorkTypes: `${apiPrfix}/work-description/get/work-type?workType=`,
        saveOrderWorkDescription: `${apiPrfix}/work-description/order/save`,
        getOrderWorkDescription: `${apiPrfix}/work-description/order/get?orderDetailId=`
    },
    crystalController: {
        addMasterCrystal: `${apiPrfix}/crystal/master`,
        updateMasterCrystal: `${apiPrfix}/crystal/master`,
        deleteMasterCrystal: `${apiPrfix}/crystal/master/`,
        getMasterCrystal: `${apiPrfix}/crystal/master/get/`,
        getAllMasterCrystal: `${apiPrfix}/crystal/master`,
        searchMasterCrystal: `${apiPrfix}/crystal/master/search`,
        getNextCrytalId: `${apiPrfix}/crystal/master/get/crystal-id`,
    },
    crystalPurchaseController: {
        addCrystalPurchase: `${apiPrfix}/crystal/purchase`,
        deleteCrystalPurchase: `${apiPrfix}/crystal/purchase/`,
        getCrystalPurchaseNo: `${apiPrfix}/crystal/purchase/get/number`,
        getAllCrystalPurchase: `${apiPrfix}/crystal/purchase`,
        searchCrystalPurchase: `${apiPrfix}/crystal/purchase/search`,
        getCrystalStockAlert: `${apiPrfix}/crystal/stock/get/alert`,
        getCrystalStockDetail: `${apiPrfix}/crystal/stock/get/details`,
        searchCrystalStockDetail: `${apiPrfix}/crystal/stock/search/detail`,
        searchCrystalStockAlert: `${apiPrfix}/crystal/stock/search/alert`,
        updateCrystalStock: `${apiPrfix}/crystal/stock`,
        getCrystalStockDetailById: `${apiPrfix}/crystal/stock/get/`,
    },
    crytalTrackingController:{
        addTrackingOut:`${apiPrfix}/crystal/track/out`,
        addTrackingOutNote:`${apiPrfix}/crystal/track/out/add/note`,
        getAllTrackingOut:`${apiPrfix}/crystal/track/out`,
        deleteTrackingOut:`${apiPrfix}/crystal/track/out/`,
        deleteTrackingOutDetail:`${apiPrfix}/crystal/track/out/detail/`,
        getTrackingOutById:`${apiPrfix}/crystal/track/out/get/`,
        getTrackingOutByOrderDetailId:`${apiPrfix}/crystal/track/out/get/order-detail-no/`,
        getTrackingOutByOrderDetailByCrystalId:`${apiPrfix}/crystal/track/out/get/order-detail-no/range/`, 
        getCrystalStockConsumedDetail:`${apiPrfix}/crystal/Track/out/get/consumed-details`,
        searchTrackingOut:`${apiPrfix}/crystal/track/out/search`,
        updateTrackingOutReturn:`${apiPrfix}/crystal/track/out/update/return`,
        updateCompletedDateAndEmp:`${apiPrfix}/crystal/track/out/update/emp/completedon`,
    },
    masterAccessController:{
        addMasterAccess: `${apiPrfix}/master/access`,
        updateMasterAccess: `${apiPrfix}/master/access`,
        deleteMasterAccess: `${apiPrfix}/master/access/`,
        getMasterAccess: `${apiPrfix}/master/access/get/`,
        getAllMasterAccess: `${apiPrfix}/master/access`,
        searchMasterAccess: `${apiPrfix}/master/access/search`,
        checkUsername: `${apiPrfix}/master/access/exist/username`,
        changePassword: `${apiPrfix}/master/access/change/password`,
        getMenus: `${apiPrfix}/master/access/get/menu`,
        loginMasetrAccess: `${apiPrfix}/master/access/get/login`,
    },
    fabricMasterController:{
        brand:{
             addBrand:`${apiPrfix}/fabric/brand`,
             updateBrand:`${apiPrfix}/fabric/brand`,
             getAllBrand:`${apiPrfix}/fabric/brand`,
             deleteBrand:`${apiPrfix}/fabric/brand/`,
             getBrand:`${apiPrfix}/fabric/brand/get/`,
             searchBrand:`${apiPrfix}/fabric/brand/search`
        },
        type:{
            addType:`${apiPrfix}/fabric/type`,
            updateType:`${apiPrfix}/fabric/type`,
            getAllType:`${apiPrfix}/fabric/type`,
            deleteType:`${apiPrfix}/fabric/type/`,
            getType:`${apiPrfix}/fabric/type/get/`,
            searchType:`${apiPrfix}/fabric/type/search`
        },
        subType:{
            addSubType:`${apiPrfix}/fabric/subType`,
            updateSubType:`${apiPrfix}/fabric/subType`,
            getAllSubType:`${apiPrfix}/fabric/subType`,
            deleteSubType:`${apiPrfix}/fabric/subType/`,
            getSubType:`${apiPrfix}/fabric/subType/get/`,
            searchSubType:`${apiPrfix}/fabric/subType/search`
        },
        size:{
            addSize:`${apiPrfix}/fabric/size`,
            updateSize:`${apiPrfix}/fabric/size`,
            getAllSize:`${apiPrfix}/fabric/size`,
            deleteSize:`${apiPrfix}/fabric/size/`,
            getSize:`${apiPrfix}/fabric/size/get/`,
            searchSize:`${apiPrfix}/fabric/size/search`,
        },
        fabric:{
            addFabric:`${apiPrfix}/fabric`,
            updateFabric:`${apiPrfix}/fabric`,
            getAllFabric:`${apiPrfix}/fabric`,
            deleteFabric:`${apiPrfix}/fabric/`,
            getFabric:`${apiPrfix}/fabric/get/`,
            searchFabric:`${apiPrfix}/fabric/search`
        }
    },
    fabricStockController:{
             updateStock:`${apiPrfix}/fabric/stock`,
             getAllStock:`${apiPrfix}/fabric/stock`,
             getStock:`${apiPrfix}/fabric/stock/`,
             searchStock:`${apiPrfix}/fabric/stock/search`,
             searchLowStock:`${apiPrfix}/fabric/stock/search/low`,
             lowStock:`${apiPrfix}/fabric/stock/low`
    },
    fabricPurchaseController:{
        getPurchaseNo:`${apiPrfix}/fabric/purchase/get/purchase/no`,
        addPurchase:`${apiPrfix}/fabric/purchase`,
        updatePurchase:`${apiPrfix}/fabric/purchase`,
        searchPurchase:`${apiPrfix}/fabric/purchase/search/`,
        deletePurchase:`${apiPrfix}/fabric/purchase/delete/`,
        cancelPurchase:`${apiPrfix}/fabric/purchase/cancel/`,
        cancelPurchaseDetail:`${apiPrfix}/fabric/purchase/cancel/detail`,
        getAllPurchase:`${apiPrfix}/fabric/purchase`,
        getPurchaseById:`${apiPrfix}/fabric/purchase`
    }
}