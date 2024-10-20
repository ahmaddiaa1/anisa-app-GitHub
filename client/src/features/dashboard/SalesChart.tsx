import styled from "styled-components";
import DashboardBox from "./DashboardBox";
import Heading from "../../ui/Heading.tsx";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDarkMode } from "../../context/DarkModeContext.tsx";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import { Order } from "../../types/ordersTypes.ts";

const StyledSalesChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* Hack to change grid line colors */

  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

const SalesChart = ({
  orders,
  numDays,
}: {
  orders: Order[];
  numDays: number;
}) => {
  const { isDarkMode } = useDarkMode();

  const allDates = eachDayOfInterval({
    start: subDays(new Date(), numDays - 1),
    end: new Date(),
  });

  const data = allDates.map((date) => {
    return {
      label: format(date, "MMM dd"),
      price: orders
        .filter((order: Order) => isSameDay(date, new Date(order.createdAt)))
        .reduce((acc: number, cur: Order) => acc + cur.orderPrice, 0),
      profit: orders
        .filter((order: Order) => isSameDay(date, new Date(order.createdAt)))
        .reduce((acc: number, cur: Order) => acc + cur.profit, 0),
    };
  });

  const colors = isDarkMode
    ? {
        totalSales: { stroke: "#4f46e5", fill: "#4f46e5" },
        extrasSales: { stroke: "#22c55e", fill: "#22c55e" },
        text: "#e5e7eb",
        background: "#18212f",
      }
    : {
        totalSales: { stroke: "#4f46e5", fill: "#c7d2fe" },
        extrasSales: { stroke: "#16a34a", fill: "#dcfce7" },
        text: "#374151",
        background: "#fff",
      };

  return (
    <StyledSalesChart>
      <Heading as="h2">
        Sales from {format(allDates.at(0) || new Date(), "MMM dd yyyy")} &mdash;
        to {format(allDates.at(-1) || new Date(), "MMM dd yyyy")}
      </Heading>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <XAxis
            dataKey={"label"}
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
            xAxisId={"XAxis"}
          />
          <YAxis
            unit={"$"}
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
            yAxisId={"YAxis"}
          />
          <CartesianGrid strokeDasharray="4" />
          <Tooltip contentStyle={{ backgroundColor: colors.background }} />
          <Area
            xAxisId={"XAxis"}
            yAxisId={"YAxis"}
            dataKey={"price"}
            type={"monotone"}
            stroke={colors.totalSales.stroke}
            fill={colors.totalSales.fill}
            strokeWidth={2}
            name={"Total sales"}
            unit={"$"}
          />
          <Area
            yAxisId={"YAxis"}
            xAxisId={"XAxis"}
            dataKey={"profit"}
            type={"monotone"}
            stroke={colors.extrasSales.stroke}
            fill={colors.extrasSales.fill}
            strokeWidth={2}
            name={"profit"}
            unit={"$"}
          />
        </AreaChart>
      </ResponsiveContainer>
    </StyledSalesChart>
  );
};

export default SalesChart;
