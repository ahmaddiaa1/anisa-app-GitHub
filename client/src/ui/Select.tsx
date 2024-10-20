import styled from "styled-components";

interface SelectProps {
  $type?: "white" | "grey";
}

interface Option {
  value: string;
  label: string;
}

const StyledSelect = styled.select<SelectProps>`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.$type === "white"
        ? "var(--color-grey-100)"
        : "var(--color-grey-300)"};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

const Select = ({
  options,
  onChange,
  ...props
}: {
  options: Option[];
  value?: string;
  $type?: "white" | "grey";
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
  return (
    <StyledSelect {...props} onChange={onChange}>
      {options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  );
};

export default Select;
