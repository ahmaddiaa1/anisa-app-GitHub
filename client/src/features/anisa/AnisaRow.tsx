import { MdOutlineBlock, MdOutlineVerified } from "react-icons/md";
import { format } from "date-fns";
import styled from "styled-components";

import ConfirmDelete from "../../ui/Confirm.tsx";
import Confirm from "../../ui/Confirm.tsx";
import Modal from "../../ui/Modal.tsx";
import Table from "../../ui/Table.tsx";
import Menus from "../../ui/Menus.tsx";
import Tag from "../../ui/Tag.tsx";

import useDeleteAnisa from "../../hooks/anisas/useDeleteAnisa.ts";

import { anisaData } from "../../types/anisaTypes.ts";
import { TagType } from "../../types/types.ts";
import { useNavigate } from "react-router-dom";
import { HiEye } from "react-icons/hi2";
import { useVerifyAnisa } from "../../hooks/useVerify.ts";
import { useBlacklistAnisa } from "../../hooks/useBlacklist.ts";
import { useUser } from "../../hooks/users/useUser.ts";

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Date = styled.div`
  font-family: "Sono", serif;
  font-weight: 600;
`;

const statusToTagName: { [key: string]: TagType } = {
  active: "green",
  inActive: "silver",
  invacation: "silver",
  busy: "blue",
};
const verifyState: { [key: string]: TagType } = {
  true: "green",
  false: "blue",
};
const blacklistState: { [key: string]: TagType } = {
  true: "red",
};

function AnisaRow({
  anisa,
  onCloseModal,
}: {
  anisa: anisaData;
  onCloseModal?: () => void;
}) {
  const navigate = useNavigate();
  const {
    id: anisaID,
    fullName,
    phone,
    email,
    anisaStatus,
    isVerified,
    createdAt,
    blackList,
  } = anisa;

  const { verifyAnisa, isVerifying } = useVerifyAnisa();
  const { deleteAnisa, isDeleting } = useDeleteAnisa();
  const { blacklist, isPending } = useBlacklistAnisa();

  const { notModerator } = useUser();

  return (
    <Table.Row>
      <Cabin>{fullName}</Cabin>
      <Stacked>
        <span>{phone}</span>
        <span>{email}</span>
      </Stacked>
      <Tag $type={statusToTagName[anisaStatus]}>{anisaStatus}</Tag>
      {!blackList ? (
        <Tag $type={verifyState[isVerified.toString()]}>
          {isVerified ? "verified" : "not verified"}
        </Tag>
      ) : (
        <Tag $type={blacklistState[blackList.toString()]}>
          {blackList ? "blacklisted" : "not blacklisted"}
        </Tag>
      )}
      <Date>{format(createdAt, "dd MMM yyy")}</Date>
      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={`${anisaID}`} />
            <Menus.List id={`${anisaID}`}>
              <Menus.Button
                onClick={() => {
                  navigate(`/anisas/details`, {
                    state: { anisaID },
                  });
                }}
                icon={<HiEye />}
              >
                see Details
              </Menus.Button>{" "}
              <Menus.Button
                onClick={() => {
                  navigate(`/order` + `?id=${anisaID}`);
                }}
                icon={<HiEye />}
              >
                see Orders
              </Menus.Button>
              {notModerator ? (
                !isVerified ? (
                  <Modal.Open opens="verify">
                    <Menus.Button icon={<MdOutlineVerified />}>
                      Verify
                    </Menus.Button>
                  </Modal.Open>
                ) : (
                  <Modal.Open opens="blacklist">
                    <Menus.Button icon={<MdOutlineBlock />}>
                      Blacklist
                    </Menus.Button>
                  </Modal.Open>
                )
              ) : null}
            </Menus.List>
            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="Anisa"
                onConfirm={() => deleteAnisa({ anisaID })}
                disabled={isDeleting}
              />
            </Modal.Window>{" "}
            <Modal.Window name="verify">
              <Confirm
                resourceName={"Anisa"}
                onConfirm={() => {
                  verifyAnisa(
                    { anisaID },
                    {
                      onSuccess: onCloseModal,
                    }
                  );
                }}
                disabled={isVerifying}
                actionName={"Verify"}
              />
            </Modal.Window>
            <Modal.Window name="blacklist">
              <Confirm
                resourceName={"client"}
                onConfirm={() => {
                  blacklist(anisaID, {
                    onSuccess: onCloseModal,
                  });
                }}
                disabled={isPending}
                actionName={"Blacklist"}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default AnisaRow;
