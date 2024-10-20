import AnisaTable from "../features/anisa/AnisaTable.tsx";
import Heading from "../ui/Heading.tsx";
import Row from "../ui/Row.tsx";
import AnisaTableOperations from "../features/anisa/AnisaTableOperations.tsx";
import { useAnisa } from "../hooks/anisas/useAnisas.ts";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

function Anisa() {
  const [searchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "createdAt-desc";
  const [search, setSearch] = useState("");
  const filterValue = searchParams.get("verified") || "all";

  const {
    anisas,
    isPending: isLoading,
    count,
  } = useAnisa({ search, sortBy, filterValue });

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Anisas</Heading>
        <AnisaTableOperations setSearch={setSearch} />
      </Row>

      <Row>
        <AnisaTable anisas={anisas} isPending={isLoading} count={count} />
      </Row>
    </>
  );
}

export default Anisa;
