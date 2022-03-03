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
  return(
  <Container jc="center" ai="center">
    <center>
      <img alt={"example"} src={"/config/images/cryptobadrobots.png"} style={{width: '15%'}}/>
    </center>
    <BottomContainer fd="row">
      <SocialMediaLink href="https://twitter.com/"><TwitterIcon /></SocialMediaLink>
      <SocialMediaLink href="https://www.instagram.com/"><InstagramIcon /></SocialMediaLink>
    </BottomContainer>
  </Container>
  )
}
