import React from 'react'
import styled from 'styled-components';
import { Container, TextTitle } from "../styles/globalStyles"
import { ReactComponent as TwitterIcon } from '../assets/icons/twitter.svg'
import { ReactComponent as TelegramIcon } from '../assets/icons/icons8-telegram-app.svg';

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
      <img alt={"cryptobadrobots"} src={"/config/images/cryptobadrobots_logo.png"} style={{width: '250px'}}/>
    </center>
    <BottomContainer fd="row">
      <SocialMediaLink href="https://twitter.com/Cryopotbadrobot"><TwitterIcon /></SocialMediaLink>
      <SocialMediaLink href="https://t.me/cryptobadrobots"><TelegramIcon /></SocialMediaLink>
    </BottomContainer>
  </Container>
  )
}
