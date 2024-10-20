import AuditLogTable from "../features/auditLogs/AuditLogTable";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import AuditLogsTableOperations from "../features/auditLogs/AuditLogsTableOperations.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/users/useUser.ts";
import { useEffect } from "react";

const Logs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { moderator } = useUser();

  useEffect(() => {
    if (moderator && location.pathname === "/audit-logs") {
      navigate("/order");
    }
  }, [moderator, location, navigate]);

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Logs</Heading>
        <AuditLogsTableOperations />
      </Row>
      <Row>
        <AuditLogTable />
      </Row>
    </>
  );
};
export default Logs;
