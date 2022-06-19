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
    }
}