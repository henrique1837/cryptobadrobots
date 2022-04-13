import React,{useState,useEffect} from "react";

import useConfig from "./hooks/config";
import useClient from "./hooks/useGraphClient";
import useWeb3Modal from "./hooks/useWeb3Modal";
import useContract from "./hooks/useContract";


import Menu from "./components/Menu";
import Banner from "./components/Banner";
import MintComponent from "./components/MintComponent";
import * as s from "./styles/globalStyles";
import Team from "./components/Team";
import NFTs from "./components/NFTs";

import Footer from "./components/Footer";
import About from "./components/About";


function App() {
  const CONFIG = useConfig();
  const {client,initiateClient,contractAddress,getNftsFrom,getLastNfts} = useClient();
  const {provider,coinbase,netId,loadWeb3Modal} = useWeb3Modal();
  const {contract} = useContract();
  const [nfts,setNFTs] = useState();
  const [myNfts,setMyNFTs] = useState();



  const getMetadata = item => {
    return(
      new Promise(async (resolve,reject) => {
        try {
          let uri;
          let tokenURI;
          const contractAddress = item.id.split("/")[0];
          //ERC1155
          if(item.token){
            tokenURI = item.token.uri;
          } else {
            tokenURI = item.uri;
          }
          if(!tokenURI){
            resolve({});
          }
          if(!tokenURI.includes("://")){
              uri = `https://ipfs.io/ipfs/${tokenURI}`;
          } else if(tokenURI.includes("ipfs://") && !tokenURI.includes("https://ipfs.io/ipfs/")){
            uri = tokenURI.replace("ipfs://","https://ipfs.io/ipfs/");
          } else {
            uri = tokenURI
          }
          let metadataToken = JSON.parse(await (await fetch(uri)).text());
          resolve({
            img: metadataToken.image.replace('ipfs://',"https://ipfs.io/ipfs/"),
            name: metadataToken.name,
            owner: item.owner
          })
        } catch(err){
          resolve({});
        }
      })
    )
  }


  useEffect(() => {
    initiateClient(netId);
  },[netId]);

  useEffect(() => {
    if(contract && coinbase){
      const filter = contract.filters.Transfer("0x0000000000000000000000000000000000000000",null,null);
      const res = contract.on(filter, async (from,to,tokenId) => {
        await getLastNfts();
        await getNftsFrom(coinbase)
      });

    }
  },[contract,coinbase])

  useEffect(() => {
    if(client && contractAddress){
      getLastNfts().
        then(async results => {
          console.log(results)
          const erc721Tokens = results.data.erc721Tokens;
          const promises = erc721Tokens.map(getMetadata);
          const newNfts = await Promise.all(promises);
          setNFTs(newNfts);
        });
    }
  },[client,contractAddress])

  useEffect(() => {
    if(coinbase && client && contractAddress){
      getNftsFrom(coinbase).
        then(async results => {
          console.log(results)
          const erc721Tokens = results.data.erc721Tokens;
          const promises = erc721Tokens.map(getMetadata);
          const newMyNfts = await Promise.all(promises);
          setMyNFTs(newMyNfts);
        });
    }
  },[coinbase,client,contractAddress])

  return (
      <s.Container
        style={{ padding: 24, backgroundColor: "grey" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}

      >
        <Menu links={[
          {href: '#mint', label: "Mint"},
          {href: '#project', label: "The Project"},
          {href: '#team', label: "Team"},
        ]}/>


        <s.SpacerSmall />

        <Banner title={<s.StyledLogo  ai='flex-center' src="/config/images/logo_complete.png"/>} subtitle={`Smart Contract address: ${contract?.address}`} />

        <s.SpacerMedium />
        <s.Container jc="center" ai="center">
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            <p>The badest robots of Boba network!</p>
            <p>Check minted NFTs at <a href={CONFIG.MARKETPLACE_LINK} rel="noreferrer" style={{color:'darkgrey'}} target="_blank">{CONFIG.MARKETPLACE}</a></p>

          </s.TextDescription>
        </s.Container>

        <MintComponent
          loadWeb3Modal={loadWeb3Modal}
          coinbase={coinbase}
          provider={provider}
          contract={contract}
          getNftsFrom={getNftsFrom}
          getLastNfts={getLastNfts}
        />

        {
          myNfts?.length > 0 &&
          <NFTs nfts={myNfts} title={"Latest 5 BadRobots owned by You"} />
        }


        <s.SpacerMedium />

        <About/>

        <s.SpacerSmall/>
        {
          nfts?.length > 0 &&
          <NFTs nfts={nfts} title={"Latest 5 BadRobots Minted"} />
        }


        <s.SpacerLarge/>
        <center>
          <img alt={"example"} src={"/config/images/cryptobadrobots.png"} style={{width: '15%'}}/>
        </center>
        <s.SpacerSmall/>
        <Team members={[
          { img: "/config/images/11.png", name: 'BongBoy'},
          { img: "/config/images/12.png", name: 'BongMarlina'},
          { img: "/config/images/13.png", name: 'Marola'},
          { img: "/config/images/14.png", name: 'Maruca'},
        ]} />

        <s.SpacerMedium />
        <Footer />
      </s.Container>
  );
}

export default App;
