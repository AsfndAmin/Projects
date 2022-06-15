// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "./base/BasePool.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UtopiaRewardPool is BasePool, Ownable {

    uint256 public silverQuantity;
    uint256 public goldQuantity;
    uint256 public diamondQuantity;
    uint256 internal silverWeightage;
    uint256 internal goldWeightage;
    uint256 internal diamondWeightage;

    constructor(
        address rewardToken_,
        address nftToken_,
        uint256 totalWeight_
    ) BasePool(rewardToken_, nftToken_, totalWeight_) {}

    /*
        @dev owner will add the weightage of each category for rewards
        - Weightage will be devided for each NFT
    */
    function addNftWeightage(uint256 _diamondWeightage, uint256 _goldWeightage, uint256 _silverWeightage) external onlyOwner{
        require((_diamondWeightage + _goldWeightage + _silverWeightage) == totalNftWeightage, "totalweightage should be equal");

        (silverWeightage, goldWeightage, diamondWeightage) = (_silverWeightage, _goldWeightage, _diamondWeightage);
        nftShare[0] = getNftWeightage(_diamondWeightage, diamondQuantity);
        nftShare[1] = getNftWeightage(_goldWeightage, goldQuantity);
        nftShare[2] = getNftWeightage(_silverWeightage, silverQuantity);
    }

    /*
        @dev owner can exclude the NFTs from getting rewards
        @param _tokenId given the array of token ids, will not be included for rewards
        @_state if true, _tokenIds will be excluded from rewards
    */
    function excludeFromRewards(uint256[] calldata _tokenId, bool _state) external onlyOwner {
        for(uint256 indx = 0; indx < _tokenId.length; indx++) {
            restricted[_tokenId[indx]] = _state;
            updateNftWeightage(_tokenId[indx], _state);
        }
    }
    
    /*
        @dev pruvate method to update the weightage of each NFT share
        @param _state If state is true, then _tokenId will be included in the rewards
            else _tokenId will be excluded from getting any rewards
    */
    function updateNftWeightage(uint256 _tokenId, bool _state) private {
        if(_tokenId < diamondNFTCeil) {
            _state ? diamondQuantity-- : diamondQuantity++;
            nftShare[0] = getNftWeightage(diamondWeightage, diamondQuantity);

        } else if (_tokenId > diamondNFTCeil && _tokenId < goldNFTCeil) {
            _state ? goldQuantity-- : goldQuantity++;
            nftShare[1] = getNftWeightage(goldWeightage, goldQuantity);

        } else {
            _state ? silverQuantity-- : silverQuantity++;
            nftShare[2] = getNftWeightage(silverWeightage, silverQuantity);
        }
    }

    function getNftWeightage(uint256 _totalWeightage, uint256 _nftAmount) private pure returns(uint256) {
        return _totalWeightage / _nftAmount;
    }

    /*
        @dev owner sets the amount of NFTs of each category
    */
    function setNftsAmount(uint256 _diamond, uint256 _gold, uint256 _silver) external onlyOwner{
        require(_diamond + _gold + _silver == 10000, "total should be 10k");

        (diamondQuantity, goldQuantity, silverQuantity) = (_diamond, _gold, _silver);
        diamondNFTCeil = _diamond;
        goldNFTCeil = _diamond + _gold;
        silverNFTCeil = _diamond + _gold + _silver;
    }
}