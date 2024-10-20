import styled, { css } from "styled-components";

interface FormProps {
  type?: "modal" | "regular";
}

const Form = styled.form<FormProps>`
  ${(props) =>
    props.type === "regular" &&
    css`
      padding: 2.4rem 4rem;

      /* Box */
      background-color: var(--color-grey-0);
      border: 1px solid var(--color-grey-100);
      border-radius: var(--border-radius-md);
    `}
  & .Form {
    background-color: var(--color-grey-0);
    padding: 2.4rem 4rem;
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-md);
  }
  & .name {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  ${(props) =>
    props.type === "modal" &&
    css`
      width: 90rem;
    `}
  overflow-y: auto;
  max-height: 70vh;
  font-size: 1.4rem;
`;

Form.defaultProps = {
  type: "regular",
};

export default Form;
