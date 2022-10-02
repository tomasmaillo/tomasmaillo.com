import { useState, useEffect } from "react";
import styled from "styled-components";

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
  max-width: 50em;
  margin: 0 auto;
  padding: 5rem 2rem;
  position: relative;

  > h1 {
    font-size: 3rem;
  }
`;

const Diagonal = () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }, []);

  return (
    <DiagonalBox>
      <Content>
        <h1>Contact me :D</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
          consectetur, nisl nec ultricies lacinia, nisl nisl aliquet nisl, nec
          tincidunt nisl nisl sit amet nisl. Nulla facilisi. Nulla facilisi.
          Pellentesque habitant morbi tristique senectus et netus et malesuada
        </p>
      </Content>
    </DiagonalBox>
  );
};

export default Diagonal;
