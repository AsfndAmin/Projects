const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UtopiaRewardPool , Reward Token and NFT", function () {

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    //reward token contract
    rewardToken = await ethers.getContractFactory("rewardToken"); 
    token = await rewardToken.deploy();

    //nft contrcat
    MyNFT = await ethers.getContractFactory("MyNFT"); 
    nft = await MyNFT.deploy();

   //utopia contract
    UtopiaRewardPool = await ethers.getContractFactory("UtopiaRewardPool"); 
    utopia = await UtopiaRewardPool.deploy(token.address, nft.address, 100000);
  });

describe("Deployment", function () {

    it("check the owner of the utopiaReward contract", async function () {
      expect(await utopia.owner()).to.equal(owner.address);
    });

    it("check the owner of the Reward Token contract", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });

    it("check the owner of the nft Token contract", async function () {
      expect(await nft.owner()).to.equal(owner.address);
    });
  }); 

  describe("name and symbol", function () {

    it("check the name of token contract", async function () {
      expect(await token.name()).to.equal("REWARD");
    });

    it("check the symbol of Token contract", async function () {
      expect(await token.symbol()).to.equal("RWDT");
    });

    it("check the name of nft contract", async function () {
      expect(await nft.name()).to.equal("BUILDMYDAPP");
    });

    it("check the symbol of nft contract", async function () {
      expect(await nft.symbol()).to.equal("BMD");
    });
  }); 

  describe("Set NFT Amounts", function () {

    it("check if all the amounts are equal to 0", async function () {
      expect(await utopia.diamondQuantity()).to.equal(0);
      expect(await utopia.goldQuantity()).to.equal(0);
      expect(await utopia.silverQuantity()).to.equal(0);
    });

    it("set the nft quantity and check", async function () {
      _diamondquantity = 2000;
      _goldquantity = 3000;
      _silverQuantity = 5000;
      expect(await utopia.setNftsAmount(_diamondquantity, _goldquantity, _silverQuantity));

      expect(await utopia.diamondQuantity()).to.equal(_diamondquantity);
      expect(await utopia.goldQuantity()).to.equal(_goldquantity);
      expect(await utopia.silverQuantity()).to.equal(_silverQuantity);
    });
  });

  describe("Set NFT weightage", function () {

    beforeEach(async function () {
      _diamondQuantity = 2000;
      _goldQuantity = 3000;
      _silverQuantity = 5000;
      expect(await utopia.setNftsAmount(_diamondquantity, _goldquantity, _silverQuantity));

      expect(await utopia.diamondQuantity()).to.equal(_diamondQuantity);
      expect(await utopia.goldQuantity()).to.equal(_goldQuantity);
      expect(await utopia.silverQuantity()).to.equal(_silverQuantity);

      _diamondWeightage = 50000;
      _goldWeightage = 30000;
      _silverWeightage = 20000;

      _diamondShare = 25;
      _goldShare = 10;
      _silverShare = 4;


    });

    it("should set the NFT Weightage", async function () {

      expect(await utopia.addNftWeightage(_diamondWeightage, _goldWeightage, _silverWeightage));

    });

    it("should add nft weightage and then check the share", async function () {
      expect(await utopia.addNftWeightage(_diamondWeightage, _goldWeightage, _silverWeightage));

      expect(await utopia.nftShare(0)).to.equal(_diamondShare);
      expect(await utopia.nftShare(1)).to.equal(_goldShare);
      expect(await utopia.nftShare(2)).to.equal(_silverShare);
    });
  });

  describe("Distribute Reward", function () {

    beforeEach(async function () {

      _diamondQuantity = 2000;
      _goldQuantity = 3000;
      _silverQuantity = 5000;
      expect(await utopia.setNftsAmount(_diamondquantity, _goldquantity, _silverQuantity));

      _reward = "10000000000000000000000";
      _diamondWeightage = 50000;
      _goldWeightage = 30000;
      _silverWeightage = 20000;
      expect(await utopia.addNftWeightage(_diamondWeightage, _goldWeightage, _silverWeightage));

    });

    it("Owner should mint and approve the uthopia contract", async function () {
      expect( await token.mint(_reward));
      expect(await token.balanceOf(owner.address)).to.equal(_reward);

      expect(await token.approve(utopia.address, _reward));
      expect(await token.allowance(owner.address, utopia.address)).to.equal(_reward);



    });

    it("should distribute reward and check expected reward of NFTs", async function () {
      expect( await token.mint(_reward));
      expect(await token.balanceOf(owner.address)).to.equal(_reward);
      expect(await token.approve(utopia.address, _reward));
      expect(await token.allowance(owner.address, utopia.address)).to.equal(_reward);
      
      expect(await token.balanceOf(utopia.address)).to.equal(0);
      expect(await utopia.distributeRewards(_reward));
      expect(await token.balanceOf(utopia.address)).to.equal(_reward);
    });
  });

  describe("Set NFT weightage", function () {

    beforeEach(async function () {
      _diamondQuantity = 2000;
      _goldQuantity = 3000;
      _silverQuantity = 5000;
      expect(await utopia.setNftsAmount(_diamondquantity, _goldquantity, _silverQuantity));

      expect(await utopia.diamondQuantity()).to.equal(_diamondQuantity);
      expect(await utopia.goldQuantity()).to.equal(_goldQuantity);
      expect(await utopia.silverQuantity()).to.equal(_silverQuantity);

      _diamondWeightage = 50000;
      _goldWeightage = 30000;
      _silverWeightage = 20000;

      _diamondShare = 25;
      _goldShare = 10;
      _silverShare = 4;


    });

    it("should set the NFT Weightage", async function () {

      expect(await utopia.addNftWeightage(_diamondWeightage, _goldWeightage, _silverWeightage));

    });

    it("should add nft weightage and then check the share", async function () {
      expect(await utopia.addNftWeightage(_diamondWeightage, _goldWeightage, _silverWeightage));

      expect(await utopia.nftShare(0)).to.equal(_diamondShare);
      expect(await utopia.nftShare(1)).to.equal(_goldShare);
      expect(await utopia.nftShare(2)).to.equal(_silverShare);
    });
  });

  describe("Rewards Check", function () {

    beforeEach(async function () {

      _diamondQuantity = 2000;
      _goldQuantity = 3000;
      _silverQuantity = 5000;
      expect(await utopia.setNftsAmount(_diamondquantity, _goldquantity, _silverQuantity));

      _reward = "10000000000000000000000";
      _diamondWeightage = 50000;
      _goldWeightage = 30000;
      _silverWeightage = 20000;
      expect(await utopia.addNftWeightage(_diamondWeightage, _goldWeightage, _silverWeightage));


      expect(await token.mint(_reward));
      expect(await token.approve(utopia.address, _reward));
      expect(await utopia.distributeRewards(_reward));

      zero = "0";
      reward1 = "2500000000000000000";
      reward2 = "1000000000000000000";
      reward3 = "400000000000000000";

//                      NFTs        Each Wegihtage      Each NFT W      Rewards got      Each NFT rewards got
// Diamond Weightage    2000          50000                25               5000              2.5 
// Gold Wieghtage       3000          30000                10               3000               1
// Silver Weightage     5000          20000                 4               2000              0.4
// Total NFTS           10000
// Total Weihtage       100000        10000

    });

    it("check the cumulative reward", async function () {
      expect(await utopia.cumulativeRewardsOf(1)).to.equal(reward1);
      expect(await utopia.cumulativeRewardsOf(2001)).to.equal(reward2);
      expect(await utopia.cumulativeRewardsOf(5001)).to.equal(reward3);

    });

    
    it("check the withdrawableRewardOf", async function () {
      expect(await utopia.withdrawableRewardsOf(1)).to.equal(reward1);
      expect(await utopia.withdrawableRewardsOf(2001)).to.equal(reward2);
      expect(await utopia.withdrawableRewardsOf(5001)).to.equal(reward3);

    });


    it("should restrict nfts and check their rewards", async function () {
      expect(await utopia.excludeFromRewards(["1","2001","5001"], true));
      expect(await utopia.cumulativeRewardsOf(1)).to.equal(zero);
      expect(await utopia.cumulativeRewardsOf(2001)).to.equal(zero);
      expect(await utopia.cumulativeRewardsOf(5001)).to.equal(zero);
      expect(await utopia.withdrawableRewardsOf(1)).to.equal(zero);
      expect(await utopia.withdrawableRewardsOf(2001)).to.equal(zero);
      expect(await utopia.withdrawableRewardsOf(5001)).to.equal(zero);

    });

    it("should restrict nfts and check the rewards of other nfts then exclude them and check reward", async function () {
      expect(await utopia.excludeFromRewards(["1","2001","5001"], true));
      expect(await utopia.cumulativeRewardsOf(2)).to.equal(reward1);
      expect(await utopia.cumulativeRewardsOf(2002)).to.equal(reward2);
      expect(await utopia.cumulativeRewardsOf(5002)).to.equal(reward3);
      expect(await utopia.excludeFromRewards(["1","2001","5001"], false));
      expect(await utopia.cumulativeRewardsOf(1)).to.equal(reward1);
      expect(await utopia.cumulativeRewardsOf(2001)).to.equal(reward2);
      expect(await utopia.cumulativeRewardsOf(5001)).to.equal(reward3);


    });

    it("should claim reward and check balance", async function () {
      expect(await nft.safeMint(addr1.address));
      expect(await nft.ownerOf(0)).to.equal(addr1.address);
      expect(await utopia.cumulativeRewardsOf(0)).to.equal(reward1);
      expect(await utopia.connect(addr1).claimRewards(0));
      expect(await token.balanceOf(addr1.address)).to.equal(reward1);
       expect(await utopia.withdrawableRewardsOf(0)).to.equal(zero);



    });
  });




}); 
