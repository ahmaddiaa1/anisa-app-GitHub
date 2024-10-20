import Stat from "./Stat.tsx";
import { HiOutlineChartBar } from "react-icons/hi2";
import { GrMoney } from "react-icons/gr";
import { BsBox2 } from "react-icons/bs";
import { formatCurrency } from "../../utils/helpers.ts";
import { Order } from "../../types/ordersTypes.ts";

import styled from "styled-components";

const Div = styled.div`
  display: flex;
  gap: 3rem;
  align-items: start;

  & div {
    display: flex;
    flex-direction: column;

    & span {
      font-weight: 500;
    }
  }
`;

const Stats = ({ Orders }: { Orders: Order[] }) => {
  const DoneOrders = Orders.filter((order) => order.orderStatus === "done");

  const NumOfOrders = Orders?.length;
  const DoneOrder = Orders.filter(
    (order: Order) => order.orderStatus === "done"
  ).length;
  const AcceptOrder = Orders.filter(
    (order: Order) => order.orderStatus === "accepted"
  ).length;
  const CancelOrder = Orders.filter(
    (order: Order) => order.orderStatus === "canceled"
  ).length;
  const ProcessOrder = Orders.filter(
    (order: Order) => order.orderStatus === "inProcess"
  ).length;

  const TotalPrice = DoneOrders.reduce(
    (acc: number, cur: Order) => acc + cur.orderPrice,
    0
  );
  const Payed = DoneOrders.reduce(
    (acc: number, cur: Order) => acc + cur.finalPrice,
    0
  );
  const remain = Orders.filter(
    (order) => order.orderStatus === "accepted"
  ).reduce((acc: number, cur: Order) => acc + cur.remainingAmount, 0);

  const AnisasPrice = DoneOrders.reduce(
    (acc: number, cur: Order) => acc + cur.anisaOrderPrice,
    0
  );
  const AnisasPricePaid = DoneOrders.filter(
    (order) => order.hasAnisaBeenPaid
  ).reduce((acc: number, cur: Order) => acc + cur.anisaOrderPrice, 0);
  const AnisasPriceRemain = DoneOrders.filter(
    (order) => order.hasAnisaBeenPaid === false
  ).reduce((acc: number, cur: Order) => acc + cur.anisaOrderPrice, 0);

  return (
    <>
      <Stat
        icon={<BsBox2 />}
        title={"Orders"}
        value={`${NumOfOrders} `}
        details={
          <Div>
            <div>
              <span> done: {DoneOrder} </span>
              <span> pending: {ProcessOrder}</span>
            </div>
            <div>
              <span> accepted: {AcceptOrder}</span>
              <span> canceled: {CancelOrder}</span>
            </div>
          </Div>
        }
        color={"blue"}
      />
      <Stat
        icon={<GrMoney />}
        title={"Total Price"}
        value={formatCurrency(TotalPrice)}
        color={"green"}
        details={
          <>
            income: {formatCurrency(remain)}
            <br />
            Profit: {formatCurrency(Payed)}
          </>
        }
      />
      <Stat
        icon={<HiOutlineChartBar />}
        title={"Anisas Price"}
        value={
          formatCurrency(AnisasPrice) >= "0" ? formatCurrency(AnisasPrice) : "0"
        }
        details={
          <>
            paid: {formatCurrency(AnisasPricePaid)}
            <br />
            remain: {formatCurrency(AnisasPriceRemain)}
          </>
        }
        color={"yellow"}
      />
    </>
  );
};
export default Stats;
