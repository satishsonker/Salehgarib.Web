const validationMessage = {
    companyNameRequired: "Please enter company name!",
    locationNameRequired: "Please enter/select location name!",
    categoryNameRequired: "Please enter category name!",
    categoryRequired: "Please select category name!",
    nameRequired: "Please enter name!",
    rentAmountRequired:'Please enter rent amount!',
    chequeNoRequired:'Please enter cheque number!',
    chequeDateRequired:'Please select cheque date!',
    invalidChequeNo:'Please enter correct cheque number!',
    rentInstallmentRequired:'Please select rent installment!',
    rentInstallmentDateRequired:'Please select rent installment Date!',
    installmentDateRequired:'Please select installment Date!',
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
    monthRequired:"Please select month!",
    yearRequired:"Please select year!",
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
    empStatusRequired: "Please select employee Status!",
    empCompanyRequired: "Please select employee's company!",
    userRoleRequired: "Please select the user role!",
    kandooraHeadRequired: "Please enter kandoora expense head name!",
    kandooraRequired: "Please select kandoora number!",
    displayOrderRequired: "Please enter kandoora expense head display order!",
    emirateIdRequired:'Please enter emirates id!',
    emiratesIDExpireDateRequired:'Please enter emirates id expiry date!',
    workPermitExpireDateRequired:'Please select work permit expiry date!',
    passportExpireDateRequired:'Please select passport expiry date!',
    currentPasswordRequired:'Please enter current password!',
    newPasswordRequired:'Please enter new password!',
    newPasswordLengthError:'New password should be 8 charactor long!',
    ConfirmPasswordError:'New password and confirm new password should be same!',
    basicSalaryRequired: "Please enter basic salary!",
    salaryRequired: "Please enter salary!",
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
    paymentAmountRequired:"Please enter payment amount!",
    advanceAmountRequired:"Advance amount is required!",
    advanceDateRequired:"Advance date is required!",
    emiStartMonthRequired:"EMI start month is required!",
    emiStartYearRequired:"EMI start year is required!",
    emiStartMonthError:"EMI should be next month or later",
    advancePaymentReasonRequired:"Reason is required!",
    balanceQtyRequired:"Balance qty is required!",
    invalidCrystalQuantity:'Crystal qauntity is invalid!',
    invalidVAT:'VAT can not be zero!',
    invalidSubTotal:'Sub total amount can not be zero!',
    invalidTotalAmount:'Total amount can not be zero!',
    bookingTypeRequired:'Please select booking type!',
    invalidModel:'Please select model!',
    noOrderDetailsError:'Please add atleast one order details!',
    paymentModeRequired:"Please select payment mode!",
    reasonRequired:"Please enter update/delete reason!",
    fromDateRequired:"Please select from date!",
    toDateRequired:"Please select to date!",
    cancelDateRequired:"Please select cancel date!",
    completedOnDateRequired:"Please select completedOn date!",    
    completedByRequired:"Please select completed by employee name!",
    salesmanRequired:"Please select salesman!",
    orderStatusRequired:"Please select order status!",
    invalidOrderNo:'Please enter valid order number!',
    measurementStatusRequired:"Please select measurement status!",
    deliveryDateRequired:"Please select date of delivery!",
    orderDateRequired:"Please select order date!",
    orderDeliveryDateRequired:"Please select order delivery date!",
    orderDateInFutureError:"Order date can't be in future date!",
    orderDeliveryDateLessThanOrderDateError:"Order delivery date can't be less than order date!",
    orderNoRequired:"Please select order number!",
    purchaseEntryDetailsRequired:"Please add atleast one item!",
    expanseNameRequired:"Please enter/select expanse name!",
    expanseTypeRequired:"Please enter/select expanse type!",
    expanseAmountRequired:"Please enter expanse amount!",
    extraAmountRequired:"Please enter extra amount!",
    expanseDateRequired:"Please select expanse date!",
    paymentDateRequired:"Please select payment date!",
    futureDateIsNotAllowed:"Future date is not allowed!",
    orderFutureDateIsNotAllowed:"Order date should not be future date!",
    workTypeRequired:'Please select work type!',
    workDescriptionRequired:'Please enter/select work description!',
    crystalNameRequired:'Please enter crystal name!',
    crystalSizeRequired:'Please select crystal size!',
    crystalShapeRequired:'Please select crystal shape!',
    crystalPricePerPacketRequired:'Please enter crystal per packet price!',
    crystalBrandRequired:'Please select crystal brand!',
    crystalRequired:'Please select crystal!',
    crystalAlertQtyRequired:'Please enter crystal alert qty!',
    crystalQtyPerPacketRequired:'Please enter crystal peice per packet!',
    crystalReleaseDateRequired:'Please select crystal issue date!',
    crystalReturnDateRequired:'Please select crystal return date!',
    crystalReturnQtyRequired:'Please select crystal return qty!',
    crystalReleaseQtyRequired:'Please enter crystal issue qty!',
    returnQtyIsMoreThanReleaseQtyError:`Return qty can't more than release qty!`,
    alterDateRequired:`Please select alter date!`,
    returnPiecesMoreThanReleasePieceError:`Return pieces can't more than release pieces!`,
    departRequired: "Please select depart name!",
    userNameRequired: "Please enter username!",
    userNameAlreadyExist: "Username is already exist!",
    passwordRequired: "Please enter password!",
    wrongCredentials: "Wrong username/password",
    passwordLengthRequired: "Please enter min 8 char password!",
    oldPasswordRequired: "Please enter old password!",
    confirmPasswordRequired: "Please enter confirm password!",
    confirmPasswordNotMatched: "Password and confirm password does not matched!",
    paidByRequired:'please select paid by',
    alterCrystalNotAllowed:`You can not add crystal for alter work with out normal work crystal.`,
}

export { validationMessage }