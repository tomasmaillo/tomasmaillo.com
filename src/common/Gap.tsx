import styled from "styled-components";

const Gap = styled.div<{ height: string }>`
  height: ${({ height }) => height};
`;
export default Gap;
