const validationMessage = {
    companyNameRequired: "Please enter company name!",
    locationNameRequired: "Please enter/select location name!",
    categoryNameRequired: "Please enter category name!",
    categoryRequired: "Please select category name!",
    nameRequired: "Please enter name!",
    rentAmountRequired:'Please enter rent amount!',
    chequeNoRequired:'Please enter cheque number!',
    invalidChequeNo:'Please enter correct cheque number!',
    rentInstallmentRequired:'Please select rent installment!',
    rentInstallmentDateRequired:'Please select rent installment Date!',
    masterDataTypeRequired: "Please select master data type!",
    masterDataRequired: "Please enter master data!",
    holidayYearRequired: "Please select holiday year!",
    holidayDateRequired: "Please select holiday date!",
    holidayNameRequired: "Please enter/select holiday name!",
    holidayTypeRequired: "Please enter/select holiday type!",
    productTypeRequired: "Please enter/select product type!",
    masterDataCodeRequired: "Please enter master data code!",
    invoiceNoRequired: "Please enter invoice number!",
    invoiceDateRequired: "Please select invoice date!",
    purchaseNoRequired: "Purchase no. is required!",
    trnRequired: "Please enter TRN number!",
    fileRequired: "Please select file!",
    allowedFileExtension: "Allowed file extension are .jpg, .jpeg, .png!",
    allowedFileSize: `Maximum Allowed file size is ${process.env.REACT_APP_ALLOWED_FILE_SIZE}!`,
    modelRequired: "Please enter model!",
    designerNameRequired: "Please select designer name!",
    customerRequired: "Please select customer!",
    designShapeRequired: "Please select design shape!",
    designSizeRequired: "Please enter design size!",
    contactRequired:"Please enter contact Number!",
    employeeRequired:"Please select employee!",
    brandRequired:"Please select brand!",
    itemRequired:"Please select item!",
    productRequired:"Please select product!",
    fabricSizeRequired:"Please select fabric size!",
    titleRequired: "Please enter title!",
    cityRequired: "Please enter city!",
    addressRequired: "Please enter address!",
    invalidContact: "Invalid contact number!",
    productNameRequired: "Please enter product name!",
    supplierRequired: "Please select the supplier!",
    unitPriceRequired: "Please enter unit price!",
    firstNameRequired: "Please enter first name!",
    paidAmountRequired: "Please enter paid amount!",
    dueAmountError: "Due amount should not be less than zero!",
    lastNameRequired: "Please enter last name!",
    jobTitleRequired: "Please select the job title!",
    userRoleRequired: "Please select the user role!",
    kandooraHeadRequired: "Please enter kandoora expense head name!",
    displayOrderRequired: "Please enter kandoora expense head display order!",
    labourIdRequired:'Please enter labour id!',
    labourIdExpireDateRequired:'Please enter labour id expire date!',
    workPermitExpireDateRequired:'Please select work permit expire date!',
    passportExpireDateRequired:'Please select passport expire date!',
    currentPasswordRequired:'Please enter current password!',
    newPasswordRequired:'Please enter new password!',
    newPasswordLengthError:'New password should be 8 charactor long!',
    ConfirmPasswordError:'New password and confirm new password should be same!',
    basicSalaryRequired: "Please enter basic salary!",
    monthlySalaryRequired: "Please enter monthly salary!",
    totalSalaryRequired: "Please enter total salary!",
    netSalaryRequired: "Please enter net salary!",
    passportNumberRequired:"Please enter passport number!",
    passportExpiryDateInvalid:"Passport expiry date is invalid, should be greater than current date!",
    workPermitIdRequired:"Please enter work permit id/number!",
    workPermitExpiryDateInvalid:"Work Permit expiry date is invalid, should be greater than current date!",
    maxCharAllowed:(maxLength)=>`Maximum ${maxLength} charector allowed!`,
    salesPriceLessThanCostPrice:"Sales price should be greater than cost price!",
    priceRequired:'Please enter price!',
    quantityRequired:'Please enter quantity!',
    advanceMoreThanTotalError:"Advance Amount can not be more that total amount!",
    advanceAmountRequired:"Advance amount is required!",
    emiStartMonthRequired:"EMI start month is required!",
    emiStartYearRequired:"EMI start year is required!",
    emiStartMonthError:"EMI should be next month or later",
    reasonRequired:"Reason is required!",
    invalidCrystalQuantity:'Crystal qauntity is invalid!',
    invalidVAT:'VAT can not be zero!',
    invalidSubTotal:'Sub total amount can not be zero!',
    invalidTotalAmount:'Total amount can not be zero!',
    invalidModel:'Please select model!',
    noOrderDetailsError:'Please add atleast one order details!',
    paymentModeRequired:"Please select payment mode!",
    fromDateRequired:"Please select from date",
    toDateRequired:"Please select to date",
    salesmanRequired:"Please select salesman!",
    orderStatusRequired:"Please select order status!",
    measurementStatusRequired:"Please select measurement status!",
    deliveryDateRequired:"Please select date of delivery!",
    orderDateRequired:"Please select order date!",
    purchaseEntryDetailsRequired:"Please add atleast one item!",
    crystalSizeRequired:"Please select crystal size!",
    crystalShapeRequired:"Please select shape size!",
    expanseNameRequired:"Please enter/select expanse name!",
    expanseTypeRequired:"Please enter/select expanse type!",
    expanseAmountRequired:"Please enter expanse amount!",
    expanseNameRequired:"Please enter expanse name!"
}

export { validationMessage }