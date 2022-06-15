  
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

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

    constructor() ERC721("HOLDER", "HLD") {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMint(address to) public  whenNotPaused  {
        require(to != address(0), "Address cannot be 0");
        require(currentSupply() + 1 <= maxSupply , "max limit reached");
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
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
    }

