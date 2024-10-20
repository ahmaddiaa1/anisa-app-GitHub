import {FieldArrayWithId, UseFieldArrayAppend} from "react-hook-form";
import styled from "styled-components";
import {Address, anisaData} from "../types/anisaTypes";

const AddressStyledFormRow = styled.div`
    display: grid;
    align-items: center;
    grid-template-columns: 24rem 1fr 1.2fr 10rem;
    gap: 2.4rem;
    padding: 1.2rem 0 10px;

    &:first-child {
        padding-top: 0;
    }

    &:last-child {
        padding-bottom: 0;
    }

    &:not(:last-child) {
        border-bottom: 1px solid var(--color-grey-100);
    }

    &:has(button) {
        display: flex;
        justify-content: flex-end;
        gap: 1.2rem;
    }
`;

const Label = styled.label`
    font-weight: 500;
    padding-left: 4.4rem;
`;

const Error = styled.span`
    font-size: 1.4rem;
    color: var(--color-red-700);
`;
const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: flex-end;
    padding-right: 4.4rem;
`;
const RemoveButton = styled.div`
    background-color: var(--color-red-700);
    cursor: pointer;
    font-size: 1.4rem;
    padding: 0.8rem 1.6rem;
    border-radius: var(--border-radius-sm);
    font-weight: 500;
    color: white;
`;
const AddButton = styled.div`
    background-color: var(--color-brand-600);
    cursor: pointer;
    font-size: 1.4rem;
    padding: 0.8rem 1.6rem;
    border-radius: var(--border-radius-sm);
    font-weight: 500;
    color: white;
`;

function FormRow({
                     label,
                     error,
                     children,
                     onRemoveClick,
                     appendAddress,
                     index,
                     addressFields,
                 }: {
    label?: string;
    error?: string | undefined;
    children: any;
    onRemoveClick: () => void;
    appendAddress: UseFieldArrayAppend<anisaData, "address">;
    index?: number;
    addressFields: FieldArrayWithId<anisaData, "address", "id">[];
}) {
    return (
        <AddressStyledFormRow>
            {label && <Label>{label}</Label>}
            {children}
            {<Error>{error}</Error>}
            <ButtonGroup>
                <RemoveButton role="button" onClick={onRemoveClick}>
                    Remove
                </RemoveButton>
                {index === addressFields.length - 1 && (
                    <AddButton
                        role="button"
                        onClick={() => appendAddress("" as unknown as Address)}
                    >
                        Add
                    </AddButton>
                )}
            </ButtonGroup>
        </AddressStyledFormRow>
    );
}

export default FormRow;
