// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Siku is ERC721A, Ownable, Pausable {

    IERC721 public xoid;
    address signerAddress;
    string public _baseUriExtended;
    uint256 public immutable MAX_SUPPLY = 3333;
    uint256 public PUBLIC_MINT_PRICE = 0.188 ether;
    uint256 public XOID_HOLDERS_PRICE = 0.155 ether;
    uint256 public MAX_MINT_ALLOWED = 3;
    mapping(uint256 => bool) redeemedXoids;
    mapping(address => uint256) whitelistRedeemed;

    constructor (IERC721 _contract) ERC721A("Siku", "Siku") {
        xoid = _contract;
    }

    function mint(address _receiver, uint256 _quantity) 
    external
    payable
    {
        require(_quantity <= MAX_MINT_ALLOWED, "Max 3 allowed");
        require(_totalMinted() + _quantity <=  MAX_SUPPLY, "Max supply reached");
        require(msg.value == (PUBLIC_MINT_PRICE  * _quantity), "Insufficent eth sent");
        _safeMint(_receiver, _quantity);
    }

    function xoidHoldersMint(address _receiver, uint256[] calldata _tokenIds) 
    external
    payable
    {   
        require(_tokenIds.length <= MAX_MINT_ALLOWED, "Max 3 allowed");
        require((_totalMinted() + _tokenIds.length) <=  MAX_SUPPLY, "Max supply reached");
        require(msg.value == (XOID_HOLDERS_PRICE  * _tokenIds.length), "Insufficent eth sent");
        
        (uint[] memory redeemableXoids, uint totalTokens) = filterRedeemableTokens(_receiver, _tokenIds);
        for(uint j = 0; j < redeemableXoids.length; j++) redeemedXoids[redeemableXoids[j]] = true;

        _safeMint(_receiver, totalTokens);
    }

    function whitelistMint(address _receiver, uint256 _amount, bytes memory _signature) external
    payable 
    {
        require(whitelistRedeemed[_receiver] <= 3, "You already received an NFT!");
        require(_totalMinted() <= MAX_SUPPLY, "Max supply reached");
        require(msg.value == (PUBLIC_MINT_PRICE  * _amount), "Insufficent eth sent");
        bytes32 msgHash = keccak256(
            abi.encode(_receiver)
        );
        require(_validSignature(_signature, msgHash), "INVALID_SIGNATURE");

        whitelistRedeemed[_receiver] += _amount;
        _safeMint(_receiver, _amount);
    }

    function filterRedeemableTokens(address receiver, uint[] memory tokenIds) public view returns (uint[] memory, uint) {
        uint total;

        // get total redeemable
        for(uint j = 0; j < tokenIds.length; j++) 
            if(!isRedeemed(tokenIds[j]) && xoid.ownerOf(tokenIds[j]) == receiver)
                total+=1;
        
        uint[] memory tokens = new uint[](total);
        total = 0;
        for(uint j = 0; j < tokenIds.length; j++) 
            if(!isRedeemed(tokenIds[j]) && xoid.ownerOf(tokenIds[j]) == receiver) {
                tokens[total] = tokenIds[j];
                total+=1;
            }
        return (tokens, total);
    }

    function setSignerAddress(address _address) external onlyOwner {
        signerAddress = _address;
    }

    function getSigner(address receiver, bytes memory signature) external pure returns(address) {
        bytes32 msgHash = keccak256(
            abi.encode(receiver)
        );
        return ECDSA.recover(msgHash, signature);
    }

    // Check to see if xoid token has been redeemed already
    function isRedeemed(uint _tokenId) public view returns (bool) {
        return redeemedXoids[_tokenId];
    }

    function _validSignature(bytes memory signature, bytes32 msgHash) internal view returns (bool) {
        return ECDSA.recover(msgHash, signature) == signerAddress;
    }

   function setBaseUri(string memory _baseUri) public onlyOwner{
        _baseUriExtended = _baseUri;
    }

    function setMintingFee(uint256 _fee) external onlyOwner{
        PUBLIC_MINT_PRICE = _fee;
    }

    function setHoldersMintingFee(uint256 _fee) external onlyOwner{
        XOID_HOLDERS_PRICE = _fee;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseUriExtended;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function withdrawEth(address _address) external onlyOwner {
        payable(_address).transfer(address(this).balance);
    }

    function checkContractBalance() external view onlyOwner returns(uint256) {
        return address(this).balance;
    }
}