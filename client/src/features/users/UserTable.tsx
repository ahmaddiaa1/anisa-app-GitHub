// import { useAuditLogs } from "../../services/apiAuditLog";
import Empty from "../../ui/Empty";
import Menus from "../../ui/Menus";
import Table from "../../ui/Table";
import Pagination from "../../ui/Pagination.tsx";
import Spinner from "../../ui/Spinner.tsx";
// import { useSearchParams } from "react-router-dom";
import UserRow from "./UserRow.tsx";
import { User } from "../../types/usersTypes.ts";
import { useUser } from "../../hooks/users/useUser.ts";

const UserTable = ({
  users,
  isPending,
  count,
}: {
  users: User[];
  isPending: boolean;
  count: number;
}) => {
  const { role } = useUser();

  //   const [searchParams] = useSearchParams();
  //   const filterValue = searchParams.get("action") || "all";
  //   const sortBy = searchParams.get("sortBy") || "createdAt-desc";

  if (isPending) return <Spinner />;
  return (
    <Menus>
      <Table columns="1fr 1fr 1fr 0.5fr 0.5fr">
        <Table.Header>
          <div>name</div>
          <div>email</div>
          <div>role</div>
          <div>CreatedAt</div>
          <div></div>
        </Table.Header>
        {!users?.length && role !== "admin" ? (
          <Empty resourceName="anisas" />
        ) : (
          <Table.Body
            data={users}
            render={(user: User) => <UserRow key={user.id} users={user} />}
          />
        )}
        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
};
export default UserTable;
