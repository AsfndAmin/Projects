
const { expect } = require("chai");
const { ethers } = require("hardhat");
// import {MockProvider, solidity} from 'ethereum-waffle';

describe("owlDapp", function () {

  beforeEach(async function () {
    const IlluminatiOwls = await ethers.getContractFactory("IlluminatiOwls");
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    ERC721A = await IlluminatiOwls.deploy();
    

  });


describe("Deployment", function () {

  it("check the max supply check the max supply", async function () {
    expect(await ERC721A._maxSupply()).to.equal(3333);
  });

    it("check the owner of the contract", async function () {
      expect(await ERC721A.owner()).to.equal(owner.address);
    });
  }); 

  describe("check name and symbol of the nft", function(){

    it("should mconfirm the name of the contract", async function(){
      expect(await ERC721A.name()).to.equal("illuminati Owls");
    });
  
    it("should confirm the symbol of the nft", async function(){
      expect(await ERC721A.symbol()).to.equal("ILO");
    });
  });
  


describe("Hoot Mint", function(){
    beforeEach(async function () {
        var startTime = Math.floor(Date.now() / 1000)
        var endTime = startTime + 500;
       await ERC721A.setHootWhitelistMerkleRoot("0xdecb3cdd5b43dd51cee39ab05ef21df5b15b30c1aa1ab1bc86c658ccd166bb7f");
       await ERC721A.setHootMintTime(startTime, endTime);
       await ERC721A.addHootMintLimit(6);
       expect(await ERC721A.hootStartTime()).to.equal(startTime);
       expect(await ERC721A.hootEndTime()).to.equal(endTime);
      });




  it("should mint 1 hoot nft by a non whitelisted user", async function(){
     await expect (ERC721A.hootMint(1, [
        "0xc23d89d4ba0f8b56a459710de4b44820d73e93736cfc0667f35cdd5142b70f0d"]))
        .to.be.revertedWith("MerkleWhitelist: Caller is not whitelisted");
     expect(await ERC721A.balanceOf(owner.address)).to.equal(0);
  });

  it("should mint 1 hoot nft by a whitelisted user", async function(){
    await ERC721A.connect(addr1).hootMint(1, [
        "0x999bf57501565dbd2fdcea36efa2b9aef8340a8901e3459f4a4c926275d36cdb",
        "0xda2a605bdf59a3b18e24cd0b2d9110b6ffa2340f6f67bc48214ac70e49d12770",
        "0xc23d89d4ba0f8b56a459710de4b44820d73e93736cfc0667f35cdd5142b70f0d"
      ]);
    expect(await ERC721A.balanceOf(addr1.address)).to.equal(1);
 });

 it("should mint 3 hoot nft by a whitelisted user", async function(){
    await ERC721A.connect(addr1).hootMint(3, [
        "0x999bf57501565dbd2fdcea36efa2b9aef8340a8901e3459f4a4c926275d36cdb",
        "0xda2a605bdf59a3b18e24cd0b2d9110b6ffa2340f6f67bc48214ac70e49d12770",
        "0xc23d89d4ba0f8b56a459710de4b44820d73e93736cfc0667f35cdd5142b70f0d"
      ]);
    expect(await ERC721A.balanceOf(addr1.address)).to.equal(3);
 });

 it("should mint 4 hoot nft by a whitelisted user", async function(){
    await expect (ERC721A.connect(addr1).hootMint(4, [
        "0x999bf57501565dbd2fdcea36efa2b9aef8340a8901e3459f4a4c926275d36cdb",
        "0xda2a605bdf59a3b18e24cd0b2d9110b6ffa2340f6f67bc48214ac70e49d12770",
        "0xc23d89d4ba0f8b56a459710de4b44820d73e93736cfc0667f35cdd5142b70f0d"
      ])).to.be.revertedWith("");
    expect(await ERC721A.balanceOf(addr1.address)).to.equal(0);
 });

 it("should check the hoot mint limit ", async function(){
    await ERC721A.addHootMintLimit(2);
    await expect (ERC721A.connect(addr1).hootMint(3, [
        "0x999bf57501565dbd2fdcea36efa2b9aef8340a8901e3459f4a4c926275d36cdb",
        "0xda2a605bdf59a3b18e24cd0b2d9110b6ffa2340f6f67bc48214ac70e49d12770",
        "0xc23d89d4ba0f8b56a459710de4b44820d73e93736cfc0667f35cdd5142b70f0d"
      ])).to.be.revertedWith("");
    expect(await ERC721A.balanceOf(addr1.address)).to.equal(0);
 });

  it("should transfer 1 nfts to the addr2 account and check its balance", async function(){
    await ERC721A.connect(addr1).hootMint(1, [
        "0x999bf57501565dbd2fdcea36efa2b9aef8340a8901e3459f4a4c926275d36cdb",
        "0xda2a605bdf59a3b18e24cd0b2d9110b6ffa2340f6f67bc48214ac70e49d12770",
        "0xc23d89d4ba0f8b56a459710de4b44820d73e93736cfc0667f35cdd5142b70f0d"
      ]);
    expect(await ERC721A.balanceOf(addr1.address)).to.equal(1);
    expect(await ERC721A.connect(addr1).transferFrom(addr1.address, addr2.address, 1));
    expect(await ERC721A.balanceOf(addr2.address)).to.equal(1);
  });

  it("should mint 1 hoot nft by a whitelisted user before time starts and after time ends", async function(){
    var start = Math.floor(Date.now() / 1000) + 500;
    var end = start + 500;
    var end1 = start - 1000;
    var start1 = start - 2000;
    await ERC721A.setHootMintTime(start, end);
    await expect(ERC721A.connect(addr1).hootMint(1, [
        "0x999bf57501565dbd2fdcea36efa2b9aef8340a8901e3459f4a4c926275d36cdb",
        "0xda2a605bdf59a3b18e24cd0b2d9110b6ffa2340f6f67bc48214ac70e49d12770",
        "0xc23d89d4ba0f8b56a459710de4b44820d73e93736cfc0667f35cdd5142b70f0d"
      ])).to.be.revertedWith("sale not live");
    expect(await ERC721A.balanceOf(addr1.address)).to.equal(0);
    await ERC721A.setHootMintTime(start1, end1);
    await expect(ERC721A.connect(addr1).hootMint(1, [
        "0x999bf57501565dbd2fdcea36efa2b9aef8340a8901e3459f4a4c926275d36cdb",
        "0xda2a605bdf59a3b18e24cd0b2d9110b6ffa2340f6f67bc48214ac70e49d12770",
        "0xc23d89d4ba0f8b56a459710de4b44820d73e93736cfc0667f35cdd5142b70f0d"
      ])).to.be.revertedWith("sale not live");
    expect(await ERC721A.balanceOf(addr1.address)).to.equal(0);
 });
});



describe("Whitelist Mint", function(){
    beforeEach(async function () {

        var mintfee = "100000000";
       var startTime = Math.floor(Date.now() / 1000)
       await ERC721A.setPublicWhitelistMerkleRoot("0xdecb3cdd5b43dd51cee39ab05ef21df5b15b30c1aa1ab1bc86c658ccd166bb7f");
       await ERC721A.setWlMintTime(startTime);
       await ERC721A.setMintingFee(mintfee);
       expect(await ERC721A.wlStartTime()).to.equal(startTime);
       expect(await ERC721A._mintFee()).to.equal(mintfee);
      });


      it("should mint 1 nft by a non whitelisted user in whitelist mint", async function(){
        await expect (ERC721A.whitelistMint(1, [
           "0xc23d89d4ba0f8b56a459710de4b44820d73e93736cfc0667f35cdd5142b70f0d"]))
           .to.be.revertedWith("MerkleWhitelist: Caller is not whitelisted");
        expect(await ERC721A.balanceOf(owner.address)).to.equal(0);
     });

     
     it("should mint 1 nft by whitelistMint ", async function(){
        fee = "0.0000000001";
        await ERC721A.connect(addr1).whitelistMint(1, [
            "0x999bf57501565dbd2fdcea36efa2b9aef8340a8901e3459f4a4c926275d36cdb",
            "0xda2a605bdf59a3b18e24cd0b2d9110b6ffa2340f6f67bc48214ac70e49d12770",
            "0xc23d89d4ba0f8b56a459710de4b44820d73e93736cfc0667f35cdd5142b70f0d"
          ], {
            value: ethers.utils.parseEther(fee)
         });
        expect(await ERC721A.balanceOf(addr1.address)).to.equal(1);
     });

     it("should mint 10 using whitelist mint", async function(){
        fee = "0.0000000010";
        await ERC721A.connect(addr1).whitelistMint(10, [
            "0x999bf57501565dbd2fdcea36efa2b9aef8340a8901e3459f4a4c926275d36cdb",
            "0xda2a605bdf59a3b18e24cd0b2d9110b6ffa2340f6f67bc48214ac70e49d12770",
            "0xc23d89d4ba0f8b56a459710de4b44820d73e93736cfc0667f35cdd5142b70f0d"
          ], {
            value: ethers.utils.parseEther(fee)
         });
        expect(await ERC721A.balanceOf(addr1.address)).to.equal(10);
     });

     it("should try to  mint 10 nfts using whitelist mint before the sale starts", async function(){
        var start = Math.floor(Date.now() / 1000) + 500;
        await ERC721A.setWlMintTime(start);
        fee = "0.0000000010";
      await   expect(ERC721A.connect(addr1).whitelistMint(10, [
            "0x999bf57501565dbd2fdcea36efa2b9aef8340a8901e3459f4a4c926275d36cdb",
            "0xda2a605bdf59a3b18e24cd0b2d9110b6ffa2340f6f67bc48214ac70e49d12770",
            "0xc23d89d4ba0f8b56a459710de4b44820d73e93736cfc0667f35cdd5142b70f0d"
          ], {
            value: ethers.utils.parseEther(fee)
         })).to.be.revertedWith("");
        expect(await ERC721A.balanceOf(addr1.address)).to.equal(0);
     });

     it("should try to  mint 10 nfts using whitelist mint after the sale ends", async function(){
        var start = Math.floor(Date.now() / 1000) + 500;
        await ERC721A.setWlMintTime(start);
        await network.provider.send("evm_increaseTime", [10000]);
        fee = "0.0000000010";
      await   expect(ERC721A.connect(addr1).whitelistMint(10, [
            "0x999bf57501565dbd2fdcea36efa2b9aef8340a8901e3459f4a4c926275d36cdb",
            "0xda2a605bdf59a3b18e24cd0b2d9110b6ffa2340f6f67bc48214ac70e49d12770",
            "0xc23d89d4ba0f8b56a459710de4b44820d73e93736cfc0667f35cdd5142b70f0d"
          ], {
            value: ethers.utils.parseEther(fee)
         })).to.be.revertedWith("");
        expect(await ERC721A.balanceOf(addr1.address)).to.equal(0);
     });


   });

   describe("publicMint", function(){
    beforeEach(async function () {

        var mintfee = "100000000";
       var startTime = Math.floor(Date.now() / 1000) - 7200;
       await ERC721A.setWlMintTime(startTime);
       await ERC721A.setMintingFee(mintfee);
       expect(await ERC721A._mintFee()).to.equal(mintfee);
      });

      it("should mint 1 nft and check balance", async function () {
        fee = "0.0000000001";
        await ERC721A.publicMint( 1, {
          value: ethers.utils.parseEther(fee)
      });
        expect(await ERC721A.balanceOf(owner.address)).to.equal(1);
      });

      it("should mint 10  nft and check balance", async function () {
        fee = "0.0000000010";
        await ERC721A.publicMint( 10, {
          value: ethers.utils.parseEther(fee)
      });
        expect(await ERC721A.balanceOf(owner.address)).to.equal(10);
      });

      it("should mint more than max supply and check balance", async function () {
        fee = "0.0000000010";
        await expect(ERC721A.publicMint(3334, {
          value: ethers.utils.parseEther(fee)
      })).to.be.revertedWith("Max supply reached");
        expect(await ERC721A.balanceOf(owner.address)).to.equal(0);
      });
      


});
});