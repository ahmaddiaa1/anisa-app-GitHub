// import { useAuditLogs } from "../../services/apiAuditLog";
import Empty from "../../ui/Empty";
import Menus from "../../ui/Menus";
import Table from "../../ui/Table";
import Pagination from "../../ui/Pagination.tsx";
import Spinner from "../../ui/Spinner.tsx";
import OrderRow from "./OrderRow.tsx";
// import { useSearchParams } from "react-router-dom";

import { Order } from "../../types/ordersTypes.ts";

const OrderTable = ({
  orders,
  isPending,
  count,
}: {
  orders: Order[];
  isPending: boolean;
  count: number;
}) => {
  //   const [searchParams] = useSearchParams();
  //   const filterValue = searchParams.get("action") || "all";
  //   const sortBy = searchParams.get("sortBy") || "createdAt-desc";

  if (isPending) return <Spinner />;
  return (
    <Menus>
      <Table columns="2fr 1.1fr 2fr 1fr 1fr 1fr 0.5fr">
        <Table.Header>
          <div>Participants</div>
          <div>Setting</div>
          <div>Dates</div>
          <div>status</div>
          <div>unitPrice</div>
          <div>CreatedAt</div>
          <div></div>
        </Table.Header>
        {!orders?.length ? (
          <Empty resourceName="Orders" />
        ) : (
          <Table.Body
            data={orders}
            render={(order: Order) => (
              <OrderRow key={order.id} orders={order} />
            )}
          />
        )}
        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
};
export default OrderTable;
