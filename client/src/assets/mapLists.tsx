import { BsBox2 } from "react-icons/bs";
import { FaFemale } from "react-icons/fa";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { LuUsers2 } from "react-icons/lu";
import { MdOutlineAddModerator } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { VscLayersActive } from "react-icons/vsc";

export const MainNavList = [
  {
    id: 1,
    path: "/dashboard",
    icon: <RxDashboard />,
    name: "Dashboard",
    role: ["moderator", "supervisor"],
  },
  {
    id: 2,
    path: "/order",
    icon: <BsBox2 />,
    name: "Order",
    role: [],
  },
  {
    id: 4,
    path: "/anisas",
    icon: <FaFemale />,
    name: "Anisas",
    role: [],
  },
  {
    id: 5,
    path: "/client",
    icon: <LuUsers2 />,
    name: "Client",
    role: [],
  },
  {
    id: 6,
    path: "/moderators",
    icon: <MdOutlineAddModerator />,
    name: "Moderators",
    role: ["moderator"],
  },
  {
    id: 7,
    path: "/settings",
    icon: <HiOutlineCog6Tooth />,
    name: "Settings",
    role: [],
  },
  {
    id: 8,
    path: "/audit-logs",
    icon: <VscLayersActive />,
    name: "Logs",
    role: ["moderator"],
  },
];

export const OrderStatus = [
  {
    id: 1,
    label: "Done",
    value: "done",
  },
  {
    id: 2,
    label: "In Progress",
    value: "inProcess",
  },
  {
    id: 3,
    label: "Accepted",
    value: "accepted",
  },
  {
    id: 4,
    label: "Cancelled",
    value: "canceled",
  },
];
