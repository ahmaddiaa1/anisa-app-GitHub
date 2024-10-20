import { format, isToday } from "date-fns";
import styled from "styled-components";

import Table from "../../ui/Table.tsx";

import Tag from "../../ui/Tag.tsx";

import { TagType } from "../../types/types.ts";
import { Order } from "../../types/ordersTypes.ts";
import { formatCurrency, formatDistanceFromNow } from "../../utils/helpers.ts";
import Modal from "../../ui/Modal.tsx";
import Menus from "../../ui/Menus.tsx";
import { useNavigate } from "react-router-dom";
import { HiEye } from "react-icons/hi2";

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

const Date = styled.div`
  font-family: "Sono", serif;
  font-weight: 600;
`;

const status: { [key: string]: TagType } = {
  inProcess: "yellow",
  accepted: "blue",
  canceled: "red",
  done: "green",
};

function OrderRow({ orders }: { orders: Order }) {
  const {
    id: orderID,
    orderCategory,
    client,
    anisa,
    orderStatus,
    orderPrice,
    orderHours,
    startDate,
    endDate,
    createdAt,
  } = orders;

  const navigate = useNavigate();

  return (
    <Table.Row>
      <Stacked>
        <span>{client.fullName}</span>
        <span>{anisa.fullName}</span>
      </Stacked>
      <div>{orderCategory.title}</div>
      <Stacked>
        <span>
          {isToday(startDate)
            ? "Today"
            : formatDistanceFromNow(startDate as string)}{" "}
          &rarr; {orderHours} Hours
        </span>
        <span>
          {format(startDate, "MMM dd yyyy")} &mdash;
          {format(endDate, "MMM dd yyyy")}
        </span>
      </Stacked>
      <Tag $type={status[orderStatus]}>{orderStatus}</Tag>
      <div>{formatCurrency(orderPrice)}</div>
      <Date>{format(createdAt, "dd MMM yyy")}</Date>
      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={`${orderID}`} />
            <Menus.List id={`${orderID}`}>
              <Menus.Button
                icon={<HiEye />}
                onClick={() =>
                  navigate("/order/details", { state: { editID: orderID } })
                }
              >
                see Details
              </Menus.Button>

              <Modal.Open opens="delete">
                <Menus.Button>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>
            {/* <Modal.Window name="edit">
              <OrderDetails />
            </Modal.Window> */}
            <Modal.Window name="verify">
              <div></div>
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default OrderRow;
