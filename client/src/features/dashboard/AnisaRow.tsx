import styled from "styled-components";

import Table from "../../ui/Table.tsx";

// import Tag from "../../ui/Tag.tsx";
import { TbCreditCardPay } from "react-icons/tb";

import { anisaData } from "../../types/anisaTypes.ts";
// import { TagType } from "../../types/types.ts";
import { formatCurrency } from "../../utils/helpers.ts";
import Modal from "../../ui/Modal.tsx";
import Menus from "../../ui/Menus.tsx";
import { HiEye } from "react-icons/hi";
import { Order } from "../../types/ordersTypes.ts";
import { format } from "date-fns";
import { TagType } from "../../types/types.ts";
import Tag from "../../ui/Tag.tsx";
import { usePayAnisa } from "../../hooks/orders/useSetOrderStatus.ts";
import Button from "../../ui/Button.tsx";

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
const StackedDate = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  align-items: start;

  & span {
    font-size: 1.2rem;
    letter-spacing: 1px;
  }
`;
const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const statusToTagName: { [key: string]: TagType } = {
  accepted: "blue",
  canceled: "red",
  inProcess: "yellow",
  done: "green",
};
// const verifyState: { [key: string]: TagType } = {
//   true: "green",
//   false: "blue",
// };
// const blacklistState: { [key: string]: TagType } = {
//   true: "red",
// };

function AnisaRow({ anisa }: { anisa: anisaData }) {
  const { id: anisaID, fullName, phone, email, orders } = anisa;
  const { PayAnisa } = usePayAnisa();
  const num = orders.filter((order) => order.hasAnisaBeenPaid === false);

  const total = num.reduce((acc, order) => acc + order.anisaOrderPrice, 0);
  return (
    <Table.Row>
      <Cabin>{fullName}</Cabin>
      <Stacked>
        <span>{phone}</span>
        <span>{email}</span>
      </Stacked>
      <div>{formatCurrency(total)}</div>
      <div>{num.length} Orders</div>
      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={`${anisaID}`} />
            <Menus.List id={`${anisaID}`}>
              <Modal.Open opens="orders">
                <Menus.Button icon={<HiEye />}>Orders</Menus.Button>
              </Modal.Open>
              <Menus.Button
                icon={<TbCreditCardPay />}
                onClick={() =>
                  PayAnisa({
                    anisaID,
                    type: "all",
                  })
                }
              >
                Pay All
              </Menus.Button>
            </Menus.List>
            <Modal.Window name="orders">
              <Table columns="2fr 1fr 1fr 1fr 1.5fr 1fr ">
                <Table.Header>
                  <div>Name</div>
                  <div>Media</div>
                  <div>absent</div>
                  <div>total</div>
                  <div>Start-end Date</div>
                  <div></div>
                </Table.Header>

                <Table.Body
                  data={num}
                  render={(order: Order) => (
                    <Table.Row key={anisa.id}>
                      <div>{order.client.fullName}</div>
                      <Tag $type={statusToTagName[order.orderStatus]}>
                        {order.orderStatus}
                      </Tag>
                      <div>{`${order.absent}  days`} </div>
                      <div>{formatCurrency(order.anisaOrderPrice)}</div>
                      <StackedDate>
                        <span>{format(order.startDate, "dd MMM yyy")}</span>
                        <span>{format(order.endDate, "dd MMM yyy")}</span>
                      </StackedDate>{" "}
                      <Button
                        disabled={order.orderStatus !== "done"}
                        onClick={() =>
                          PayAnisa({
                            anisaID,
                            orderID: order.id,
                            type: "single",
                          })
                        }
                      >
                        Pay
                      </Button>
                    </Table.Row>
                  )}
                />
              </Table>
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default AnisaRow;
