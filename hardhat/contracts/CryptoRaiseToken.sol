// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Wrapper.sol";

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract CryptoRaiseToken is ERC20, ERC20Permit, ERC20Votes,Ownable,Pausable,IERC721Receiver {

    mapping(address => bool) public allowedErc721;
    mapping(address => uint256) public erc721Power;

    mapping(address => mapping(uint256 => bool)) public locked;
    mapping(address => mapping(uint256 => address)) public locker;

    constructor(address[] memory _erc721,uint256[] memory _power)
        ERC20("CryptoRaiseToken", "CRT")
        ERC20Permit("CryptoRaiseToken"){

      for(uint i =0 ;i < _erc721.length; i++){
        allowedErc721[_erc721[i]] = true;
        erc721Power[_erc721[i]] = _power[i];
      }
    }

    event CollectibleAllowed(address erc721,uint256 power);
    event Locked(address owner,address indexed erc721,uint256 indexed tokenId);
    event Unlocked(address owner,address indexed erc721,uint256 indexed tokenId);

    modifier onlyAllowedErc721(address _erc721){
      require(allowedErc721[_erc721],"Collectible not allowed");
      _;
    }

    function lock(address[] memory _erc721,uint256[] memory _tokenId) external returns(bool) {
      for(uint256 i = 0;i < _erc721.length;i++){
        _lock(_erc721[i],_tokenId[i]);
      }
      return(true);
    }

    function unlock(address[] memory _erc721,uint256[] memory _tokenId) external returns(bool){
      for(uint256 i =0;i < _erc721.length;i++){
        _unlock(_erc721[i],_tokenId[i]);
      }
    }

    function _lock(address _erc721,uint256 _tokenId) internal onlyAllowedErc721(_erc721) {
      require(!locked[_erc721][_tokenId],"Collectible already locked");
      IERC721(_erc721).safeTransferFrom(msg.sender,address(this),_tokenId);
      _mint(msg.sender,erc721Power[_erc721]);
      locked[_erc721][_tokenId] = true;
      locker[_erc721][_tokenId] = msg.sender;
      emit Locked(msg.sender,_erc721,_tokenId);
    }

    function _unlock(address _erc721,uint256 _tokenId) internal {
      require(locked[_erc721][_tokenId],"Collectible not locked");
      require(locker[_erc721][_tokenId] == msg.sender,"Collectible can only be unlocked by locker");

      IERC721(_erc721).safeTransferFrom(address(this),msg.sender,_tokenId);
      _burn(msg.sender,erc721Power[_erc721]);
      locked[_erc721][_tokenId] = false;
      delete(locker[_erc721][_tokenId]);
      emit Unlocked(msg.sender,_erc721,_tokenId);
    }

    function transfer(address to, uint256 amount) public override(ERC20) returns (bool) {
      revert("ERC20 cant be transfered");
    }
    function transferFrom(address from,address to, uint256 amount) public override(ERC20) returns (bool) {
      revert("ERC20 cant be transfered");
    }


    function allowErc721(address _erc721,uint256 _power) public onlyOwner{
      require(!allowedErc721[_erc721],"Collectible already allowed");
      allowedErc721[_erc721] = true;
      erc721Power[_erc721] = _power;
      emit CollectibleAllowed(_erc721,_power);
    }
    function pause() public onlyOwner {
      _pause();
    }
    function unpause() public onlyOwner {
      _unpause();
    }

    // The functions below are overrides required by Solidity.

    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }

    /**
     * @dev Whenever an {IERC721} `tokenId` token is transferred to this contract via {IERC721-safeTransferFrom}
     * by `operator` from `from`, this function is called.
     *
     * It must return its Solidity selector to confirm the token transfer.
     * If any other value is returned or the interface is not implemented by the recipient, the transfer will be reverted.
     *
     * The selector can be obtained in Solidity with `IERC721Receiver.onERC721Received.selector`.
     */


    function onERC721Received(
      address operator,
      address from,
      uint256 tokenId,
      bytes calldata data
    )
        external
        override
        returns(bytes4){
            return(bytes4(keccak256("onERC721Received(address,address,uint256,bytes)")));
        }

}
