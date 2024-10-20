import Spinner from "../../ui/Spinner";
import CabinRow from "./ClientRow.tsx";
import Table from "../../ui/Table.tsx";
import Menus from "../../ui/Menus.tsx";
import Empty from "../../ui/Empty.tsx";

import { client } from "../../types/types.ts";

import Pagination from "../../ui/Pagination.tsx";

function ClientTable({
  isPending,
  clients,
  count,
}: {
  isPending: boolean;
  clients: client[];
  count: number;
}) {
  //   let filteredClients: client[] = [];
  //   if (filterValue === "all") {
  //     filteredClients =
  //       clients?.filter((client: client) => !client.blackList) ?? [];
  //   }
  //   if (filterValue === "verified") {
  //     filteredClients =
  //       clients?.filter(
  //         (client: client) => client.isVerified && !client.blackList
  //       ) ?? [];
  //   }
  //   if (filterValue === "not-verified") {
  //     filteredClients =
  //       clients?.filter(
  //         (client: client) => !client.isVerified && !client.blackList
  //       ) ?? [];
  //   }
  //   if (filterValue === "blacklisted") {
  //     filteredClients =
  //       clients?.filter((client: client) => client.blackList) ?? [];
  //   }

  return (
    <Menus>
      <Table columns="1.8fr 1fr 1fr 1fr 1fr 1fr">
        <Table.Header>
          <div>username</div>
          <div>phone</div>
          <div>orderTime</div>
          <div>isVerified</div>
          <div>CreatedAt</div>
          <div></div>
        </Table.Header>
        {isPending ? (
          <Spinner />
        ) : !clients?.length ? (
          <Empty resourceName="clients" />
        ) : (
          <Table.Body
            data={clients}
            render={(client: client) => (
              <CabinRow key={client.id} client={client} />
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

export default ClientTable;
