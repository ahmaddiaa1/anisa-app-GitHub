import styled from "styled-components";

const P = styled.p`
  font-size: 1.6rem;
  font-weight: 500;
  text-align: center;
  margin: 2.4rem 0;
`;

function Empty({ resourceName }: { resourceName: string }) {
  return <P>No {resourceName} could be found.</P>;
}

export default Empty;
