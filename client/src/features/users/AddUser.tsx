import Modal from "../../ui/Modal.tsx";
import UserFrom from "./UserForm.tsx";
import styled from "styled-components";

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

const AddUser = () => {
  return (
    <div>
      <Modal>
        <Modal.Open opens="user-form">
          <Button>Add new user</Button>
        </Modal.Open>
        <Modal.Window name="user-form">
          <UserFrom />
        </Modal.Window>
      </Modal>
    </div>
  );
};

export default AddUser;
