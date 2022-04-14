import React from 'react'
import styled from 'styled-components';
import {Container, ResponsiveWrapper, SpacerLarge, TextDescription, TextTitle}from '../styles/globalStyles'

const Avatar = styled('div')`
    background-image: url(${props => props.src});
    background-size: cover;
    background-position: top center;
    border-radius: 50%;
    height: 12rem;
    width: 12rem;
    margin: auto;
`;


const NFT = ({img,name}) => (
  <div flex={1} style={{ paddingBottom: '2rem', marginLeft: '1rem', marginRight: '1rem' }} >
    <Avatar alt={name} src={img} />
    <TextDescription
      style={{
        textAlign: "center",
        color: "var(--primary-text)",
      }}
    >
      {name}
    </TextDescription >
  </div>
)

export default function NFTs({nfts,title}) {
  return (
    <Container id="nfts" jc="center" ai="center">
      <TextTitle
        style={{
          textAlign: "center",
          color: "var(--primary-text)",
          paddingTop: "2rem",
        }}
      >
        {title}
      </TextTitle>
      <SpacerLarge />
      <ResponsiveWrapper style={{justifyContent: 'center'}} flex={1}>
        {nfts.map(({img, name}) => <NFT key={`team-member-${name}`} {...{img, name}} />)}
      </ResponsiveWrapper>
    </Container>
  )
}
