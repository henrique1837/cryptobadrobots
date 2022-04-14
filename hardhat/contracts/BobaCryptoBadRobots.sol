//SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface Helper {
  function TuringRandom() external returns (uint256);
}

contract CryptoBadRobots is ERC721Enumerable,Ownable {

  using Strings for uint256;
  string public baseURI;
  string public baseExtension = ".json";
  string public notRevealedUri;
  uint256 public cost = 0.02 ether;
  uint256 public maxSupply = 250;
  uint256 public maxMintAmount = 10;
  uint256 public revealTimestamp;
  uint256[] public lockedIds;
  Helper public helper;
  mapping(uint256 => address) public creator;
  mapping(address => uint256) public addressMintedBalance;

  using SafeMath for uint256;

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _initBaseURI,
    string memory _initNotRevealedUri,
    Helper _helper
  ) ERC721(_name, _symbol) {
    helper = _helper;
    setBaseURI(_initBaseURI);
    setNotRevealedURI(_initNotRevealedUri);
    revealTimestamp = block.timestamp + 1 minutes;

    for(uint256 i = 0;i < maxSupply;i++){
      lockedIds.push(i.add(1));
    }
  }

  // internal
  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }

  // public
  function mint(uint256 _mintAmount) external payable {
    uint256 supply = totalSupply();
    require(_mintAmount > 0, "need to mint at least 1 NFT");
    require(_mintAmount <= maxMintAmount, "max mint amount per session exceeded");
    require(supply.add(_mintAmount) <= maxSupply, "max NFT limit exceeded");

    if (msg.sender != owner()) {
        require(msg.value >= cost.mul(_mintAmount), "insufficient funds");
    }



    uint256 turingRAND = helper.TuringRandom();


    for (uint256 i = 0; i <= _mintAmount.sub(1); i++) {
      uint256 result = turingRAND.mod(lockedIds.length);
      addressMintedBalance[msg.sender]++;
      _safeMint(msg.sender, lockedIds[result]);
      creator[result] = msg.sender;
      delete lockedIds[result];
      lockedIds[result] = lockedIds[lockedIds.length - 1];
      lockedIds.pop();
    }



    (bool success, ) = payable(owner()).call{value: msg.value}("");
    require(success);
  }


  function walletOfOwner(address _owner)
    public
    view
    returns (uint256[] memory)
  {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount);
    for (uint256 i; i < ownerTokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokenIds;
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(
      _exists(tokenId),
      "ERC721Metadata: URI query for nonexistent token"
    );

    if(revealTimestamp > block.timestamp) {
        return notRevealedUri;
    }

    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
        : "";
  }


  function setBaseURI(string memory _newBaseURI) private  {
    baseURI = _newBaseURI;
  }

  function setBaseExtension(string memory _newBaseExtension) private {
    baseExtension = _newBaseExtension;
  }

  function setNotRevealedURI(string memory _notRevealedURI) private {
    notRevealedUri = _notRevealedURI;
  }
  function withdraw() public payable onlyOwner {
    (bool sent, ) = payable(owner()).call{value: address(this).balance}("");
    require(sent);
  }

}
