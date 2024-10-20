import styled from "styled-components";
import Logout from "../features/authentication/Logout.tsx";
import DarkModeToggle from "./DarkModeToggle.tsx";

const StyledHeaderMenu = styled.ul`
    display: flex;
    gap: 0.4rem;
`;

const HeaderMenu = () => {

    return (
        <StyledHeaderMenu>
            <li>
                <DarkModeToggle/>
            </li>
            <li>
                <Logout/>
            </li>
        </StyledHeaderMenu>
    );
};

export default HeaderMenu;
