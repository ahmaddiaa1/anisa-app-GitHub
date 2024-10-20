import styled, { css } from "styled-components";
import { format, isToday } from "date-fns";
import { HiOutlineCurrencyDollar, HiOutlineHomeModern } from "react-icons/hi2";
import { TiFlowChildren } from "react-icons/ti";
import { TbSettingsCheck } from "react-icons/tb";
import DataItem from "../../ui/DataItem.tsx";
import { RiParentLine } from "react-icons/ri";
import { FaRegClock } from "react-icons/fa6";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { formatCurrency, formatDistanceFromNow } from "../../utils/helpers.ts";
import { Order } from "../../types/ordersTypes.ts";
import { useNavigate } from "react-router-dom";
import { TagType } from "../../types/types.ts";
import Tag from "../../ui/Tag.tsx";

const P = styled.button`
  all: unset;
`;

const StyledOrderComDetails = styled.section`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  overflow: hidden;
`;

const Header = styled.header`
  background-color: var(--color-brand-500);
  padding: 2rem 4rem;
  color: #e0e7ff;
  font-size: 1.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    height: 3.2rem;
    width: 3.2rem;
  }

  & div:first-child {
    display: flex;
    align-items: center;
    gap: 1.6rem;
    font-weight: 600;
    font-size: 1.8rem;
  }

  & span {
    font-family: "Sono";
    font-size: 2rem;
    margin-left: 4px;
  }
`;

const Section = styled.section`
  padding: 3.2rem 4rem 1.2rem;
`;

const Guest = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.6rem;
  color: var(--color-grey-500);

  & button:first-of-type {
    font-weight: 500;
    color: var(--color-grey-700);
  }
`;

const Price = styled.div<{ $status: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.6rem 3.2rem;
  border-radius: var(--border-radius-sm);
  margin-top: 2.4rem;

  ${({ $status }) => css`
    background-color: ${$status === "paid"
      ? "var(--color-green-100)"
      : $status === "will"
      ? "var(--color-red-100)"
      : "var(--color-yellow-100)"};
    color: ${$status === "paid"
      ? "var(--color-green-700)"
      : $status === "will"
      ? "var(--color-red-700)"
      : "var(--color-yellow-700)"};
  `}
  & p:last-child {
    text-transform: uppercase;
    font-size: 1.4rem;
    font-weight: 600;
  }

  svg {
    height: 2.4rem;
    width: 2.4rem;
    color: currentColor !important;
  }
`;

const Footer = styled.footer`
  padding: 1.6rem 4rem;
  font-size: 1.2rem;
  color: var(--color-grey-500);
  text-align: right;
`;
const statusToTagName: { [key: string]: TagType } = {
  inProcess: "yellow",
  accepted: "blue",
  canceled: "red",
  done: "green",
};
// A purely presentational component
function OrderComDetails({ orders }: { orders: Order }) {
  const navigate = useNavigate();

  const {
    orderCategory,
    client,
    anisa,
    orderStatus,
    child,
    orderPrice,
    orderHours,
    payedAmount,
    startDate,
    endDate,
    location,
    createdByName,
    whoStaysWithAnisa,
  } = orders;

  return (
    <StyledOrderComDetails>
      <Header>
        <div>
          <HiOutlineHomeModern />
          <p>{orderHours} hours</p>
          <Tag $type={statusToTagName[orderStatus]}>{orderStatus}</Tag>
        </div>
        <p>
          {format(new Date(startDate), "EEE, MMM dd yyyy")} (
          {isToday(new Date(startDate))
            ? "Today"
            : formatDistanceFromNow(startDate as string)}
          ) &mdash; {format(new Date(endDate), "EEE, MMM dd yyyy")}
        </p>
      </Header>

      <Section>
        <Guest>
          <P
            onClick={() =>
              navigate(`/client/details`, { state: { clientID: client.id } })
            }
          >
            {client.fullName}
          </P>
          <span>&bull;</span>
          <P
            onClick={() => {
              navigate(`/anisas/details`, { state: { anisaID: anisa.id } });
            }}
          >
            {anisa.fullName}
          </P>
          <span>&bull;</span>
        </Guest>
        <DataItem icon={<HiOutlineLocationMarker />} label="Address :">
          {location}
        </DataItem>
        {orderHours && (
          <DataItem icon={<TbSettingsCheck />} label="Setting :">
            {orderCategory.title}
          </DataItem>
        )}
        <DataItem icon={<TiFlowChildren />} label="Childrens :">
          {child.name}
        </DataItem>
        <DataItem icon={<FaRegClock />} label="Service Hours :">
          {orderHours}
        </DataItem>
        <DataItem icon={<RiParentLine />} label="Who stays with Anisa :">
          {whoStaysWithAnisa}
        </DataItem>

        <Price
          $status={
            payedAmount === orderPrice
              ? "paid"
              : payedAmount < orderPrice && payedAmount !== 0
              ? "part"
              : "will"
          }
        >
          <DataItem icon={<HiOutlineCurrencyDollar />} label={`Total price`}>
            {formatCurrency(orderPrice)} &mdash; Payed{" "}
            {formatCurrency(payedAmount)}
          </DataItem>

          <p>
            {payedAmount === orderPrice
              ? "Paid"
              : payedAmount < orderPrice && payedAmount !== 0
              ? orderStatus !== "done"
                ? "Part has been paid."
                : "order end with part of the price."
              : "Will pay at property"}
          </p>
        </Price>
      </Section>

      <Footer>
        <p>Created By {createdByName}</p>
      </Footer>
    </StyledOrderComDetails>
  );
}

export default OrderComDetails;
