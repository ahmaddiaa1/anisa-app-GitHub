import { useAuditLogs } from "../../services/apiAuditLog";
import Empty from "../../ui/Empty";
import Menus from "../../ui/Menus";
import Table from "../../ui/Table";
import AuditLogsRow from "./AuditLogsRow";
import Pagination from "../../ui/Pagination.tsx";
import Spinner from "../../ui/Spinner.tsx";
import { useSearchParams } from "react-router-dom";

const AuditLogTable = () => {
  const [searchParams] = useSearchParams();
  const filterValue = searchParams.get("action") || "all";
  const sortBy = searchParams.get("sortBy") || "createdAt-desc";

  const { auditLogs, totalLogs, isPending } = useAuditLogs(filterValue, sortBy);

  if (isPending) return <Spinner />;

  return (
    <Menus>
      <Table columns="0.5fr 2fr 1fr">
        <Table.Header>
          <div>Actions</div>

          <div>Message</div>

          <div>CreatedAt</div>
        </Table.Header>
        {!auditLogs?.length ? (
          <Empty resourceName="Logs" />
        ) : (
          <Table.Body
            data={auditLogs}
            render={(auditLogs: any) => (
              <AuditLogsRow key={auditLogs.id} auditlog={auditLogs} />
            )}
          />
        )}
        <Table.Footer>
          <Pagination count={totalLogs} />
        </Table.Footer>
      </Table>
    </Menus>
  );
};
export default AuditLogTable;
