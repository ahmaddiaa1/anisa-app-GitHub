import Empty from "../../ui/Empty";
import Menus from "../../ui/Menus";
import Table from "../../ui/Table";

import Pagination from "../../ui/Pagination.tsx";
import Spinner from "../../ui/Spinner.tsx";
import { useSearchParams } from "react-router-dom";
import CategoryRow from "./CategoryRow.tsx";
import { useGetOrderCategorys } from "../../hooks/useGetOrderCategory.ts";
import { OrderCategory } from "../../types/ordersTypes.ts";

const OrderCategoryTable = () => {
  const [searchParams] = useSearchParams();
  const filterValue = searchParams.get("isActive") || "all";
  const sortBy = searchParams.get("sortBy") || "createdAt-desc";
  const { orderCategory, isLoading, count } = useGetOrderCategorys(
    filterValue,
    sortBy
  );

  if (isLoading) return <Spinner />;

  return (
    <Menus>
      <Table columns="1.5fr 1fr 1fr 1fr 1fr 1fr 0.5fr">
        <Table.Header>
          <div>Title</div>
          <div>Type</div>
          <div>Status</div>
          <div>Hours</div>
          <div>Price</div>
          <div>CreatedAt</div>
          <div></div>
        </Table.Header>
        {!orderCategory?.length ? (
          <Empty resourceName="Categories" />
        ) : (
          <Table.Body
            data={orderCategory}
            render={(category: OrderCategory) => (
              <CategoryRow key={category.id} category={category} />
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
export default OrderCategoryTable;
