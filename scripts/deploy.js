const hre = require("hardhat");

async function main() {
  let ERC721 = await hre.ethers.getContractFactory("FariaCollection");
  ERC721 = await ERC721.deploy();

  await ERC721.deployed();

  console.log(
    `Contract deployed to ${ERC721.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});