import styled from "styled-components";
import Heading from "../../ui/Heading.tsx";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useDarkMode } from "../../context/DarkModeContext.tsx";
import { OrderCategory } from "../../types/ordersTypes.ts";

const ChartBox = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 2.4rem 3.2rem;
  grid-column: 4 / span 3;

  & > *:first-child {
    margin-bottom: 1.6rem;
  }

  & .recharts-pie-label-text {
    font-weight: 600;
  }
`;

const startDataLight = [
  { duration: "1 order", color: "#ef4444" },
  { duration: "2 orders", color: "#f97316" },
  { duration: "3 orders", color: "#eab308" },
  { duration: "4-5 orders", color: "#84cc16" },
  { duration: "6-7 orders", color: "#22c55e" },
  { duration: "8-14 orders", color: "#14b8a6" },
  { duration: "15-21 orders", color: "#3b82f6" },
  { duration: "22-50 orders", color: "#a855f7" },
  { duration: "51-100 orders", color: "#6366f1" },
  { duration: "100+ orders", color: "#9333ea" },
];

const startDataDark = [
  { duration: "1 order", color: "#b91c1c" },
  { duration: "2 orders", color: "#c2410c" },
  { duration: "3 orders", color: "#a16207" },
  { duration: "4-5 orders", color: "#4d7c0f" },
  { duration: "6-7 orders", color: "#15803d" },
  { duration: "8-14 orders", color: "#0f766e" },
  { duration: "15-21 orders", color: "#1d4ed8" },
  { duration: "22-50 orders", color: "#7e22ce" },
  { duration: "51-100 orders", color: "#4c1d95" },
  { duration: "100+ orders", color: "#581c87" },
];

interface startData {
  duration: string;
  value: string;
  color: string;
}

const DurationChart = ({ orderCategories }: { orderCategories: any }) => {
  const { isDarkMode } = useDarkMode();

  const assignedColors = new Set<string>();

  const getOrderRange = (orderCount: number, theme: "light" | "dark") => {
    const colorData = theme === "light" ? startDataLight : startDataDark;

    const findUniqueColor = (color: string) => {
      // If the color is already assigned, pick another
      if (!assignedColors.has(color)) {
        assignedColors.add(color);
        return color;
      }

      // Fallback: Find first unused color (or generate one)
      const availableColor = colorData.find(
        (data) => !assignedColors.has(data.color)
      )?.color;

      if (availableColor) {
        assignedColors.add(availableColor);
        return availableColor;
      }

      // If all colors are used, generate a random color as fallback
      const randomColor = `#${Math.floor(Math.random() * 16777215).toString(
        16
      )}`;
      assignedColors.add(randomColor);
      return randomColor;
    };

    if (orderCount === 1)
      return { ...colorData[0], color: findUniqueColor(colorData[0].color) };
    if (orderCount === 2)
      return { ...colorData[1], color: findUniqueColor(colorData[1].color) };
    if (orderCount === 3)
      return { ...colorData[2], color: findUniqueColor(colorData[2].color) };
    if (orderCount >= 4 && orderCount <= 5)
      return { ...colorData[3], color: findUniqueColor(colorData[3].color) };
    if (orderCount >= 6 && orderCount <= 7)
      return { ...colorData[4], color: findUniqueColor(colorData[4].color) };
    if (orderCount >= 8 && orderCount <= 14)
      return { ...colorData[5], color: findUniqueColor(colorData[5].color) };
    if (orderCount >= 15 && orderCount <= 21)
      return { ...colorData[6], color: findUniqueColor(colorData[6].color) };
    if (orderCount >= 22 && orderCount <= 50)
      return { ...colorData[7], color: findUniqueColor(colorData[7].color) };
    if (orderCount >= 51 && orderCount <= 100)
      return { ...colorData[8], color: findUniqueColor(colorData[8].color) };

    return { ...colorData[9], color: findUniqueColor(colorData[9].color) }; // 100+ orders
  };
  const data = orderCategories.map((category: OrderCategory) => {
    const orderCount = category.order.length;
    const duration = category.title;
    const { color } = getOrderRange(
      orderCount,
      isDarkMode === true ? "light" : "dark"
    );

    return {
      duration,
      value: orderCount, // The number of orders in this category
      color,
    };
  });

  return (
    <ChartBox>
      <Heading as={"h2"}>Stay duration summary</Heading>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            nameKey="duration"
            dataKey="value"
            innerRadius={90}
            outerRadius={115}
            cx="50%"
            cy="50%"
            paddingAngle={2}
          >
            {data.map((entry: startData) => (
              <Cell
                fill={entry.color}
                stroke={entry.color}
                key={entry.duration}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            verticalAlign={"top"}
            align={"right"}
            width={200}
            layout="vertical"
            iconSize={12}
            iconType="diamond"
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartBox>
  );
};

export default DurationChart;
