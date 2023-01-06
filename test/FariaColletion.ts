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
    it("should have the correct name", async () => {
      const name = await FariaCollection.name();
      expect(name).to.equal("FariaCollection");
    });

    it("should have the correct symbol", async () => {
      const symbol = await FariaCollection.symbol();
      expect(symbol).to.equal("FAR");
    });

    it("Should Mint 1 NFT", async function () {
      await FariaCollection.connect(addr1).publicMint(1, {
        value: price,
      });

      expect(await FariaCollection.balanceOf(addr1.address)).to.equal(1);
    });

    it("should increase the contract balance after a successful mint", async () => {
      const initialBalance = await ethers.provider.getBalance(
        FariaCollection.address
      );

      await FariaCollection.publicMint(1, { value: price });

      const finalBalance = await ethers.provider.getBalance(
        FariaCollection.address
      );
      expect(finalBalance).to.be.greaterThan(initialBalance);
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

    it("setBaseUri should only be callable by the contract owner", async () => {
      await expect(FariaCollection.connect(addr1).setBaseUri("test"))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should set the base URI correctly", async () => {
      const baseUri = "test";
      await FariaCollection.setBaseUri(baseUri);
      const result = await FariaCollection.baseUri();
      expect(result).to.equal(baseUri);
    });

    it("setPrice should only be callable by the contract owner", async () => {
      await expect(FariaCollection.connect(addr1).setPrice(1000))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should set the price correctly", async () => {
      const price = 1000;
      await FariaCollection.setPrice(price);
      const result = await FariaCollection.price();
      expect(result).to.equal(price);
    });

  });
});
