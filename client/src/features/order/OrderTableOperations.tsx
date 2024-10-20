import TableOperations from "../../ui/TableOperations.tsx";
import Filter from "../../ui/Filter.tsx";
import SortBy from "../../ui/SortBy.tsx";
import styled from "styled-components";
const SearchInput = styled.input`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  padding: 0.6rem 1.2rem;
  font-size: 14px;
`;

function OrderTableOperations({
  setSearch,
}: {
  setSearch: (search: string) => void;
}) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <TableOperations>
      <SearchInput
        type="text"
        onChange={handleSearch}
        placeholder="Search by name or phone"
      />
      <Filter
        filterField="status"
        options={[
          { value: "all", label: "All" },
          { value: "accepted", label: "Accepted" },
          { value: "canceled", label: "Canceled" },
          { value: "inProcess", label: "In Process" },
          { value: "done", label: "Done" },
        ]}
      />
      <SortBy
        options={[
          { value: "createdAt-desc", label: "Sort by date (latest first)" },
          { value: "createdAt-asc", label: "Sort by date (oldest first)" },
          { value: "orderPrice-asc", label: "Sort by price (lowest first)" },
          { value: "orderPrice-desc", label: "Sort by price (highest first)" },
        ]}
      />
    </TableOperations>
  );
}

export default OrderTableOperations;
