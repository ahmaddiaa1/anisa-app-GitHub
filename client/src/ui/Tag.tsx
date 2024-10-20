import styled, { css } from "styled-components";
import { TagType } from "../types/types.ts";

interface TagProps {
  $type: TagType;
}

const Tag = styled.span<TagProps>`
  width: fit-content;
  text-transform: uppercase;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.4rem 1.2rem;
  border-radius: 100px;

  ${({ $type }) =>
    $type === "red"
      ? css`
          color: white;
          background-color: #ce1c1c8b;
        `
      : css`
          color: var(--color-${$type}-700);
          background-color: var(--color-${$type}-100);
        `}/* Make these dynamic, based on the received prop */
`;

export default Tag;
