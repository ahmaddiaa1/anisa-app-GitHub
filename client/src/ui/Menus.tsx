import styled from "styled-components";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { HiEllipsisVertical } from "react-icons/hi2";
import { createPortal } from "react-dom";
import { useOutsideClick } from "../hooks/useOutsideClick.ts";

interface Position {
  x: number;
  y: number;
}

interface MenusProps {
  $position: Position;
}

interface MenusContextType {
  openId: string;
  closeMenu: () => void;
  openMenu: (id: string) => void;
  position: Position | null;
  setPosition: Dispatch<SetStateAction<Position | null>>;
}

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  //position: relative;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul<MenusProps>`
  position: absolute;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.$position.x}px;
  top: ${(props) => props.$position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

const MenusContext = createContext<MenusContextType>({
  openId: "",
  closeMenu: () => {},
  openMenu: () => {},
  position: null,
  setPosition: () => {},
});

function Menus({ children }: { children: React.ReactNode }) {
  const [openId, setOpenId] = useState("");
  const [position, setPosition] = useState<Position | null>(null);

  const closeMenu = () => setOpenId("");
  const openMenu = (id: string) => setOpenId(id);

  return (
    <MenusContext.Provider
      value={{ openId, closeMenu, openMenu, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}

function Toggle({ id }: { id: string }) {
  const { openId, openMenu, closeMenu, setPosition } = useContext(MenusContext);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    const button = e.target as HTMLElement;
    const closestButton = button.closest("button");
    const rect = closestButton?.getBoundingClientRect();

    setPosition({
      x: window.innerWidth - (rect?.width ?? 0) - (rect?.x ?? 0),
      y: (rect?.y ?? 0) + (rect?.height ?? 0) + 8,
    });

    openId === "" || openId !== id ? openMenu(id) : closeMenu();
  }

  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

function List({ id, children }: { id: string; children: React.ReactNode }) {
  const { openId, position, closeMenu } = useContext(MenusContext);
  const ref = useOutsideClick<HTMLUListElement>(closeMenu, false);

  if (openId !== id || !position) return null;

  return createPortal(
    <StyledList $position={position} ref={ref}>
      {children}
    </StyledList>,
    document.body,
  );
}

function Button({
  children,
  icon,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const { closeMenu } = useContext(MenusContext);

  function handleClick() {
    onClick?.();
    closeMenu();
  }

  return (
    <li>
      <StyledButton onClick={handleClick} disabled={disabled}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
