import { useUser } from "../hooks/users/useUser.ts";
import Spinner from "./Spinner.tsx";
import styled from "styled-components";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const FullPage = styled.div`
  height: 100svh;
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProtectedRoute = () => {
  const navigate = useNavigate();
  // 1. Load the authentication user
  const { isPending, user } = useUser();

  // 2. If the user is not authenticated, redirect to the login page
  useEffect(() => {
    if (!user && !isPending) {
      navigate("/login");
    }
  }, [user, navigate, isPending]);

  // 3. While loading, show a loading spinner
  if (isPending)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  // 4. If the user is authenticated, render the App
  if (user) return <Outlet />;
};

export default ProtectedRoute;
