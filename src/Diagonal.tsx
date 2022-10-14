import { useState, useEffect } from "react";
import styled from "styled-components";
import Marquee from "./common/Marquee";
import { SMALL_SCREEN_WIDTH_PX } from "./helpers";

const DiagonalBox = styled.div`
  position: relative;
  height: 50rem;

  &::before {
    content: "";

    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-image: linear-gradient(45deg, #3787dc, #8440c0);
    transform: skewY(-5deg);
  }
`;

const Content = styled.div`
  color: #e4e4e4;
  position: relative;
  max-width: 50em;
  margin: 0 auto;
  padding: 3rem 2rem;

  @media (max-width: ${SMALL_SCREEN_WIDTH_PX}) {
    padding: 0.5rem 2rem;
  }
`;

const FakeLink = styled.div`
  text-decoration: underline;
  cursor: pointer;
  margin-bottom: 10px;
`;

const Diagonal = () => {
  const [showFakeLinkExplanation, setShowFakeLinkExplanation] = useState(false);
  return (
    <DiagonalBox>
      <Marquee
        text={"CONTACT ME :D REACH OUT & SEND A LIL MSG? I WONT BITE! "}
      />
      <Content>
        <p>
          Reach out for anything! Ask any questions you may have or tell me what
          you think about this site. <br />
          Or uuuuh just say hi :D
        </p>

        <FakeLink onClick={() => setShowFakeLinkExplanation(true)}>
          Instagram {showFakeLinkExplanation && " not!"}
        </FakeLink>
        <FakeLink onClick={() => setShowFakeLinkExplanation(true)}>
          Email {showFakeLinkExplanation && " not!"}
        </FakeLink>

        {showFakeLinkExplanation && (
          <p>
            Ha! Gottcha <br />
            These links are fake, they don't do anything :P <br />
            Jeez im so funny. Anyways, you can use the ones at the top of the
            page to reach out to me. (please do!)
          </p>
        )}
      </Content>
    </DiagonalBox>
  );
};

export default Diagonal;
