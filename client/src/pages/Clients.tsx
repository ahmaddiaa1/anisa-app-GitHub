import Heading from "../ui/Heading";
import Row from "../ui/Row";
import ClientTable from "../features/clients/ClientTable.tsx";
import AddClients from "../features/clients/AddClients.tsx";
import ClientTableOperation from "../features/clients/ClientTableOperations.tsx";
import { useState } from "react";
import { useClients } from "../hooks/clients/useClients.ts";
import { useSearchParams } from "react-router-dom";

function Clients() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const sortBy = searchParams.get("sortBy") || "createdAt-desc";
  const filterValue = searchParams.get("verified") || "all";

  const { clients, isPending, totalClient } = useClients(
    search,
    sortBy,
    filterValue
  );

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Clients</Heading>
        <ClientTableOperation setSearch={setSearch} />
      </Row>

      <Row>
        <ClientTable
          isPending={isPending}
          clients={clients}
          count={totalClient}
        />
        <AddClients />
      </Row>
    </>
  );
}

export default Clients;
