import { format } from "date-fns";
import styled from "styled-components";
import Table from "../../ui/Table.tsx";
import Tag from "../../ui/Tag.tsx";
import { TagType } from "../../types/types.ts";
import { User } from "../../types/usersTypes.ts";
import Modal from "../../ui/Modal.tsx";
import Menus from "../../ui/Menus.tsx";
import { HiPencil } from "react-icons/hi";
import Confirm from "../../ui/Confirm.tsx";
import UserFrom from "./UserForm.tsx";
import { MdOutlineCancel } from "react-icons/md";
import { useCancelUser } from "../../hooks/users/useCancelUser.ts";
import { useUser } from "../../hooks/users/useUser.ts";

const Date = styled.div`
  font-family: "Sono", serif;
  font-weight: 600;
`;

const roleStatus: { [key: string]: TagType } = {
  admin: "yellow",
  moderator: "blue",
  supervisor: "green",
};

const cancelStatus: { [key: string]: TagType } = {
  true: "red",
};

function UserRow({ users }: { users: User }) {
  const { id: userID, username, email, role, isCanceled, createdAt } = users;
  const { cancelUser, isPending: isCanceling } = useCancelUser();

  const { notAdmin } = useUser();

  return (
    <Table.Row>
      <div>{username}</div>
      <span>{email}</span>
      {isCanceled ? (
        <Tag $type={cancelStatus[isCanceled.toString()]}>canceled</Tag>
      ) : (
        <Tag $type={roleStatus[role]}>{role}</Tag>
      )}
      <Date>{format(createdAt, "dd MMM yyy")}</Date>
      <div>
        {!notAdmin && (
          <Modal>
            <Menus.Menu>
              <Menus.Toggle id={userID} />
              <Menus.List id={userID}>
                <Modal.Open opens="update">
                  <Menus.Button icon={<HiPencil />}>update</Menus.Button>
                </Modal.Open>

                <Modal.Open opens="cancel">
                  <Menus.Button icon={<MdOutlineCancel />}>Cancel</Menus.Button>
                </Modal.Open>
              </Menus.List>
              <Modal.Window name="cancel">
                <Confirm
                  resourceName="User"
                  onConfirm={() => cancelUser(userID)}
                  disabled={isCanceling}
                  actionName={"Cancel"}
                />
              </Modal.Window>
              <Modal.Window name="update">
                <UserFrom dataToEdit={users} />
              </Modal.Window>
            </Menus.Menu>
          </Modal>
        )}
      </div>
    </Table.Row>
  );
}

export default UserRow;
