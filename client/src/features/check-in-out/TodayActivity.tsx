import styled from "styled-components";

import Heading from "../../ui/Heading";
import Row from "../../ui/Row";

import TodayItem from "./TodayItem.tsx";
import {isToday} from "date-fns";
import {auditLog} from "../../types/types.ts";

const StyledToday = styled.div`

    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-md);
    display: flex;
    flex-direction: column;
    gap: 2.4rem;
    grid-column: 1 / span 3;
    padding: 2.4rem 3.2rem 3.2rem;
`;

const TodayList = styled.ul`
    overflow: scroll;
    overflow-x: hidden;

    &::-webkit-scrollbar {
        width: 0 !important;
    }

    scrollbar-width: none;
    -ms-overflow-style: none;
`;

const NoActivity = styled.p`
    text-align: center;
    font-size: 1.8rem;
    font-weight: 500;
    margin-top: 0.8rem;
`;

function Today({logs}: { logs: auditLog[] }) {
    

    const filter = logs.filter((log: auditLog) => isToday(log.createdAt));
    return (
        <StyledToday>
            <Row type="horizontal">
                <Heading as="h2">Today</Heading>
            </Row>
            {filter?.length ? (
                <TodayList>
                    {logs.map((log: auditLog) => (
                        <TodayItem key={log.id} stay={log}/>
                    ))}
                </TodayList>
            ) : (
                <NoActivity>No activity today...</NoActivity>
            )}
        </StyledToday>
    );
}

export default Today;
