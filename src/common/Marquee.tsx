import { FC } from "react";
import styled from "styled-components";

const ScrollLeftWrapper = styled.div`
  max-width: 100%;
  overflow: hidden;
  transform: skewY(-5deg);
  position: relative;
  padding-top: 1rem;
`;
const StyledMarquee = styled.div`
  white-space: nowrap;
  overflow: hidden;
  display: inline-block;
  animation: marquee 10s linear infinite;
  color: white;
  font-size: 4rem;
  font-family: "Fugaz One", cursive;

  > p {
    padding-left: 20px;
    margin: 0px;
    display: inline-block;
  }

  @keyframes marquee {
    0% {
      transform: translate3d(0, 0, 0);
    }
    100% {
      transform: translate3d(-50%, 0, 0);
    }
  }
`;

interface MarqueeProps {
  text: string;
}
const Marquee: FC<MarqueeProps> = ({ text }) => {
  return (
    <ScrollLeftWrapper>
      <StyledMarquee>
        <p>{text}</p>
        <p>{text}</p>
      </StyledMarquee>
    </ScrollLeftWrapper>
  );
};

export default Marquee;
