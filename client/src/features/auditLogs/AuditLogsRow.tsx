import { TagType } from "../../types/types";
import Table from "../../ui/Table";
import styled, { css } from "styled-components";
import { format } from "date-fns";

interface TagProps {
  $type: TagType;
}

const ActionTag = styled.span<TagProps>`
  width: fit-content;
  text-transform: uppercase;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.4rem 1.2rem;

  ${({ $type }) =>
    css`
      color: ${$type === "red"
        ? `var(--color-red-100)`
        : `var(--color-${$type}-700)`};
      background-color: ${$type === "red"
        ? `var(--color-red-700)`
        : `var(--color-${$type}-100)`};
    `}
`;

const AuditLogsRow = ({
  auditlog,
}: {
  auditlog: { actionType: string; actionText: string; createdAt: Date };
}) => {
  const { actionText, actionType, createdAt } = auditlog;

  const ActionColor: { [key: string]: TagType } = {
    Accept: "green",
    DELETE: "red",
    CREATE: "green",
    UPDATE: "blue",
  };

  return (
    <Table.Row>
      <ActionTag $type={ActionColor[actionType]}>{actionType}</ActionTag>

      <div>{actionText}</div>
      <div>{format(createdAt, "dd MMM yyyy")}</div>
    </Table.Row>
  );
};
export default AuditLogsRow;
