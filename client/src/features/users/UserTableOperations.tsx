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

function UserTableOperation({
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
        filterField="role"
        options={[
          { value: "all", label: "All" },
          { value: "admin", label: "Admin" },
          { value: "moderator", label: "Moderator" },
          { value: "supervisor", label: "Supervisor" },
          { value: "canceled", label: "Canceled" },
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

export default UserTableOperation;
