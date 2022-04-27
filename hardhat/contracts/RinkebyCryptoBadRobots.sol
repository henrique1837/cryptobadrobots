// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract RinkebyCryptoBadRobots is ERC721Enumerable,ERC721Royalty,Ownable,Pausable,VRFConsumerBase {

  using Strings for uint256;


  bytes32 internal keyHash;
  uint256 internal fee;
  string public baseURI;
  string public baseExtension = ".json";
  uint256 public cost = 0.01 ether;
  uint256 public maxSupply = 1000;
  uint256 public maxMintAmount = 5;

  uint256 public pendingMints = 0;
  uint256 public totalPendingRequests = 0;
  uint256[] public lockedIds;
  /// @dev Required by EIP-2981: NFT Royalty Standard
  address private _receiver;
  uint96 private _feeNumerator;

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
      0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B, // VRF Coordinator
      0x01BE23585060835E02B77ef475b0Cc51aA1e0709  // LINK Token
  )
  ERC721(_name, _symbol) {
    keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
    fee = 0.1 * 10 ** 18; // 0.0001 LINK (Varies by network)
    setBaseURI(_initBaseURI);

    for(uint256 i = 0;i < maxSupply;i++){
      lockedIds.push(i.add(1));
    }
    /// @dev Set default royalties for EIP-2981
    _setDefaultRoyalty(owner(), 100);
  }

  // internal
  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }

  // public
  function mint(uint256 _mintAmount) external payable whenNotPaused {

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
    requestMinter[requestId] = msg.sender;
    requestMintAmount[requestId] = _mintAmount;
    (bool success, ) = payable(owner()).call{value: msg.value}("");
    require(success);
    pendingRequest[msg.sender] = true;
    pendingMints = pendingMints.add(1);
    totalPendingRequests = totalPendingRequests.add(1);
  }
  /// Check interface support.
  /// @param interfaceId the interface id to check support for
  function supportsInterface(bytes4 interfaceId)
      public
      view
      override(ERC721Enumerable, ERC721Royalty)
      returns (bool)
  {
      return super.supportsInterface(interfaceId);
  }

  /**
   * Callback function used by VRF Coordinator
   */
  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {

      pendingRequest[requestMinter[requestId]] = false;
      totalPendingRequests = totalPendingRequests.sub(1);

      for (uint256 i = 0; i <= requestMintAmount[requestId].sub(1); i++) {
        uint256 result = randomness.mod(lockedIds.length);
        addressMintedBalance[requestMinter[requestId]]++;
        _safeMint(requestMinter[requestId], lockedIds[result]);
        creator[result] = requestMinter[requestId];
        delete lockedIds[result];
        lockedIds[result] = lockedIds[lockedIds.length - 1];
        lockedIds.pop();
      }
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


  // From https://github.com/vzoo/ERC721-with-EIP2981-Polygon-bulk-mint-OpenSea-compatible/blob/main/contracts/VZOOERC721.sol
  /// Sets the default royalty address and fee
  /// @dev feeNumerator defaults to 1000 = 10% of transaction value
  /// @param receiver wallet address of new receiver
  /// @param feeNumerator new fee numerator
  function setDefaultRoyalty(address receiver, uint96 feeNumerator)
      external
      onlyOwner {
      _setDefaultRoyalty(receiver, feeNumerator);
  }

  // Pauses the contract
  function pause() external onlyOwner {
      _pause();
  }

  // Unpauses the contract
  function unpause() external onlyOwner {
      _unpause();
  }

  function withdrawLink(uint256 total) external onlyOwner {
    require(LINK.balanceOf(address(this)) >= total, "Not enough LINK");
    LINK.transfer(msg.sender,total);
  }
  function withdraw() external onlyOwner {
    (bool sent, ) = payable(msg.sender).call{value: address(this).balance}("");
    require(sent);
  }
  /// @param from wallet address to send the NFT from
  /// @param to wallet address to send the NFT to
  /// @param tokenId NFT id to transfer
  function _beforeTokenTransfer(
      address from,
      address to,
      uint256 tokenId
  ) internal virtual override(ERC721, ERC721Enumerable) {
      super._beforeTokenTransfer(from, to, tokenId);
  }

  /// @dev Required override to comply with EIP-2981
  /// @param tokenId the NFT id to burn royalty information for
  function _burn(uint256 tokenId)
      internal
      virtual
      override(ERC721, ERC721Royalty)
  {
      super._burn(tokenId);
  }
}
