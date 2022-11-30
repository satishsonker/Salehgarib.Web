import { common } from "./common";

// const replaceWorkTypeWithCode = (row, header) => {
//     let workTypeCodes = "";
//     let workType = common.defaultIfEmpty(row[header.prop], "").toLowerCase();
//     if (workType.indexOf('designing') > -1)
//         workTypeCodes += "1";
//     if (workType.indexOf('cutting') > -1)
//         workTypeCodes += "2";
//     if (workType.indexOf('machine') > -1)
//         workTypeCodes += "3";
//     if (workType.indexOf('crystal') > -1)
//         workTypeCodes += "4";
//     if (workType.indexOf('hand') > -1)
//         workTypeCodes += "5";
//     if (workType.indexOf('hot') > -1 || workType.indexOf('stitch') > -1)
//         workTypeCodes += "6";
//     if (workType.indexOf('apliq') > -1)
//         workTypeCodes += "7";
//     return workTypeCodes;
// }

const customDayColumn = (data, header) => {
    let totalDaysOfMonth = common.daysInMonth(data['month'], data['year']);
    let currentColumnDay = parseInt(header.prop.replace('day', ''));
    currentColumnDay = isNaN(currentColumnDay) ? 0 : currentColumnDay;
    if (currentColumnDay > totalDaysOfMonth)
        return <></>
        if(data[header.prop]===0)
        {
          return  <div><i className="bi bi-person-x-fill text-danger fs-4"></i></div>
        }
        if(data[header.prop]===1)
        {
          return  <div><i className="bi bi-person-x-fill text-success fs-4"></i></div>
        }
        if(data[header.prop]===2 || data[header.prop]===3)
        {
          return  <div><i className="bi bi-person-x-fill text-warning fs-4"></i></div>
        }
}

const headerFormat = {
    order: [
        { name: "Order No", prop: "orderNo" },
        { name: "Qty", prop: "qty",customColumn:(rowData,Header)=>rowData.qty===null ||rowData.qty===undefined ?rowData.orderDetails.lenght:rowData.qty },
        { name: "Customer Name", prop: "customerName",action:{upperCase:true} },
        { name: "Contact", prop: "contact1" },
        { name: "Salesname", prop: "salesman" },
        { name: "Order Date", prop: "orderDate" },
        { name: "Order Delivery Date", prop: "orderDeliveryDate" },
        { name: "Sub Total", prop: "subTotalAmount", action: { decimal: true } },
        { name: "VAT 5%", prop: "vatAmount", action: { decimal: true } },
        { name: "Total", prop: "totalAmount", action: { decimal: true } },
        { name: "Advance", prop: "advanceAmount", action: { decimal: true } },
        { name: "Balance", prop: "balanceAmount", action: { decimal: true } },
        { name: "Payment Mode", prop: "paymentMode" },
        { name: "Order Status", prop: "status" },
        { name: "Deleted/Cancelled/Updated By", prop: "updatedBy" },
        { name: "Deleted/Cancelled/Updated  On", prop: "updatedAt" },
        { name: "Deleted/Cancelled/Updated  Note", prop: "note" },
    ],
    orderDetails: [
        { name: "Order No", prop: "orderNo" },
        { name: "Order Delivery Date", prop: "orderDeliveryDate" },
        { name: "Category", prop: "designCategory" },
        { name: "Model", prop: "designModel" },
        { name: "Customer Name", prop: "measurementCustomerName" },
        { name: "Description", prop: "description" },
        { name: "Work Type", prop: "workType" },
        { name: "Order Status", prop: "orderStatus" },
        { name: "Measurement Status", prop: "measurementStatus" },
        { name: "Crystal", prop: "crystal" },
        { name: "Price", prop: "price" },
        { name: "Sub Total Amount", prop: "subTotalAmount" },
        { name: "VAT Amount 5%", prop: "vatAmount" },
        { name: "Total Amount", prop: "totalAmount",action:{decimal:true} },
        { name: "Status", prop: "status" },
        { name: "Cancelled/Updated by", prop: "updatedBy" },
        { name: "Cancelled/Updated On", prop: "updatedAt" },
        { name: "Cancel/Update Note", prop: "note" },
    ],
    employeeDetails:[
        { name: 'First Name', prop: 'firstName' },
        { name: 'Last Name', prop: 'lastName' },
        { name: 'Contact', prop: 'contact' },
        { name: 'Contact 2', prop: 'contact2' },
        { name: 'Email', prop: 'email' },
        { name: 'Job Name', prop: 'jobTitle' },
        { name: 'Role', prop: 'role' },
        { name: 'Fixed Employee', prop: 'isFixedEmployee', action: { replace: { true: "Yes", false: "No" } } },
        { name: 'Hire Date', prop: 'hireDate' },
        { name: 'Labour ID', prop: 'labourId' },
        { name: 'Labour ID Expire', prop: 'labourIdExpire' },
        { name: 'Passport Number', prop: 'passportNumber' },
        { name: 'Passport Expiry Date', prop: 'passportExpiryDate' },
        { name: 'WorkPermit ID', prop: 'workPermitID' },
        { name: 'Work Permit Expire', prop: 'workPEDate' },
        { name: 'Resident Permit Expire', prop: 'residentPDExpire' },
        { name: 'Basic Salary', prop: 'basicSalary', action: { decimal: true } },
        { name: 'Accomodation', prop: 'accomodation', action: { decimal: true } },
        { name: 'Salary', prop: 'salary', action: { decimal: true } },
        { name: 'Medical Expire', prop: 'medicalExpiryDate' },
        { name: 'Address', prop: 'address' },
        { name: 'Country', prop: 'country' }
    ],
    monthlyAttendence:[
        { name: "Employee Name", prop: "employeeName" },
        { name: "Basic Salary", prop: "basicSalary", customColumn: (dataRow, headerRow) => { return dataRow.employee[headerRow.prop] }, action: { decimal: true } },
        { name: "Accomdation", prop: "accomodation", customColumn: (dataRow, headerRow) => { return dataRow.employee[headerRow.prop] }, action: { decimal: true } },
        { name: "Monthly Salary", prop: "month_Salary", customColumn: (dataRow, headerRow) => { return dataRow.employee.basicSalary + dataRow.employee.accomodation }, action: { decimal: true } },
        { name: "Advance", prop: "advance", action: { decimal: true } },
        { name: "Month", prop: "month" },
        { name: "Year", prop: "year" },
        { name: "Total Working Day", prop: "workingDays"},
        { name: "Total Present", prop: "present"},
        { name: "Total Absent", prop: "absent"},
        { name: "Salary/Day", prop: "perDaySalary", action: { decimal: true },title:"Per Day Salary" },
        { name: "Total Deduction", prop: "totalDeduction", action: { decimal: true }},
        { name: "Total Salary", prop: "netSalary", action: { decimal: true }, title: "Total Salary = Monthly Salary - Advance - (Per day Salary x No. of Absents)" },
        { name: "Day 1", prop: "day1", customColumn: customDayColumn },
        { name: "Day 2", prop: "day2", customColumn: customDayColumn },
        { name: "Day 3", prop: "day3", customColumn: customDayColumn },
        { name: "Day 4", prop: "day4", customColumn: customDayColumn },
        { name: "Day 5", prop: "day5", customColumn: customDayColumn },
        { name: "Day 6", prop: "day6", customColumn: customDayColumn },
        { name: "Day 7", prop: "day7", customColumn: customDayColumn },
        { name: "Day 8", prop: "day8", customColumn: customDayColumn },
        { name: "Day 9", prop: "day9", customColumn: customDayColumn },
        { name: "Day 10", prop: "day10", customColumn: customDayColumn },
        { name: "Day 11", prop: "day11", customColumn: customDayColumn },
        { name: "Day 12", prop: "day12", customColumn: customDayColumn },
        { name: "Day 13", prop: "day13", customColumn: customDayColumn },
        { name: "Day 14", prop: "day14", customColumn: customDayColumn },
        { name: "Day 15", prop: "day15", customColumn: customDayColumn },
        { name: "Day 16", prop: "day16", customColumn: customDayColumn },
        { name: "Day 17", prop: "day17", customColumn: customDayColumn },
        { name: "Day 18", prop: "day18", customColumn: customDayColumn },
        { name: "Day 19", prop: "day19", customColumn: customDayColumn },
        { name: "Day 20", prop: "day20", customColumn: customDayColumn },
        { name: "Day 21", prop: "day21", customColumn: customDayColumn },
        { name: "Day 22", prop: "day22", customColumn: customDayColumn },
        { name: "Day 23", prop: "day23", customColumn: customDayColumn },
        { name: "Day 24", prop: "day24", customColumn: customDayColumn },
        { name: "Day 25", prop: "day25", customColumn: customDayColumn },
        { name: "Day 26", prop: "day26", customColumn: customDayColumn },
        { name: "Day 27", prop: "day27", customColumn: customDayColumn },
        { name: "Day 28", prop: "day28", customColumn: customDayColumn },
        { name: "Day 29", prop: "day29", customColumn: customDayColumn },
        { name: "Day 30", prop: "day30", customColumn: customDayColumn },
        { name: "Day 31", prop: "day31", customColumn: customDayColumn },
    ]
}

export { headerFormat };