import TableOperations from "../../ui/TableOperations.tsx";
import Filter from "../../ui/Filter.tsx";
import SortBy from "../../ui/SortBy.tsx";

function CategoryTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="isActive"
        options={[
          { value: "all", label: "All" },
          { value: "true", label: "ENABLE" },
          { value: "false", label: "DISABLE" },
        ]}
      />
      <SortBy
        options={[
          { value: "createdAt-desc", label: "Sort by date (latest first)" },
          { value: "createdAt-asc", label: "Sort by date (oldest first)" },
          { value: "unitPrice-desc", label: "Sort by price (high first)" },
          { value: "unitPrice-asc", label: "Sort by price (low first)" },
        ]}
      />
    </TableOperations>
  );
}

export default CategoryTableOperations;
