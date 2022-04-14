//SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";


contract CryptoBadRobots is ERC721Enumerable,Ownable,VRFConsumerBase {

  using Strings for uint256;


  bytes32 internal keyHash;
  uint256 internal fee;
  string public baseURI;
  string public baseExtension = ".json";
  uint256 public cost = 20 ether;
  uint256 public maxSupply = 3000;
  uint256 public maxMintAmount = 5;

  uint256 public pendingMints = 0;
  uint256 public totalPendingRequests = 0;
  uint256[] public lockedIds;


  mapping(uint256 => address) public creator;
  mapping(address => uint256) public addressMintedBalance;

  mapping(bytes32 => uint256) internal requestMintAmount;
  mapping(bytes32 => address) internal requestMinter;

  mapping(address => bool) internal pendingRequest;


  using SafeMath for uint256;

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _initBaseURI
  )
  VRFConsumerBase(
      0x3d2341ADb2D31f1c5530cDC622016af293177AE0, // VRF Coordinator
      0xb0897686c545045aFc77CF20eC7A532E3120E0F1  // LINK Token
  )
  ERC721(_name, _symbol) {
    keyHash = 0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da;
    fee = 0.0001 * 10 ** 18; // 0.0001 LINK (Varies by network)
    setBaseURI(_initBaseURI);

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
    require(pendingRequest[msg.sender] == false,"Please wait VRF return request");
    require(_mintAmount > 0, "need to mint at least 1 NFT");
    require(_mintAmount <= maxMintAmount, "Max mint amount per session exceeded");
    require(supply.add(_mintAmount) <= maxSupply, "Max NFT limit exceeded");
    require(pendingMints.add(_mintAmount) <= maxSupply, "Max NFT limit exceeded, there are some pending NFTs");
    require(totalPendingRequests.add(1) <= 5,"Max pending requests reached, plese try again later ");
    if (msg.sender != owner()) {
        require(msg.value >= cost.mul(_mintAmount), "Insufficient funds");
    }
    require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK to send request!");
    bytes32 requestId = requestRandomness(keyHash, fee);
    requestMintAmount[requestId] = _mintAmount;
    (bool success, ) = payable(owner()).call{value: msg.value}("");
    require(success);
    pendingRequest[msg.sender] = true;
    pendingMints = pendingMints.add(1);
    totalPendingRequests = totalPendingRequests.add(1);
  }


  /**
   * Callback function used by VRF Coordinator
   */
   function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {

       for (uint256 i = 0; i <= requestMintAmount[requestId].sub(1); i++) {
         uint256 result = randomness.mod(lockedIds.length);
         addressMintedBalance[requestMinter[requestId]]++;
         _safeMint(requestMinter[requestId], lockedIds[result]);
         creator[result] = requestMinter[requestId];
         delete lockedIds[result];
         lockedIds[result] = lockedIds[lockedIds.length - 1];
         lockedIds.pop();
       }
       pendingRequest[requestMinter[requestId]] = false;
       totalPendingRequests = totalPendingRequests.sub(1);
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

  function withdrawLink(uint256 total) external onlyOwner {
    require(LINK.balanceOf(address(this)) >= total, "Not enough LINK");
    LINK.transfer(msg.sender,total);
  }
  function withdraw() external onlyOwner {
    (bool sent, ) = payable(msg.sender).call{value: address(this).balance}("");
    require(sent);
  }

}
