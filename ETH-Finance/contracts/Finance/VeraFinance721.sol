//SPDX-License-Identifier: un-licensed
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../ERCX/Contract/ERCX.sol";
import "./Interface/IPayment.sol";

contract VeraFinance721 is ERC721Holder, Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    uint128 public tradeCounter;
    ERCX _ERCX;

    // 10 => 1%
    uint16 public fee;
    IPayment private payment;

    struct NftFinance {
        uint128 id;
        uint256 startTime;
        address nftContract;
        uint256 nftId;
        uint128 price;
        uint256 downPayment; // 10 i.e 1 % of the price
        uint256 duration; // i.e 50 days
        uint256 paymentPeriod; // i.e every 5 days
        bytes32 status; // i.e Open, Pending, Executed, Canceled
        address sellerAddress;
        IPayment.PaymentToken paymentTokens;
        uint256 nextPayment;
    }

    mapping(uint256 => NftFinance) idToNftFinance;
    mapping(uint256 => uint256) amountPayed;
    mapping(uint128 => uint256) idToPeriodicPayment;
    mapping(uint256 => address) idTobuyer;
    mapping(uint256 => bool) isDownPaymentPayed;

    event NftListed(
        uint256 id,
        address nftContract,
        uint256 nftId,
        uint256 price,
        uint256 downPayment,
        uint256 duration,
        uint256 paymentPeriod,
        bytes32 status,
        address sellerAddress,
        IPayment.PaymentToken
    );
    event DownPayment(uint256 id, bytes32 status);
    event PeriodPayment(uint256 id, uint256 totalPayment, uint256 paymentPaid);
    event NftTransferred(uint256 id, bytes32 status);
    event NftCanceled(uint256 id, bytes32 status);

    constructor(
        uint16 fee_,
        ERCX ERCX_,
        address payment_
    ) {
        fee = fee_;
        payment = IPayment(payment_);
        _ERCX = ERCX_;
        tradeCounter = 1;
    }

    function setFee(uint16 _fee) external onlyOwner {
        //cannot set fee more than 1000 pt
        require(_fee < 1000, "fee exceeds 100pct");
        fee = _fee;
    }

    function calculateFee(uint256 _price) private view returns (uint256) {
        return _price.mul(fee).div(1000);
    }

    function calculateDownPayment(
        uint256 _price,
        uint256 _downPaymentPercentage
    ) private pure returns (uint256) {
        return _price.mul(_downPaymentPercentage).div(1000);
    }

    function setPeriodicPayment(
        uint256 _price,
        uint256 _downPaymentPercentage,
        uint256 _numberOfPeriod
    ) private {
        uint256 downPayment = _price.sub(
            calculateDownPayment(_price, _downPaymentPercentage)
        );
        idToPeriodicPayment[tradeCounter] = downPayment.div(_numberOfPeriod);
    }

    function unListNft(uint256 _id) external {
        NftFinance storage nft = idToNftFinance[_id];

        require(
            msg.sender == nft.sellerAddress,
            "NftFinance: you are not the seller"
        );
        require(!isDownPaymentPayed[_id], "NftFinance: downpayment is payed");

        IERC721 token = IERC721(nft.nftContract);

        token.safeTransferFrom(
            address(this),
            payable(nft.sellerAddress),
            nft.nftId
        );
        _ERCX.revokeLien(_id);

        emit NftCanceled(_id, "Canceled");
        delete idToNftFinance[_id];
        delete idTobuyer[_id];
        delete isDownPaymentPayed[_id];
        delete amountPayed[_id];
    }

    function listNft(
        uint128 _nftId,
        uint128 _price,
        uint256 _paymentPeriod,
        uint256 _downPayment,
        uint256 _duration,
        address _nftContract,
        IPayment.PaymentToken _paymentTokens
    ) external {
        _verifyIsNotZeroAddr(msg.sender);
        require(
            _paymentPeriod != 0,
            "NftFinance: Payment Period can not be zero"
        );
        setPeriodicPayment(_price, _downPayment, _duration.div(_paymentPeriod));

        IERC721 token = IERC721(_nftContract);
        token.safeTransferFrom(payable(msg.sender), address(this), _nftId);

        // set token URI
        // _ERCX.setTokenUri(_nftId, ERC721(_nftContract).tokenURI(_nftId));
        _ERCX.setLien(tradeCounter);

        idToNftFinance[tradeCounter] = NftFinance({
            id: tradeCounter,
            startTime: 0,
            nftContract: _nftContract,
            nftId: _nftId,
            price: _price,
            downPayment: _downPayment,
            duration: _duration,
            paymentPeriod: _paymentPeriod,
            status: "Open",
            sellerAddress: msg.sender,
            paymentTokens: _paymentTokens,
            nextPayment: 0
        });
        amountPayed[tradeCounter] = 0;
        isDownPaymentPayed[tradeCounter] = false;

        emit NftListed(
            tradeCounter,
            _nftContract,
            _nftId,
            _price,
            _downPayment,
            _duration,
            _paymentPeriod,
            "Open",
            msg.sender,
            _paymentTokens
        );
        tradeCounter += 1;
    }

    function payDownpayment(uint256 _id, uint128 _amount)
        external
        nonReentrant
    {
        _verifyIsNotZeroAddr(msg.sender);
        NftFinance storage nft = idToNftFinance[_id];
        require(
            msg.sender != nft.sellerAddress,
            "NftFinance: owner is trying to buy his own nft"
        );

        require(!isDownPaymentPayed[_id], "NftFinance: down payment payed");
        uint256 downPayment = calculateDownPayment(nft.price, nft.downPayment);
        uint256 platfromFee = calculateFee(nft.price);
        uint256 total = downPayment.add(platfromFee);
        require(total == _amount, "NftFinance: unsufficient amount send");

        uint8 paymentTokenIx = uint8(nft.paymentTokens);
        address _currencyAddress = payment.getPaymentToken(paymentTokenIx);
        IERC20 erc20Currency = IERC20(_currencyAddress);
        erc20Currency.transferFrom(msg.sender, nft.sellerAddress, downPayment);
        erc20Currency.transferFrom(msg.sender, owner(), platfromFee);

        _ERCX.safeTransferUser(owner(), msg.sender, _id);

        nft.startTime = block.timestamp;
        nft.nextPayment = nft.startTime + nft.paymentPeriod;
        amountPayed[_id] += total;
        isDownPaymentPayed[_id] = true;
        nft.status = "Downpayment paid";
        idTobuyer[_id] = msg.sender;

        emit DownPayment(_id, "Downpayment paid");
    }

    function sendPeriodicPayment(uint128 _id, uint128 _periodicPayment)
        external
        nonReentrant
    {
        _verifyIsNotZeroAddr(msg.sender);
        NftFinance storage nft = idToNftFinance[_id];

        uint8 paymentTokenIx = uint8(nft.paymentTokens);
        address _currencyAddress = payment.getPaymentToken(paymentTokenIx);
        IERC20 erc20Currency = IERC20(_currencyAddress);

        uint256 result = nft.price -
            calculateDownPayment(nft.price, nft.downPayment);
        require(
            idToPeriodicPayment[_id] <= _periodicPayment &&
                _periodicPayment <= result,
            "NftFinance: in-correct periodic payment"
        );
        require(msg.sender != nft.sellerAddress, "NftFinance: not authorized");
        if (block.timestamp > nft.startTime + nft.duration) {
            revert("NftFinance: duration ended");
        }
        require(msg.sender == idTobuyer[_id], "NftFinance: buyer only");

        if (block.timestamp > nft.nextPayment) {
            revert("NftFinance: periodic payment missed");
        }

        uint256 platfromFee = calculateFee(nft.price);
        if (amountPayed[_id] >= (nft.price + platfromFee)) {
            revert("NftFinance: amount paid. claim nft now");
        }

        erc20Currency.transferFrom(
            msg.sender,
            nft.sellerAddress,
            _periodicPayment
        );
        amountPayed[_id] += _periodicPayment;
        nft.nextPayment += nft.paymentPeriod;

        emit PeriodPayment(_id, nft.price + platfromFee, amountPayed[_id]);
    }

    function ownerClaimNft(uint256 _id) external nonReentrant {
        NftFinance storage nft = idToNftFinance[_id];
        require(
            isDownPaymentPayed[_id],
            "NftFinance: downpayment is payed you can not un list the Nft"
        );

        require(
            block.timestamp > nft.startTime + nft.duration,
            "NftFinance: you can not claim your Nft until buyer fails to pay the full Nft price"
        );
        require(
            msg.sender == nft.sellerAddress,
            "NftFinance: you are not the seller"
        );
        IERC721 token = IERC721(nft.nftContract);

        token.safeTransferFrom(
            address(this),
            payable(nft.sellerAddress),
            nft.nftId
        );

        _ERCX.safeTransferUser(idTobuyer[_id], owner(), _id);
        _ERCX.revokeLien(_id);

        emit NftTransferred(_id, "seller claimed NFT");
        delete idToNftFinance[_id];
        delete idTobuyer[_id];
        delete isDownPaymentPayed[_id];
        delete amountPayed[_id];
    }

    function claimNft(uint256 _id) external {
        require(
            msg.sender == idTobuyer[_id],
            "NftFinance: you can't claim this Nft"
        );
        NftFinance storage nft = idToNftFinance[_id];
        require(
            amountPayed[_id] == (nft.price + calculateFee(nft.price)),
            "NftFinance: you have not payed full payment yet"
        );
        IERC721 token = IERC721(nft.nftContract);
        token.safeTransferFrom(address(this), payable(msg.sender), nft.nftId);

        _ERCX.safeTransferUser(msg.sender, owner(), _id);
        _ERCX.revokeLien(_id);

        emit NftTransferred(_id, "Buyer claimed NFT");
        delete idToNftFinance[_id];
        delete idTobuyer[_id];
        delete isDownPaymentPayed[_id];
        delete amountPayed[_id];
    }

    /**
     * verify whether caller is zero aaddress or not
     */
    function _verifyIsNotZeroAddr(address _addr) private pure {
        require(_addr != address(0), "vRent::zero address");
    }

    function getPeriodicAmount(uint8 _tradeID) external view returns (uint256) {
        return idToPeriodicPayment[_tradeID];
    }

    function getNftData(uint128 _id) external view returns (NftFinance memory) {
        return idToNftFinance[_id];
    }
}
