import Spinner from "../../ui/Spinner.tsx";
import Table from "../../ui/Table.tsx";
import Menus from "../../ui/Menus.tsx";
import Empty from "../../ui/Empty.tsx";
import { anisaData } from "../../types/anisaTypes.ts";
import AnisaRow from "./AnisaRow.tsx";

import styled from "styled-components";
import useGetAnisaDashboard from "../../hooks/anisas/useGetAnisaDashboard.ts";

const TableContainer = styled.div`
  grid-column: 1 / -1;
  height: 100%;
`;

function AnisaDashboardTable() {
  const { anisaDashboard, isPending } = useGetAnisaDashboard();
  return (
    <TableContainer>
      <Menus>
        <Table columns="2fr 1fr 1fr 1fr 0.5fr">
          <Table.Header>
            <div>Name</div>
            <div>Media</div>
            <div>total</div>
            <div>Orders num.</div>
            <div></div>
          </Table.Header>
          {isPending ? (
            <Spinner />
          ) : !anisaDashboard?.length ? (
            <Empty resourceName="anisas" />
          ) : (
            <Table.Body
              data={anisaDashboard}
              render={(anisa: anisaData) => (
                <AnisaRow key={anisa.id} anisa={anisa} />
              )}
            />
          )}
        </Table>
      </Menus>
    </TableContainer>
  );
}
export default AnisaDashboardTable;
