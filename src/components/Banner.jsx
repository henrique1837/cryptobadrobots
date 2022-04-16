import React from 'react'
import styled from "styled-components";
import { Container, TextTitle, TextDescription } from "../styles/globalStyles"

const BannerContainer = styled(Container)`
  @media (min-width: 767px) {
    padding: 2rem;
  }
`;

export default function Banner({ title, subtitle }) {
  return <>
    <Container ai="center">
      <TextTitle>{title}</TextTitle>
      <TextDescription
        style={{
          textAlign: "center",
          color: "var(--primary-text)",
        }}
      >
        {subtitle}
      </TextDescription >
    </Container>
    <BannerContainer ai="flex-center">
      <center>
        <img src="/config/images/images.gif" alt="" style={{borderRadius: "25px",width: "250px"}} />
      </center>
    </BannerContainer>
  </>
}
