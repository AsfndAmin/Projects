// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const nftContract = "0xaC8901a209c63eD86B03A4DE17dE67CF8575b20B"; // Put NFT contract address here.
  const rewardToken = "0xaC8901a209c63eD86B03A4DE17dE67CF8575b20B"; //
  let totalWeightage = 100000;
  let decimals = 1000000000000000000;

  const diamondAmount = 2000;
  const goldAmount = 3000;
  const silverAmount = 5000;

  let diamondWeightage = 50000;
  let goldWeightage = 30000;
  let silverWeightage = 20000;

  totalWeightage = (totalWeightage * decimals).toFixed(0).toString();
  console.log(totalWeightage, "tottlttl");
  diamondWeightage = (diamondWeightage * decimals).toFixed(0).toString();
  goldWeightage = (goldWeightage * decimals).toFixed(0).toString();
  silverWeightage = (silverWeightage * decimals).toFixed(0).toString();

  // We get the contract to deploy
  const UtopiaRewardPool = await hre.ethers.getContractFactory(
    "UtopiaRewardPool"
  );
  const rewardPool = await UtopiaRewardPool.deploy(
    rewardToken,
    nftContract,
    totalWeightage
  );

  await rewardPool.deployed();

  console.log("Utopia Reward Pool deployed to:", rewardPool.address);

  await rewardPool.setNftsAmount(diamondAmount, goldAmount, silverAmount);
  // await rewardPool.addNftWeightage(
  //   diamondWeightage,
  //   goldWeightage,
  //   silverWeightage
  // );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
