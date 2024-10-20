import styled from "styled-components";
import Button from "./Button";
import Heading from "./Heading";

const StyledConfirmDelete = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  & p {
    color: var(--color-grey-500);
    margin-bottom: 1.2rem;
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

function Confirm({
  resourceName,
  onConfirm,
  disabled,
  onCloseModal,
  actionName,
}: {
  resourceName: string;
  onConfirm: (any?: () => void) => void;
  disabled: boolean;
  onCloseModal?: () => void;
  actionName?: string;
}) {
  return (
    <StyledConfirmDelete>
      <Heading as="h3">
        {actionName} {resourceName}
      </Heading>
      <p>
        Are you sure you want to {actionName} this {resourceName}?
        <br />
        You can undo this action later.
      </p>

      <div>
        <Button
          $variation="secondary"
          disabled={disabled}
          onClick={onCloseModal}
        >
          Cancel
        </Button>
        <Button
          $variation={actionName !== "Verify" ? "danger" : "primary"}
          disabled={disabled}
          onClick={() => onConfirm(onCloseModal)}
        >
          {actionName}
        </Button>
      </div>
    </StyledConfirmDelete>
  );
}

export default Confirm;
