import styled from "styled-components";
import LoginForm from "../features/authentication/LoginForm.tsx";
import Logo from "../ui/Logo.tsx";
import Heading from "../ui/Heading.tsx";
import { useUser } from "../hooks/users/useUser.ts";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LoginLayout = styled.main`
  height: 100svh;
  display: grid;
  flex-direction: column;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-50);
  @media (max-width: 768px) {
    grid-template-columns: 40rem;
  }
`;

function Login() {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && location.pathname === "/login") {
      navigate("/dashboard");
    }
  }, [user, location, navigate]);

  return (
    <LoginLayout>
      <Logo />
      <Heading as="h4">Login to your account.</Heading>
      <LoginForm />
    </LoginLayout>
  );
}

export default Login;
