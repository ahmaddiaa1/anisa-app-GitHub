import styled from "styled-components";
import Select from "react-dropdown-select";
import { FieldValues, Path, PathValue, UseFormSetValue } from "react-hook-form";

const StyledSelect = styled(Select)`
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  padding: 10rem 1.2rem;

  .react-dropdown-select-clear,
  .react-dropdown-select-dropdown-handle {
    color: #fff !important;
  }

  .react-dropdown-select-item {
    text-align: left;
    font-size: 1.6rem;
  }

  .react-dropdown-select-dropdown {
    border-radius: 10px;
    border: 1px solid var(--color-grey-400);
    background-color: var(--color-grey-0);
    box-shadow: none;
    color: var(--color-grey-700) !important;
  }

  .react-dropdown-select-item {
    color: var(--color-grey-700);
    border-bottom: 1px solid #333;

    :hover {
      color: #ffffff80;
    }
  }

  .react-dropdown-select-item.react-dropdown-select-item-selected,
  .react-dropdown-select-item.react-dropdown-select-item-active {
    border-bottom: 1px solid #333;
    font-weight: bold;
  }

  .react-dropdown-select-item.react-dropdown-select-item-disabled {
    background: #777;
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
}: {
  options: T[];
  fieldName: Path<FormValues>;
  defaultValue?: T | null;
  valueField: keyof T;
  labelField: keyof T;
  setValues?: UseFormSetValue<FormValues>;
  onChange?: (value: T | null) => void;
}) => {
  return (
    <StyledSelect
      options={options}
      values={defaultValue ? [defaultValue] : []}
      valueField={valueField as string}
      labelField={labelField as string}
      dropdownGap={0}
      dropdownPosition="auto"
      closeOnSelect
      style={{
        border: "1px solid var(--color-grey-300)",
        background: "var(--color-grey-0)",
        borderRadius: "var(--border-radius-sm)",
        boxShadow: "var(--shadow-sm)",
        padding: "1.2rem 1.6rem",
        width: "100%",
      }}
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
      // contentRenderer={({ state }) => {
      //   const truncateAfterWords = (text: string, wordLimit: number) => {
      //     const words = text.split(" ");
      //     return words.length > wordLimit
      //       ? words.slice(0, wordLimit).join(" ") + "..."
      //       : text;
      //   };
      //   // Ensure that selected values are correctly handled
      //   const selectedValue =
      //     state.values.length > 0 ? (state.values[0] as T)?.[labelField] : null;

      //   return (
      //     <StyledParagraph>
      //       {selectedValue
      //         ? truncateAfterWords(String(selectedValue), 3)
      //         : "Select Option ..."}
      //     </StyledParagraph>
      //   );
      // }}
    />
  );
};

export default SelectSearch;
