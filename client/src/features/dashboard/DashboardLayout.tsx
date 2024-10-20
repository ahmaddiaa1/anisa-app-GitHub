import styled from "styled-components";
import Spinner from "../../ui/Spinner.tsx";
import Stats from "./stats.tsx";

import SalesChart from "./SalesChart.tsx";
import DurationChart from "./DurationChart.tsx";
import TodayActivity from "../check-in-out/TodayActivity.tsx";
import { useGetAllOrders } from "../../hooks/orders/useGetAllOrders.ts";
import { useGetAllOrderCategories } from "../../hooks/useGetAllOrderCategories.ts";
import { useAllAuditLogs } from "../../services/apiAuditLog.ts";
import AnisaDashboardTable from "./DashboardAnisaTable.tsx";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

const DashboardLayout = () => {
  const { orders, isPending: isFetching, numDays } = useGetAllOrders();
  const { orderCategories, isPending } = useGetAllOrderCategories();
  const { auditLogs, isPending: isPending2 } = useAllAuditLogs();

  if (isFetching || isPending || isPending2) return <Spinner />;

  return (
    <StyledDashboardLayout>
      <Stats Orders={orders} />
      <TodayActivity logs={auditLogs} />
      <DurationChart orderCategories={orderCategories} />
      <SalesChart orders={orders} numDays={numDays} />
      <AnisaDashboardTable />
    </StyledDashboardLayout>
  );
};

export default DashboardLayout;
