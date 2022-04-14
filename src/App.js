import React,{useState,useEffect} from "react";
import { ethers } from "ethers";

import useConfig from "./hooks/config";
import useClient from "./hooks/useGraphClient";
import useWeb3Modal from "./hooks/useWeb3Modal";


import { addresses, abis } from "./contracts";


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
  const [contract,setContract] = useState();
  const [nfts,setNFTs] = useState();
  const [myNfts,setMyNFTs] = useState();



  const getMetadata = item => {
    return(
      new Promise(async (resolve,reject) => {
        try {
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
          const uri = tokenURI.replace("ipfs://","https://ipfs.io/ipfs/");
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

  const getLastNftsMetadatas = async (address) => {
    let results;
    if(address){
      results = await getNftsFrom(coinbase);
    } else {
      results = await getLastNfts();
    }
    console.log(results)
    const erc721Tokens = results.data.erc721Transfers;
    const promises = erc721Tokens.map(getMetadata);
    const newNfts = await Promise.all(promises);
    if(address){
      setMyNFTs(newNfts)
    } else {
      setNFTs(newNfts);
    }
  }


  useEffect(() => {
    if(netId === 4){
      setContract(new ethers.Contract(addresses.nft.rinkeby,abis.nftAbi,provider))
    } else if(netId === 28) {
      setContract(new ethers.Contract(addresses.nft.rinkeby_boba,abis.nftAbi,provider))
    } /*else if(netId === 137) {
      setContract();
    }*/ else {
      setContract();
      setNFTs();
      setMyNFTs();
      return;
    }

    setNFTs();
    setMyNFTs();
    initiateClient(netId);
  },[netId]);


  useEffect(() => {
    if(client && contractAddress){
      getLastNftsMetadatas();
    }
  },[client,contractAddress])

  useEffect(() => {
    if(coinbase && client && contractAddress){
      getLastNftsMetadatas(coinbase)
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

        <Banner title={<s.StyledLogo  ai='flex-center' src="/config/images/logo_complete.png"/>}
                subtitle={
                  contract &&
                  <>Smart Contract address: <s.StyledLink target="_blank" href={
                    netId === 4 ?
                    `${CONFIG.SCAN_LINK_RINKEBY}/${contract.address}`:
                    netId === 28 ?
                    `${CONFIG.SCAN_LINK_BOBA_RINKEBY}/${contract.address}`:
                    `${CONFIG.SCAN_LINK}/${contract.address}`
                  }>{contract.address}</s.StyledLink></>}
                   />

        <s.SpacerMedium />
        <s.Container jc="center" ai="center"
        style={{
          textAlign: "center",
          color: "var(--primary-text)",
        }}>

            <p>The badest robots of {
              netId === 4 ?
              "Rinkeby" :
              netId === 28 ?
              "Boba Rinkeby" :
              "Polygon"
            } network!</p>
            <p>Check minted NFTs at <a href={
              `${netId === 4 ?
               CONFIG.MARKETPLACE_LINK_RINKEBY :
               netId === 28 ?
               CONFIG.MARKETPLACE_LINK_BOBA_RINKEBY :
               CONFIG.MARKETPLACE_LINK}/${contract?.address}`
             } rel="noreferrer" style={{color:'darkgrey'}} target="_blank">{
               `${netId === 4 ?
                CONFIG.MARKETPLACE_RINKEBY :
                netId === 28 ?
                CONFIG.MARKETPLACE_BOBA_RINKEBY :
                CONFIG.MARKETPLACE}`
             }</a></p>

        </s.Container>

        <MintComponent
          loadWeb3Modal={loadWeb3Modal}
          coinbase={coinbase}
          netId={netId}
          provider={provider}
          contract={contract}
          getNftsFrom={getNftsFrom}
          getLastNftsMetadatas={getLastNftsMetadatas}
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
