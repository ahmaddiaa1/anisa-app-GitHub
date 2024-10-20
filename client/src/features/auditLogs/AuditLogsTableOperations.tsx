import TableOperations from "../../ui/TableOperations.tsx";
import Filter from "../../ui/Filter.tsx";
import SortBy from "../../ui/SortBy.tsx";

function ClientTableOperation() {
  return (
    <TableOperations>
      <Filter
        filterField="action"
        options={[
          { value: "all", label: "All" },
          { value: "UPDATE", label: "UPDATE" },
          { value: "CREATE", label: "CREATE" },
          { value: "DELETE", label: "DELETE" },
        ]}
      />
      <SortBy
        options={[
          { value: "createdAt-desc", label: "Sort by date (latest first)" },
          { value: "createdAt-asc", label: "Sort by date (oldest first)" },
        ]}
      />
    </TableOperations>
  );
}

export default ClientTableOperation;
