import styled, { css } from "styled-components";

interface InputProps {
  size?: "small" | "medium" | "large";
}

const sizes = {
  small: css`
    padding: 0.8rem 1.2rem;
    max-width: 50px;
  `,
  medium: css`
    padding: 0.8rem 1.4rem;
    max-width: 150px;
  `,
  large: css`
    padding: 1.2rem 1.6rem;
    width: 100%;
  `,
};

const Input = styled.input<InputProps>`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  ${(props) => sizes[props.size || "large"]}
`;

export default Input;
