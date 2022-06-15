  
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract holderNft is ERC721, Pausable, Ownable, ERC721Burnable {
   
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    
    

    string public baseUriExtended;
    uint256 public immutable maxSupply = 10000;

    constructor() ERC721("HOLDER", "HLD") {
        _tokenIdCounter.increment();
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMint() public  whenNotPaused  {

        require(currentSupply() + 1 <= maxSupply , "max limit reached");
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, tokenId);
        _tokenIdCounter.increment();
    }

        function setBaseURI(string memory baseURI_) external onlyOwner {
        require(bytes(baseURI_).length > 0, "Cannot be null");
        baseUriExtended = baseURI_;
    }

    function currentSupply() public view returns(uint256) {
        return _tokenIdCounter.current();
    }

    function _baseURI() internal view override returns (string memory) {
        return baseUriExtended;
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        safeTransferFrom(from, to, tokenId, "");
    }
}

