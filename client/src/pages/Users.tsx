import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import UserTable from "../features/users/UserTable";
import UserTableOperation from "../features/users/UserTableOperations";
import { useUsers } from "../hooks/users/useGetUsers.ts";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import { useEffect, useState } from "react";
import AddUser from "../features/users/AddUser.tsx";
import { useUser } from "../hooks/users/useUser.ts";

function NewUsers() {
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "all";
  const sortBy = searchParams.get("sortBy") || "createdAt-desc";
  const { users, isPending, count } = useUsers(search, sortBy, role);

  const location = useLocation();
  const navigate = useNavigate();
  const { notAdmin, moderator } = useUser();

  useEffect(() => {
    if (moderator && location.pathname === "/moderators") {
      navigate("/order");
    }
  }, [moderator, location, navigate]);

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Users</Heading>
        <UserTableOperation setSearch={setSearch} />
      </Row>

      <Row>
        <UserTable users={users} isPending={isPending} count={count} />
        {notAdmin ? null : <AddUser />}
      </Row>
    </>
  );
}

export default NewUsers;
