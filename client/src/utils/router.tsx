import {createBrowserRouter, Navigate} from "react-router-dom";
import ProtectedRoute from "../ui/ProtectedRoute";
import AppLayout from "../ui/AppLayout";
import Dashboard from "../pages/Dashboard";
import Settings from "../pages/Settings";
import Users from "../pages/Users";
import PageNotFound from "../pages/PageNotFound";
import Login from "../pages/Login";
import Anisas from "../pages/Anisas";
import ClientPage from "../pages/ClientPage.tsx";
import AnisasDetails from "../features/anisa/AnisasDetails.tsx";
import Logs from "../pages/Logs.tsx";
import Clients from "../pages/Clients.tsx";
import Order from "../pages/Order.tsx";
import OrderDetails from "../features/order/OrderDetails.tsx";

export const route = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute/>,
        children: [
            {
                path: "/",
                element: <AppLayout/>,
                children: [
                    {
                        index: true,
                        element: <Navigate replace to="dashboard"/>,
                    },
                    {
                        path: "/dashboard",
                        element: <Dashboard/>,
                    },
                    {
                        path: "/order",
                        element: <Order/>,
                    },
                    {
                        path: "/order/details",
                        element: <OrderDetails/>,
                    },
                    {
                        path: "/anisas",
                        element: <Anisas/>,
                    },
                    {
                        path: "/anisas/details",
                        element: <AnisasDetails/>,
                    },
                    {
                        path: "/client",
                        element: <Clients/>,
                    },
                    {
                        path: "/client/details",
                        element: <ClientPage/>,
                    },
                    {
                        path: "/moderators",
                        element: <Users/>,
                    },
                    {
                        path: "/settings",
                        element: <Settings/>,
                    },
                    {
                        path: "/audit-logs",
                        element: <Logs/>,
                    },
                ],
            },
        ],
    },
    {
        path: "/login",
        element: <Login/>,
    },
    {
        path: "*",
        element: <PageNotFound/>,
    },
]);
