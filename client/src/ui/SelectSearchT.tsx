import styled from "styled-components";
import Select from "react-dropdown-select";
import { FieldValues, Path, PathValue, UseFormSetValue } from "react-hook-form";

// const StyledParagraph = styled.p`
//   display: inline-block;
//   max-width: 200px;
//   overflow: hidden;
//   white-space: nowrap;
//   text-overflow: ellipsis;
// `;

const StyledSelect = styled(Select)`
  border: 1px solid var(--color-grey-300) !important;
  background-color: var(--color-grey-0) !important;
  border-radius: var(--border-radius-sm) !important;
  box-shadow: var(--shadow-sm) !important;
  padding: 1.2rem 1.6rem !important;
  width: 100% !important;
  min-height: 50px !important;

  .react-dropdown-select-clear,
  .react-dropdown-select-dropdown-handle {
    color: var(--color-grey-900) !important;
  }

  .react-dropdown-select-option {
    border: 1px solid var(--color-grey-900) !important;
  }

  .react-dropdown-select-item {
    color: var(--color-grey-900) !important;
    padding: 1rem;
  }

  //.react-dropdown-select-content > span {
  //    white-space: nowrap;
  //    overflow: hidden;
  //    text-overflow: ellipsis;
  //    width: fit-content;
  //}

  .react-dropdown-select-input {
    color: var(--color-grey-900) !important;
    max-height: 50px !important;
    /* Prevent input from expanding too much */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%; /* You can adjust this */
  }

  .react-dropdown-select-dropdown {
    width: 100%;
    z-index: 999;
    border: 1px solid var(--color-grey-300);
    padding: 0;
    border-radius: 2px;
    max-height: 350px;
    background-color: var(--color-grey-0);
    box-shadow: none;
  }

  .react-dropdown-select-item {
    color: #f2f2f2;
    border: none !important;

    :hover {
      color: var(--color-grey-900) !important;
    }
  }

  .react-dropdown-select-item.react-dropdown-select-item-selected,
  .react-dropdown-select-item.react-dropdown-select-item-active {
    background-color: var(--color-blue-100) !important;
    border-bottom: 1px solid var(--color-grey-300);
    color: var(--color-grey-900) !important;
    font-weight: bold;
  }

  .react-dropdown-select-item.react-dropdown-select-item-disabled {
    background: var(--color-grey-300);
    color: var(--color-grey-900) !important;
  }
`;

const SelectSearch = <
  T extends Record<string, any>,
  FormValues extends FieldValues
>({
  options,
  fieldName,
  defaultValue = null,
  valueField,
  labelField,
  setValues,
  onChange,
  disabled,
  multi = false,
}: {
  options: T[];
  fieldName: Path<FormValues>;
  defaultValue?: T | null;
  valueField: keyof T;
  labelField: keyof T;
  setValues?: UseFormSetValue<FormValues>;
  onChange?: (value: T | null) => void;
  disabled: boolean;
  multi?: boolean;
}) => {
  return (
    <StyledSelect
      multi={multi}
      options={options}
      values={defaultValue ? [defaultValue] : []}
      valueField={valueField as string}
      labelField={labelField as string}
      dropdownGap={0}
      closeOnSelect
      disabled={disabled}
      searchBy={labelField as string}
      onChange={(values) => {
        if (setValues && values.length > 0) {
          const selectedValue = (values[0] as T)?.[valueField] || "";
          setValues(
            fieldName,
            selectedValue as PathValue<FormValues, typeof fieldName>
          );
        }
        onChange?.(values[0] as T | null);
      }}
    />
  );
};
export default SelectSearch;
