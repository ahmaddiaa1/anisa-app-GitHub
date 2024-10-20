import Heading from "../ui/Heading";
import Row from "../ui/Row";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import OrderTable from "../features/order/OrderTable.tsx";
import OrderTableOperations from "../features/order/OrderTableOperations.tsx";
import { useGetOrders } from "../hooks/orders/useGetOrders.ts";
import AddOrder from "../features/order/AddOrder.tsx";

function Order() {
  const [searchParams] = useSearchParams();
  const querySearch = searchParams.get("id") || "";
  const [search, setSearch] = useState(querySearch ?? "");
  const sortBy = searchParams.get("sortBy") || "createdAt-desc";
  const filter = searchParams.get("status") || "all";
  const { orders, isPending, count } = useGetOrders(search, sortBy, filter);

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Orders</Heading>
        <OrderTableOperations setSearch={setSearch} />
      </Row>

      <Row>
        <OrderTable orders={orders} isPending={isPending} count={count} />
        <AddOrder />
      </Row>
    </>
  );
}

export default Order;
