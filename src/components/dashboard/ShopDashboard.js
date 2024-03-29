import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Api } from '../../apis/Api';
import { apiUrls } from '../../apis/ApiUrls';
import SalehPieChart from '../../components/common/SalehPieChart'
import { common } from '../../utils/common';
import DashboardCard from './DashboardCard';

export default function ShopDashboard() {
    const [dashboardData, setDashboardData] = useState({customers:0});
    const [accountData, setAccountData] = useState();
    const [expenseData, setExpenseData] = useState({})
    const [orderQty, setOrderQty] = useState({
        activeQty: 0,
        bookingQty: 0,
        cancelledQty: 0,
        completedQty: 0,
        deletedQty: 0,
        deliveredQty: 0,
        orderQty: 0,
        processingQty:0
    });
    useEffect(() => {
        var apis = [];
        apis.push(Api.Get(apiUrls.accountController.getSummarReport + `?fromDate=${common.getHtmlDate(new Date('2000-01-01'))}&toDate=${common.getHtmlDate(new Date())}`))
        apis.push(Api.Get(apiUrls.orderController.getOrdersQty + `?fromDate=${common.getHtmlDate(new Date('2000-01-01'))}&toDate=${common.getHtmlDate(new Date())}`));
        apis.push(Api.Get(apiUrls.dashboardController.getDashboard))
        apis.push(Api.Get(apiUrls.dashboardController.getExpenseDashboard));
        Api.MultiCall(apis)
            .then(res => {
                setAccountData(res[0].data);
                setOrderQty(res[1].data);
                setDashboardData(res[2].data);
                setExpenseData(res[3].data);
            });
    }, []);

    return (
        <>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-4">
              <Link to="/customer-details">  <DashboardCard title="Customers" subtitle="Count" value={dashboardData?.customers} colorClass="bg-gradient-purple" icon="bi-person-badge-fill"></DashboardCard></Link>
              <Link to="/customer-orders">   <DashboardCard title="Orders" subtitle="Qty" value={orderQty?.orderQty} colorClass="bg-gradient-purple" icon="bi-person-badge-fill"></DashboardCard></Link>
                <DashboardCard title="Advance Cash" subtitle="Amount" value={common.printDecimal(accountData?.totalAdvanceCashAmount)} colorClass="bg-gradient-success" icon="bi-coin"></DashboardCard>
                <DashboardCard title="Advance VISA" subtitle="Amount" value={common.printDecimal(accountData?.totalAdvanceVisaAmount)} colorClass="bg-gradient-danger" icon="bi-cash-coin"></DashboardCard>
                <DashboardCard title="Delivery Cash" subtitle="Amount" value={common.printDecimal(accountData?.totalDeliveryCashAmount)} colorClass="bg-gradient-info" icon="bi-bucket"></DashboardCard>
                <DashboardCard title="Delivery VISA" subtitle="Amount" value={common.printDecimal(accountData?.totalDeliveryVisaAmount)} colorClass="bg-gradient-cr1" icon="bi-currency-bitcoin"></DashboardCard>
                <DashboardCard title="Delivered" subtitle="Order" value={orderQty?.deliveredQty} colorClass="bg-gradient-cr3" icon="bi-gift"></DashboardCard>
                <DashboardCard title="Ready" subtitle="For Delivery" value={orderQty?.completedQty} colorClass="bg-gradient-cr2" icon="bi-flower1"></DashboardCard>
                <Link to="/customer-order-cancel">  <DashboardCard title="Cancelled" subtitle="Order" value={`${orderQty?.cancelledQty}`} colorClass="bg-gradient-cr2" icon="bi-x-octagon-fill"></DashboardCard></Link>
                <Link to="/customer-order-delete">  <DashboardCard title="Deleted" subtitle="Order" value={`${orderQty?.deletedQty}`} colorClass="bg-gradient-cr2" icon="bi-trash"></DashboardCard></Link>
                <Link to="/customer-order-pending"> <DashboardCard title="Pending" subtitle="Order" value={orderQty?.activeQty} colorClass="bg-gradient-cr3" icon="bi-flower1"></DashboardCard></Link>
                <DashboardCard title="Processing" subtitle="Order" value={orderQty?.processingQty} colorClass="bg-gradient-cr4" icon="bi-gear-wide"></DashboardCard>
                <Link to="/order-alert?alertBeforeDays=15"> <DashboardCard title="Order Alert" subtitle="Order" value={orderQty?.alertQty ?? 0} colorClass="bg-gradient-cr1" icon="bi-bell"></DashboardCard></Link>
                <Link to="/expense"><DashboardCard title="Expense" subtitle="Amount" value={common.printDecimal(expenseData.expenses)} colorClass="bg-gradient-warning" icon="bi-shop-window"></DashboardCard></Link>

            </div>

        </>)
}
