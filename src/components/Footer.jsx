import React from 'react'
import styled from 'styled-components';
import { Container, TextTitle } from "../styles/globalStyles"
import { ReactComponent as TwitterIcon } from '../assets/icons/twitter.svg'
import { ReactComponent as InstagramIcon } from '../assets/icons/instagram.svg'


const BottomContainer = styled(Container)`
  padding: 1rem;
  justify-content: center;
`;

const SocialMediaLink = styled('a').attrs({
  target: "_blank",
  rel: "noopener noreferrer"
})`
  margin: 2rem;
`;

export default function Footer() {
  return <Container jc="center" ai="center">
  <TextTitle
    style={{
      textAlign: "center",
      color: "var(--primary-text)",
      borderBottom: "1px solid var(--primary-text)",
      minWidth: "75%",
      padding: "2rem"
    }}
  >
    Crypto Bad Robots
  </TextTitle>
  <BottomContainer fd="row">
    <SocialMediaLink href="https://twitter.com/"><TwitterIcon /></SocialMediaLink>
    <SocialMediaLink href="https://www.instagram.com/"><InstagramIcon /></SocialMediaLink>
  </BottomContainer>
</Container>
}
