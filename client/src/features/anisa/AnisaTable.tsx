import Spinner from "../../ui/Spinner.tsx";
import Table from "../../ui/Table.tsx";
import Menus from "../../ui/Menus.tsx";
import Empty from "../../ui/Empty.tsx";
import { anisaData } from "../../types/anisaTypes.ts";
import AnisaRow from "./AnisaRow.tsx";
import Pagination from "../../ui/Pagination.tsx";

function AnisaTable({
  anisas,
  isPending,
  count,
}: {
  count: number;
  anisas: anisaData[];
  isPending: boolean;
}) {
  return (
    <Menus>
      <Table columns="2fr 1fr 1fr 1fr 1fr 0.5fr">
        <Table.Header>
          <div>Name</div>
          <div>Media</div>
          <div>Status</div>
          <div>Is Verified</div>
          <div>Created at</div>
          <div></div>
        </Table.Header>
        {isPending ? (
          <Spinner />
        ) : !anisas?.length ? (
          <Empty resourceName="anisas" />
        ) : (
          <Table.Body
            data={anisas}
            render={(anisa: anisaData) => (
              <AnisaRow key={anisa.id} anisa={anisa} />
            )}
          />
        )}
        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default AnisaTable;
