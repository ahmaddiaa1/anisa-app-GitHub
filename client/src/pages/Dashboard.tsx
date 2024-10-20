import Heading from "../ui/Heading";
import Row from "../ui/Row";
import DashboardLayout from "../features/dashboard/DashboardLayout.tsx";
import DashboardFilter from "../features/dashboard/DashboardFilter.tsx";
import { useUser } from "../hooks/users/useUser.ts";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Dashboard() {
  const { role } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "admin" && location.pathname === "/dashboard") {
      navigate("/order");
    }
  }, [role, location, navigate]);

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Dashboard</Heading>
        <DashboardFilter />
      </Row>

      <DashboardLayout />
    </>
  );
}

export default Dashboard;
