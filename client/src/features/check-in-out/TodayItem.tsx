import styled, {css} from "styled-components";
import {auditLog, TagType} from "../../types/types.ts";

interface TagProps {
    $type: TagType;
}

const ActionTag = styled.span<TagProps>`
    width: fit-content;
    text-transform: uppercase;
    font-size: 1.1rem;
    font-weight: 600;
    padding: 0.4rem 1.2rem;

    ${({$type}) =>
            css`
                color: ${$type === "red"
                        ? `var(--color-red-100)`
                        : `var(--color-${$type}-700)`};
                background-color: ${$type === "red"
                        ? `var(--color-red-700)`
                        : `var(--color-${$type}-100)`};
            `}
`;

const StyledTodayItem = styled.li`
    display: grid;
    grid-template-columns: 10rem auto;
    gap: 1.2rem;
    align-items: center;

    font-size: 1.4rem;
    padding: 0.8rem 0;
    border-bottom: 1px solid var(--color-grey-100);

    &:first-child {
        border-top: 1px solid var(--color-grey-100);
    }
`;

const ActionColor: { [key: string]: TagType } = {
    Accept: "green",
    DELETE: "red",
    CREATE: "green",
    UPDATE: "blue",
};


const TodayItem = ({stay}: { stay: auditLog }) => {
    return (
        <StyledTodayItem>
            <ActionTag $type={ActionColor[stay.actionType]}>{stay.actionType}</ActionTag>
            <p>{stay?.actionText}</p>
        </StyledTodayItem>
    );
};

export default TodayItem;
