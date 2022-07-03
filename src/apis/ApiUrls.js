const apiPrfix = "api";
export const apiUrls = {
    "authController": {
        "token": `${apiPrfix}/user/token/login`
    },
    "customerController":{
        "add":`${apiPrfix}/customers`,
        "update":`${apiPrfix}/customers`,
        "delete":`${apiPrfix}/customers/`,
        "get":`${apiPrfix}/customers/get/`,
        "getAll":`${apiPrfix}/customers`,
        "search":`${apiPrfix}/customers/search`,
    },
    "employeeController":{
        "add":`${apiPrfix}/employees`,
        "update":`${apiPrfix}/employees`,
        "delete":`${apiPrfix}/employees/`,
        "get":`${apiPrfix}/employees/get/`,
        "getAll":`${apiPrfix}/employees`,
        "search":`${apiPrfix}/employees/search`,
    },
    "productController":{
        "add":`${apiPrfix}/product`,
        "update":`${apiPrfix}/product`,
        "delete":`${apiPrfix}/product/`,
        "get":`${apiPrfix}/product/get/`,
        "getAll":`${apiPrfix}/product`,
        "search":`${apiPrfix}/product/search`,
    },
    "supplierController":{
        "add":`${apiPrfix}/suppliers`,
        "update":`${apiPrfix}/suppliers`,
        "delete":`${apiPrfix}/suppliers/`,
        "get":`${apiPrfix}/suppliers/get/`,
        "getAll":`${apiPrfix}/suppliers`,
        "search":`${apiPrfix}/suppliers/search`,
    },
    "dropdownController":{
        "jobTitle":`${apiPrfix}/dropdown/job-titles`,
        "experies":`${apiPrfix}/dropdown/experties`,
        "employee":`${apiPrfix}/dropdown/employees`,
        "customerOrders":`${apiPrfix}/dropdown/customer-orders`,
        "customers":`${apiPrfix}/dropdown/customers`,
        "products":`${apiPrfix}/dropdown/products`,
        "suppliers":`${apiPrfix}/dropdown/suppliers`
    }
}