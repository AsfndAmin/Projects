// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "erc721a/contracts/ERC721A.sol";

contract IlluminatiOwls is ERC721A, Ownable {

    bytes32 public publicWhitelistMerkleRoot;
    bytes32 public hootWhitelistMerkleRoot;

    string private _baseUriExtended;
    uint256 public immutable _maxSupply = 3333;
    uint256 public _mintFee;
    uint256 public wlStartTime;
    uint256 public wlEndTime;
    uint256 public publicStartTime;
    uint256 public hootStartTime;
    uint256 public hootEndTime;
    uint256 public totalHootLimit;
    uint256 public totalHootMinted;
    mapping(address =>uint256) private _hootMintCount;

    constructor() ERC721A("illuminati Owls", "ILO") {}

    modifier onlyPublicWhitelised(bytes32[] memory proof) {
        require(_verifyPublicSender(proof), "MerkleWhitelist: Caller is not whitelisted");
        _;
    }
     modifier onlyHootWhitelised(bytes32[] memory proof) {
        require(_verifyHootSender(proof), "MerkleWhitelist: Caller is not whitelisted");
        _;
    }

    function whitelistMint(uint256 quantity, bytes32[] memory proof) 
    external
    payable
    onlyPublicWhitelised(proof)
    {
        require(block.timestamp > wlStartTime && block.timestamp < wlEndTime, "sale not live");
        require(_totalMinted() + quantity <= _maxSupply, "Max supply reached");
        require(msg.value == _mintFee  * quantity, "Insufficent ETH sent");
        _safeMint(msg.sender, quantity);
    }

    function publicMint(uint256 quantity) 
    external
    payable
    {
        require(block.timestamp > publicStartTime , "Not Started");
        require(_totalMinted() + quantity <= _maxSupply, "Max supply reached");
        require(msg.value == _mintFee  * quantity, "Insufficent ETH sent");
        _safeMint(msg.sender, quantity);
    }

    function hootMint(uint256 quantity, bytes32[] memory proof) 
    external
    onlyHootWhitelised(proof)
    {
        require(block.timestamp > hootStartTime && block.timestamp < hootEndTime, "sale not live");  
        require(quantity <= 3, "Max 3");      
        require(quantity + totalHootMinted <= totalHootLimit, "Max limit reached");
        require(_totalMinted() + quantity <= _maxSupply, "Max supply reached");
        require(_totalMinted() + quantity <= _maxSupply, "Max supply reached");
        require(_hootMintCount[msg.sender] + quantity <= 3, "max 3 allowed");
        _safeMint(msg.sender, quantity);
        totalHootMinted = totalHootMinted + quantity;
        _hootMintCount[msg.sender] += quantity;
    }

    function setWlMintTime(uint256 _startTime) external onlyOwner{
        wlStartTime = _startTime;
        // wlEndTime = _startTime + 7200;
         wlEndTime = _startTime + 2 hours;
         publicStartTime = wlEndTime;
    }

    function setHootMintTime(uint256 _startTime, uint256 _endTime) external onlyOwner{
        require(_startTime < _endTime, "Invalid Time");
        hootStartTime = _startTime;
        hootEndTime = _endTime;
    }

    function addHootMintLimit(uint256 _limit) external onlyOwner{
        require(_limit > 0, "cannot be 0");
        totalHootLimit = _limit;
    }


    function setBaseUri(string memory _baseUri) public onlyOwner{
        _baseUriExtended = _baseUri;
    }

    function setMintingFee(uint256 fee) external onlyOwner{
        _mintFee = fee;
    }

    
    function withdrawEth(address owner) external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseUriExtended;
    }
    // PUBLIC WHITELSITING

    function setPublicWhitelistMerkleRoot(bytes32 merkleRoot) external onlyOwner {
        publicWhitelistMerkleRoot = merkleRoot;
    }

    function _verifyPublicSender(bytes32[] memory proof) internal view returns (bool) {
        return _verify(proof, _hash(msg.sender), publicWhitelistMerkleRoot);
    }


    //HOOT WHITELISTING

    function setHootWhitelistMerkleRoot(bytes32 merkleRoot) external onlyOwner {
        hootWhitelistMerkleRoot = merkleRoot;
    }

    function _verifyHootSender(bytes32[] memory proof) internal view returns (bool) {
        return _verify(proof, _hash(msg.sender), hootWhitelistMerkleRoot);
    }

    //VERIFY AND HASH

    function _verify(bytes32[] memory proof, bytes32 addressHash, bytes32 whitelistMerkleRoot)
    internal
    pure
    returns (bool)
    {
        return MerkleProof.verify(proof, whitelistMerkleRoot, addressHash);
    }

    function _hash(address add) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(add));
    }



    /**
     * @dev Returns the starting token ID. 
     * To change the starting token ID, please override this function.
     */
    function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }
}
//merkleproof 0x08f36c36e4bb12cd0a6fee54b3ffc9e6a806ed82462aab1227854bbef73065d1

// [   "0x04a10bfd00977f54cc3450c9b25c9b3a502a089eba0097ba35fc33c4ea5fcb54",   "0xda2a605bdf59a3b18e24cd0b2d9110b6ffa2340f6f67bc48214ac70e49d12770",   "0xc23d89d4ba0f8b56a459710de4b44820d73e93736cfc0667f35cdd5142b70f0d"]

// [
//   "0x999bf57501565dbd2fdcea36efa2b9aef8340a8901e3459f4a4c926275d36cdb",
//   "0xda2a605bdf59a3b18e24cd0b2d9110b6ffa2340f6f67bc48214ac70e49d12770",
//   "0xc23d89d4ba0f8b56a459710de4b44820d73e93736cfc0667f35cdd5142b70f0d"
// ]

// [
//   "0xf6d82c545c22b72034803633d3dda2b28e89fb704f3c111355ac43e10612aedc",
//   "0x39a01635c6a38f8beb0adde454f205fffbb2157797bf1980f8f93a5f70c9f8e6",
//   "0xc23d89d4ba0f8b56a459710de4b44820d73e93736cfc0667f35cdd5142b70f0d"
// ]