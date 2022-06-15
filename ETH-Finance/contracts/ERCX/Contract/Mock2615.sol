// SPDX-License-Identifier: unlicense
pragma solidity ^0.8.0;

import "./ERCX721fier.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Mock2615 is Ownable, ERCX721fier {
    using Counters for Counters.Counter;
    Counters.Counter private tokenId;
    string baseUriExtended;

    fallback() external payable { }
    receive() external payable {} 

    constructor() ERCX721fier("Tests", "TSTSS") {}

    function mint(address _account) external {
        tokenId.increment();
        uint256 id = tokenId.current();
        _mint(_account, id);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseUriExtended;
    }

    function burn(uint256 _tokenId) external {
        _burn(_tokenId);
    }

    function setBaseUri(string memory _uri) external onlyOwner {
        baseUriExtended = _uri;
    }

    function totalSupply() public view returns (uint256) {
        return tokenId.current();
    }



}
