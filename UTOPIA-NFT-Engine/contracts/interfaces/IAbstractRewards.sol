// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

interface IAbstractRewards {
    /**
     * @dev Returns the total amount of rewards a given tokenId is able to withdraw.
     * @param tokenId tokenId of a reward recipient
     * @return A uint256 representing the rewards `tokenId` can withdraw
     */
    function withdrawableRewardsOf(uint256 tokenId)
        external
        view
        returns (uint256);

    /**
     * @dev View the amount of funds that an tokenId has withdrawn.
     * @param tokenId The tokenId of a token holder.
     * @return The amount of funds that `tokenId` has withdrawn.
     */
    function withdrawnRewardsOf(uint256 tokenId)
        external
        view
        returns (uint256);

    /**
     * @dev View the amount of funds that an tokenId has earned in total.
     * accumulativeFundsOf(tokenId) = withdrawableRewardsOf(tokenId) + withdrawnRewardsOf(tokenId)
     * = (pointsPerShare * balanceOf(tokenId) + pointsCorrection[tokenId]) / POINTS_MULTIPLIER
     * @param tokenId The tokenId of a token holder.
     * @return The amount of funds that `tokenId` has earned in total.
     */
    function cumulativeRewardsOf(uint256 tokenId)
        external
        view
        returns (uint256);

    /**
     * @dev This event emits when new funds are distributed
     * @param by the address of the sender who distributed funds
     * @param rewardsDistributed the amount of funds received for distribution
     */
    event RewardsDistributed(address indexed by, uint256 rewardsDistributed);

    /**
     * @dev This event emits when distributed funds are withdrawn by a token holder.
     * @param by the address of the receiver of funds
     * @param fundsWithdrawn the amount of funds that were withdrawn
     */
    event RewardsWithdrawn(address indexed by, uint256 fundsWithdrawn);
}
