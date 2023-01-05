import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";

const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");

describe("Faria Collection", function () {
  let FariaCollection: Contract;
  let users,
    owner: SignerWithAddress,
    addr1: SignerWithAddress,
    addr2: SignerWithAddress;
  let price = 1000000000000000;

  before(async () => {
    users = await ethers.getSigners();
    owner = users[0];
    addr1 = users[1];
    addr2 = users[2];
  });

  beforeEach(async () => {
    FariaCollection = await ethers.getContractFactory("FariaCollection");
    FariaCollection = await FariaCollection.deploy();
    await FariaCollection.deployed();
  });

  describe("Deployment and Mint", function () {
    it("Should Mint 1 NFT", async function () {
      await FariaCollection.connect(addr1).publicMint(1, {
        value: price,
      });

      expect(await FariaCollection.balanceOf(addr1.address)).to.equal(1);
    });

    it("Should Mint 2 NFTs", async function () {
      await FariaCollection.connect(addr1).publicMint(2, {
        value: price * 2,
      });

      expect(await FariaCollection.balanceOf(addr1.address)).to.equal(2);
    });

    it("Should fail to mint over max mint per wallet (2)", async function () {
      expect(
        FariaCollection.connect(addr1).publicMint(3, {
          value: price * 3,
        })
      ).to.be.revertedWith("EXCEEDS_MAX_MINT_PER_WALLET");
    });

    it("Should fail to mint over max supply", async function () {
      expect(
        FariaCollection.connect(addr2).publicMint(101, {
          value: price * 101,
        })
      ).to.be.revertedWith("MAX_SUPPLY_REACHED");
    });

    it("Should fail to mint without enough money", async function () {
        expect(
          FariaCollection.connect(addr2).publicMint(1, {
            value: price - 1,
          })
        ).to.be.revertedWith("TRANSACTION_UNDERVALUED");
      });



  });
});
