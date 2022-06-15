// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "../interfaces/IBasePool.sol";
import "./AbstractRewards.sol";

abstract contract BasePool is AbstractRewards, IBasePool {
    using SafeERC20 for IERC20;
    using SafeCast for uint256;
    using SafeCast for int256;


    IERC20 public immutable rewardToken;
    IERC721 public immutable nftToken;

    mapping(uint256 => uint256) NftWeightage;
    uint256 totalNftWeightage;

    event RewardsClaimed(address indexed _receiver, uint256 rewardClaimed);

    constructor(
        address _rewardToken,
        address _nftToken,
        uint256 totalWeight
    ) AbstractRewards(totalWeightage) {
        require(
            _rewardToken != address(0),
            "BasePool.constructor: Reward token must be set"
        );
        rewardToken = IERC20(_rewardToken);
        nftToken = IERC721(_nftToken);
        totalNftWeightage = totalWeight;
    }

    function distributeRewards(uint256 _amount) external override {
        rewardToken.safeTransferFrom(msg.sender, address(this), _amount);
        _distributeRewards(_amount);
    }

    function weightage(uint256 tokenId) internal view returns (uint256) {
        return NftWeightage[tokenId];
    }

    function totalWeightage() internal view returns (uint256) {
        return totalNftWeightage;
    }


    function claimRewards(uint256 tokenId) external {
        require(
            nftToken.ownerOf(tokenId) == msg.sender,
            "caller is not the owner"
        );
        uint256 rewardAmount = _prepareCollect(tokenId);

        // if rewards exist
        if (rewardAmount > 1) {
            rewardToken.safeTransfer(msg.sender, rewardAmount);
        }

        emit RewardsClaimed(msg.sender, rewardAmount);
    }
}