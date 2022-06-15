const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ETH-FINANCE , payment Token ,payment, NFT and ERCX", function () {

  beforeEach(async function () {
    [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();

    let fee = 100; //10%

    //payment contract
    payment = await ethers.getContractFactory("payment"); 
    pay = await payment.deploy(owner.address);

    //nft contrcat
    holderNft = await ethers.getContractFactory("holderNft"); 
    nft = await holderNft.deploy();

    //ERC20 Token
    MyToken = await ethers.getContractFactory("MyToken"); 
    token = await MyToken.deploy();

    //Mock2615 -ERCX 
    Mock2615 = await ethers.getContractFactory("Mock2615"); 
    ERCX = await Mock2615.deploy();

     //veraFinance 
     VeraFinance721 = await ethers.getContractFactory("VeraFinance721"); 
     vera = await VeraFinance721.deploy(fee ,pay.address, ERCX.address );
  });

describe("Deployment", function () {

    it("check the owner of the vera Finance contract", async function () {
      expect(await vera.owner()).to.equal(owner.address);
    });

   
  }); 

  describe("name and symbol", function () {

    it("check the name of erc20 contract", async function () {
      expect(await token.name()).to.equal("USDTDOLLAR");
    });

    it("check the symbol of erc20 contract", async function () {
      expect(await token.symbol()).to.equal("USDT");
    });

    it("check the name of nft contract", async function () {
      expect(await nft.name()).to.equal("HOLDER");
    });

    it("check the symbol of nft contract", async function () {
      expect(await nft.symbol()).to.equal("HLD");
    });

    it("check the name of ERCX contract", async function () {
      expect(await ERCX.name()).to.equal("Tests");
    });

    it("check the symbol of ERCX contract", async function () {
      expect(await ERCX.symbol()).to.equal("TSTSS");
    });
  }); 

describe("Set Payment Method", function () {
  it("set payment method and get it", async function () {
    await pay.setPaymentToken(1, token.address);
    expect(await pay.getPaymentToken(1)).to.equal(token.address);
});
});

describe("list a nft", function (){

  it("mint a erc721 nft and give approval to vera contract", async function(){
    await nft.connect(addr1).safeMint();
    expect(await nft.connect(addr1).ownerOf(1)).to.equal(addr1.address);

    await nft.connect(addr1).approve(vera.address, 1);
    expect(await nft.connect(addr1).getApproved(1)).to.equal(vera.address);
  });

  it("mint a ERCX nft and approve lien to vera contract", async function(){
    await ERCX.mint(owner.address);
    expect(await ERCX.ownerOf(1)).to.equal(owner.address);

    await ERCX.approveLien(vera.address, 1);
    expect(await ERCX.getApprovedLien(1)).to.equal(vera.address);
  });

  it("List nft in the vera contract and check counter", async function(){
    await pay.setPaymentToken(1, token.address);
    await nft.connect(addr1).safeMint();
    await nft.connect(addr1).approve(vera.address, 1);
    await ERCX.mint(owner.address);
    await ERCX.approveLien(vera.address, 1);
    expect (await vera.connect(addr1).tradeCounter()).to.equal(1);    
    await vera.connect(addr1).listNft(1, 1000, 60, 100, 120, nft.address, 1);
    expect (await vera.connect(addr1).tradeCounter()).to.equal(2);    
    
  });
});
  describe("Buy nft/ send downpayment", function (){

    beforeEach(async function () {
      await pay.setPaymentToken(1, token.address);
      await nft.connect(addr1).safeMint();
      await nft.connect(addr1).approve(vera.address, 1);
      await ERCX.mint(owner.address);
      await ERCX.approveLien(vera.address, 1); 
      await vera.connect(addr1).listNft(1, 1000, 60, 100, 120, nft.address, 1);
 });


it("check fee", async function(){
  let fee = 100; //10%
  expect(await vera.fee()).to.equal(fee);   
  
});

 it("addr2 should mint some tokens from the token contract", async function(){
   amount = 1000000;
   await token.connect(addr2).mint(1000000);
   expect(await token.balanceOf(addr2.address)).to.equal(amount);
  
});

it("addr2 should give approval for the tokens", async function(){
  amount = 1000000;
  await token.connect(addr2).mint(amount);
  expect(await token.balanceOf(addr2.address)).to.equal(amount);
  await token.connect(addr2).approve(vera.address, amount);
  expect(await token.allowance(addr2.address, vera.address)).to.equal(amount);
 
});

it("addr2 should pay Wrong down payment for the listed nft", async function(){



  amount = 1000000;
  downpayment = 200; // for 1000 price, 10% fee and 10% downpayment
  await token.connect(addr2).mint(amount);
  expect(await token.balanceOf(addr2.address)).to.equal(amount);
  await token.connect(addr2).approve(vera.address, amount);
  expect(await token.allowance(addr2.address, vera.address)).to.equal(amount);
  expect(await vera.tradeCounter()).to.equal(2);
  await  expect(vera.connect(addr2).payDownpayment(1, 500)).to.revertedWith("unsufficient amount send");
 
});

it("addr2 should provide wrong tradeId for the listed nft", async function(){

  amount = 1000000;
  downpayment = 200; // for 1000 price, 10% fee and 10% downpayment
  await token.connect(addr2).mint(amount);
  expect(await token.balanceOf(addr2.address)).to.equal(amount);
  await token.connect(addr2).approve(vera.address, amount);
  expect(await token.allowance(addr2.address, vera.address)).to.equal(amount);
  expect(await vera.tradeCounter()).to.equal(2);
  await expect( vera.connect(addr2).payDownpayment(5, 200)).to.revertedWith("unsufficient amount send");
 
});

it("addr1 should unlist its listed nft and check the updated owner", async function(){
  expect(await nft.ownerOf(1)).to.equal(vera.address);
  await vera.connect(addr1).unListNft(1);
  expect(await nft.ownerOf(1)).to.equal(addr1.address)
 
});
});
describe("set Fee", function () {

  it("set the fee to 1000 and check new fee", async function () {
    newFee = 500;
    await vera.setFee(newFee);
    expect(await vera.fee()).to.equal(newFee);
  });

 
}); 

}); 