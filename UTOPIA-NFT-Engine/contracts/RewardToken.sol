// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract rewardToken is ERC20, Ownable {
    constructor() ERC20("REWARD", "RWDT") {}

    function mint( uint256 amount) public onlyOwner {
        _mint(msg.sender, amount);
    }

}