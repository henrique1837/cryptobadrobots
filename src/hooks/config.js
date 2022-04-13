import { useEffect, useState } from "react";

export default function useConfig() {
  const [config, setConfig] = useState({
    CONTRACT_ADDRESS: "0xb249D50205FA10096f2e086196EeF7259257a730",
    SCAN_LINK: "https://blockexplorer.rinkeby.boba.network/address",
    NETWORK: {
      NAME: "Boba Rinkeby",
      SYMBOL: "ETH",
      ID: 4,
    },
    NFT_NAME: "Crypto Bad Robots",
    SYMBOL: "CBR",
    MAX_SUPPLY: 250,
    WEI_COST: 10000000000000000,
    DISPLAY_COST: 0.01,
    GAS_LIMIT: 38500000,
    MARKETPLACE: "ToFuNFT",
    MARKETPLACE_LINK: "https://tofunft.com/collection/crypto-bad-robots/items",
    SHOW_BACKGROUND: true,
    RINKEBY : "0xfb0975b197E861289c4442dB3ff2A60338487172",
    RINKEBY_BOBA: "0xb249D50205FA10096f2e086196EeF7259257a730"
  });

  return config
}
