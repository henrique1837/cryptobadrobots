import React from 'react'
import { Container, ResponsiveWrapper, Screen, TextDescription, TextTitle } from "../styles/globalStyles"

export default function About() {
  return <Screen id="project" >
  <ResponsiveWrapper
    style={{
      textAlign: "left",
      color: "var(--primary-text)",
      padding: 24
    }}
    flex={1}
  >
    <Container flex={1} style={{ margin: 'auto'}}>
      <TextTitle>
        About
      </TextTitle>
      <TextDescription>
        <p>Buy your robot and be bad! Crypto Bad Robots!!!! You never forget them cause they will be part of your nightmares!</p>
        <p>Bad Robot Bad Robot Bad Crypto Robot!</p>
      </TextDescription>
    </Container>
    <Container flex={1} ai="end" style={{ margin: 'auto'}}>
      <center>
        <img alt={"example"} src={"/config/images/cryptobadrobots_logo.png"} style={{width: '100%'}}/>
      </center>
    </Container>
  </ResponsiveWrapper>

</Screen>
}
