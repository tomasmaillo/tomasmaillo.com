import styled from "styled-components";

const Gap = styled.div<{ height: string }>`
  height: ${({ height }) => height};
  transition: 0.5s;
`;
export default Gap;
