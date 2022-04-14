import { useEffect, useState } from "react";

export default function useConfig() {
  const [config, setConfig] = useState({
    CONTRACT_ADDRESS: "0x7a5c440a8bf560e61bb37548dc9b137828b16b70",
    SCAN_LINK: "https://polygonscan.com/address",
    SCAN_LINK_BOBA: "https://blockexplorer.rinkeby.boba.network/address",
    SCAN_LINK_BOBA_RINKEBY: "https://blockexplorer.rinkeby.boba.network/address",
    SCAN_LINK_RINKEBY: "https://rinkeby.etherscan.io/token",
    NETWORK: {
      NAME: "Polygon",
      SYMBOL: "MATIC",
      ID: 137,
    },
    NFT_NAME: "Crypto Bad Robots",
    SYMBOL: "CBR",
    WEI_COST: 10000000000000000,
    DISPLAY_COST: 0.01,
    GAS_LIMIT: 38500000,
    MARKETPLACE: "Rarible",
    MARKETPLACE_LINK: "https://rarible.com/collection",

    MARKETPLACE_BOBA: "ToFuNFT",
    MARKETPLACE_LINK_BOBA: "https://tofunft.com/collection/cbr/items",

    MARKETPLACE_BOBA_RINKEBY: "ToFuNFT",
    MARKETPLACE_LINK_BOBA_RINKEBY: "https://tofunft.com/collection/cbr/items",

    MARKETPLACE_RINKEBY: "Rarible",
    MARKETPLACE_LINK_RINKEBY: "https://rinkeby.rarible.com/collection",
    
    MARKETPLACE_POLYGON: "https://rarible.com/collection/polygon",
    SHOW_BACKGROUND: true,
    RINKEBY : "0x7a5c440a8bf560e61bb37548dc9b137828b16b70",
    RINKEBY_BOBA: "0xb249D50205FA10096f2e086196EeF7259257a730"
  });

  return config
}
