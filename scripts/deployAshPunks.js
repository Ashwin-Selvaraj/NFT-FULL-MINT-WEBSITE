const hre = require("hardhat");
require("dotenv").config();
async function main() {
  const ASHPUNKS = await hre.ethers.getContractFactory("AshPunksNFT");
  const ashPunksNFT = await ASHPUNKS.deploy();
  await ashPunksNFT.waitForDeployment();
  console.log(`AshPunksNFT contract address: ${ashPunksNFT.target}`);

  // Verify contract on Etherscan
  // await hre.run("verify:verify", {
  //   address: ashPunksNFT.target,
  //   constructorArguments: [], // If your contract's constructor accepts arguments, provide them here
  // });

  async function verify(contractAddress, args) {
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArgument: args,
      });
      console.log("Contract verified on Etherscan");
    } catch (e) {
      console.log(e);
    }
  }
  // Call verify function after an interval of 30 seconds
  setTimeout(async () => {
    await verify(ashPunksNFT.target, []);
  }, 30000); // 30 seconds in milliseconds
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
