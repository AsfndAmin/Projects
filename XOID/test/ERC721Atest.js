const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC721A, HOLDER CONTRACT", function () {

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    publicPrice = "188000000000000000";
    publicPriceEth = "0.188";
    holderPrice = "155000000000000000";
    holderPriceEth = "0.155";
    maxSupply = 3333;
    maxMintAlloed = 3;

    //HOLDER contrcat
    holderNft = await ethers.getContractFactory("holderNft"); 
    holder = await holderNft.deploy();

    //ERC721A contract
    Siku = await ethers.getContractFactory("Siku"); 
    xoid = await Siku.deploy(holder.address);

  });

describe("Deployment", function () {

    it("check the owner of the xoidNfts contract", async function () {
      expect(await xoid.owner()).to.equal(owner.address);
    });

    it("check the owner of the holderNft contract", async function () {
      expect(await holder.owner()).to.equal(owner.address);
    });

  }); 

  describe("name and symbol", function () {

    it("check the name of xoid contract", async function () {
      expect(await xoid.name()).to.equal("Siku");
    });

    it("check the symbol of xoid contract", async function () {
      expect(await xoid.symbol()).to.equal("Siku");
    });

    it("check the name of holder contract", async function () {
      expect(await holder.name()).to.equal("HOLDER");
    });

    it("check the symbol of holder contract", async function () {
      expect(await holder.symbol()).to.equal("HLD");
    });
  }); 

  describe("public mint and holder mint ", function () {

    it("check public mint price", async function () {
      expect(await xoid.PUBLIC_MINT_PRICE()).to.equal(publicPrice);
    });

    it("check the holder mint price", async function () {
      expect(await xoid.XOID_HOLDERS_PRICE()).to.equal(holderPrice);
    });

  }); 

  describe("mintPrice and maxSupply ", function () {

    it("check maxSupply", async function () {
      expect(await xoid.MAX_SUPPLY()).to.equal(maxSupply);
    });

    it("check the max mint allowed", async function () {
      expect(await xoid.MAX_MINT_ALLOWED()).to.equal(maxMintAlloed);
    });

  }); 

  describe("mint", function () {

    it("should mint 1 nft and check balance", async function () {
      await xoid.mint(owner.address, 1, {
        value: ethers.utils.parseEther(publicPriceEth)
    });
      expect(await xoid.balanceOf(owner.address)).to.equal(1);
    });

    it("should mint 3 nfts and check balance", async function () {
      value = ("0.564");
      expect(await xoid.mint(owner.address,3, {
        value: ethers.utils.parseEther(value)
    }));
      expect(await xoid.balanceOf(owner.address)).to.equal(3);
    });

  }); 

  describe("Holders Mint", function () {

    it("should mint 1 nft without holding a nft and check balance", async function () {
       xoid.xoidHoldersMint(owner.address, 1, {
        value: ethers.utils.parseEther(holderPrice)
    });
      expect(await xoid.balanceOf(owner.address)).to.equal(0);
    });

    it("should mint 1 nft holding a nft and check balance balance should be 1", async function () {
      await holder.safeMint(owner.address);
      expect(await holder.balanceOf(owner.address)).to.equal(1);
      await xoid.xoidHoldersMint(owner.address, [0] , {
       value: ethers.utils.parseEther(holderPriceEth)
    });
     expect(await xoid.balanceOf(owner.address)).to.equal(1);
   });

   it("should mint 3 nft  and should be holding 3 nft", async function () {
     priceForThree = "0.465";
    await holder.safeMint(owner.address);
    await holder.safeMint(owner.address);
    await holder.safeMint(owner.address);
    expect(await holder.balanceOf(owner.address)).to.equal(3);
    await xoid.xoidHoldersMint(owner.address, [0,1,2] , {
     value: ethers.utils.parseEther(priceForThree)
  });
   expect(await xoid.balanceOf(owner.address)).to.equal(3);
  });

  it("should mint 3 nft  and should be holding only 2 nfts nft and function should revert", async function () {
    priceForThree = "0.465";
   await holder.safeMint(owner.address);
   await holder.safeMint(owner.address);
   expect(await holder.balanceOf(owner.address)).to.equal(2);
   await expect( xoid.xoidHoldersMint(owner.address, [0,1,2] , {
   value: ethers.utils.parseEther(priceForThree)
   })).to.be.revertedWith("owner query for nonexistent token");
   expect(await xoid.balanceOf(owner.address)).to.equal(0);
  });

  it("should mint 3 nft  and should try to mint again with the same ids and function should revert", async function () {
    priceForThree = "0.465";
    await holder.safeMint(owner.address);
    await holder.safeMint(owner.address);
    await holder.safeMint(owner.address);
    expect(await holder.balanceOf(owner.address)).to.equal(3);
    await xoid.xoidHoldersMint(owner.address, [0,1,2] , {
     value: ethers.utils.parseEther(priceForThree)
  });
   expect(await xoid.balanceOf(owner.address)).to.equal(3);
   await expect( xoid.xoidHoldersMint(owner.address, [0,1,2] , {
    value: ethers.utils.parseEther(priceForThree)
    })).to.be.revertedWith("");
   expect(await xoid.balanceOf(owner.address)).to.equal(3);
  });

  
  }); 

  describe("Holders token filter", function () {

    it("should hold 3 nfts and try to mint nft using a already redemmed id ", async function () {
      await holder.safeMint(owner.address);
      await holder.safeMint(owner.address);
      await holder.safeMint(owner.address);
      expect(await holder.balanceOf(owner.address)).to.equal(3);
       xoid.xoidHoldersMint(owner.address, [0,1], {
        value: ethers.utils.parseEther("0.31")
    });
      expect(await xoid.balanceOf(owner.address)).to.equal(2);
      xoid.xoidHoldersMint(owner.address, [1,2], {
       value: ethers.utils.parseEther("0.31")
      });
      expect(await xoid.balanceOf(owner.address)).to.equal(3);
      expect(await xoid.checkContractBalance()).to.equal("620000000000000000");

      
      xoid.xoidHoldersMint(owner.address, [1,2,3], {
       value: ethers.utils.parseEther("0.465")
      });
      expect(await xoid.balanceOf(owner.address)).to.equal(3);
      expect(await xoid.checkContractBalance()).to.equal(0);
    });

    it("should mint 1 nft holding a nft and check balance balance should be 1", async function () {
      await holder.safeMint(owner.address);
      expect(await holder.balanceOf(owner.address)).to.equal(1);
      await xoid.xoidHoldersMint(owner.address, [0] , {
       value: ethers.utils.parseEther(holderPriceEth)
    });
     expect(await xoid.balanceOf(owner.address)).to.equal(1);
   });
}); 
});