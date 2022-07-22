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
        getByMasterDataTypeEnum: `${apiPrfix}/master-data/get/enum`,
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
        jobExpert: {
            add: `${apiPrfix}/job-expert`,
            update: `${apiPrfix}/job-expert`,
            delete: `${apiPrfix}/job-expert/`,
            search: `${apiPrfix}/job-expert/search`,
            get: `${apiPrfix}/job-expert/get/`,
            getAll: `${apiPrfix}/job-expert`
        }
    }
}