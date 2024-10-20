import styled from "styled-components";
import { client, TagType } from "../../types/types.ts";
import Modal from "../../ui/Modal.tsx";
import Table from "../../ui/Table.tsx";
import Menus from "../../ui/Menus.tsx";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { HiEye } from "react-icons/hi2";
import Tag from "../../ui/Tag.tsx";
import { MdOutlineBlock, MdOutlineVerified } from "react-icons/md";
import { useVerifyClient } from "../../hooks/useVerify.ts";
import CreateOrder from "../order/CreateOrder.tsx";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useBlacklistClient } from "../../hooks/useBlacklist.ts";
import { useUser } from "../../hooks/users/useUser.ts";
import Confirm from "../../ui/Confirm.tsx";

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono", serif;
  font-weight: 600;
`;

const Date = styled.div`
  font-family: "Sono", serif;
  font-weight: 600;
`;

const verifyState: { [key: string]: TagType } = {
  true: "green",
  false: "blue",
};

const blacklistState: { [key: string]: TagType } = {
  true: "red",
};

function ClientRow({ client }: { client: client }) {
  const {
    id: clientID,
    phone,
    fullName,
    orderDate,
    isVerified,
    createdAt,
    blackList,
  } = client;

  const navigate = useNavigate();
  const { verifyClient, isVerifying } = useVerifyClient();
  const { blacklist, isPending: isBlacklist } = useBlacklistClient();
  const { notModerator } = useUser();

  return (
    <Table.Row>
      <Cabin>{fullName}</Cabin>
      <div>{phone}</div>
      <Price>{format(orderDate, "dd MMM yyyy")}</Price>
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
            <Menus.Toggle id={`${clientID}`} />
            <Menus.List id={`${clientID}`}>
              <Menus.Button
                icon={<HiEye />}
                onClick={() =>
                  navigate(`/client/details`, { state: { clientID } })
                }
              >
                see detail
              </Menus.Button>
              {isVerified && !blackList && (
                <Modal.Open opens="order-form">
                  <Menus.Button icon={<IoMdAddCircleOutline />}>
                    Create Order
                  </Menus.Button>
                </Modal.Open>
              )}
              {isVerified && !blackList && (
                <Menus.Button
                  onClick={() => {
                    navigate(`/order` + `?id=${clientID}`);
                  }}
                  icon={<HiEye />}
                >
                  see Orders
                </Menus.Button>
              )}
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

            <Modal.Window name="verify">
              <Confirm
                resourceName={"client"}
                onConfirm={(onClose) => {
                  verifyClient(
                    { clientId: clientID },
                    { onSuccess: () => onClose?.() }
                  );
                }}
                disabled={isVerifying}
                actionName={"Verify"}
              />
            </Modal.Window>
            <Modal.Window name="blacklist">
              <Confirm
                resourceName={"client"}
                onConfirm={(onClose) => {
                  blacklist(clientID, {
                    onSuccess: () => onClose?.(),
                  });
                }}
                disabled={isBlacklist}
                actionName={"Blacklist"}
              />
            </Modal.Window>
            <Modal.Window name="order-form">
              <CreateOrder clientID={{ fullName, id: clientID }} />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default ClientRow;
