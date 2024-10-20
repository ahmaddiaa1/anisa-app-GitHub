import styled from "styled-components";
import Modal from "../../ui/Modal.tsx";
import CreateOrder from "./CreateOrder.tsx";

const Button = styled.button`
  width: 100%;
  border: none;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  font-size: 1.4rem;
  padding: 1.2rem 1.6rem;
  font-weight: 500;
  color: var(--color-brand-50);
  background-color: var(--color-brand-600);

  &:hover {
    background-color: var(--color-brand-700);
  }
`;

function AddOrder() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="order-form">
          <Button>Create new Order</Button>
        </Modal.Open>
        <Modal.Window name="order-form">
          <CreateOrder />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddOrder;
