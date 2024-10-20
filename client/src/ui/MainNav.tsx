import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { RefObject } from "react";

import { MainNavList } from "../assets/mapLists";
import { useUser } from "../hooks/users/useUser.ts";

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;
const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.2rem;

    color: var(--color-grey-600);
    font-size: 1.6rem;
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    transition: all 0.3s;
  }

  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-800);
    background-color: var(--color-grey-50);
    border-radius: var(--border-radius-sm);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-600);
  }
`;

function MainNav({ ref }: { ref: RefObject<HTMLUListElement> | null }) {
  const { role: userRole } = useUser();

  return (
    <NavList ref={ref}>
      {MainNavList.map(
        (item) =>
          !item.role.includes(userRole) && (
            <li key={item.id}>
              <StyledNavLink to={item.path}>
                {item.icon}
                <span>{item.name}</span>
              </StyledNavLink>
            </li>
          )
      )}
    </NavList>
  );
}

export default MainNav;
