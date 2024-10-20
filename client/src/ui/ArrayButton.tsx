import styled from "styled-components";

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: flex-end;
`;
export const RemoveButton = styled.div`
  background-color: var(--color-red-700);
  cursor: pointer;
  font-size: 1.4rem;
  padding: 0.8rem 1.6rem;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  color: white;
`;
export const AddButton = styled.div`
  background-color: var(--color-brand-600);
  cursor: pointer;
  font-size: 1.4rem;
  padding: 0.8rem 1.6rem;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  color: white;
`;
