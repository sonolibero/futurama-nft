const { expect} = require("chai");
const { ethers} = require("hardhat");

describe("mycontract", function() {
  it("mint and transfer NFT to someone", async function() {
    const Futu = await ethers.getContractFactory("Futurama");
    const futu = await Futu.deploy();
    await futu.deployed();

    const recipient = '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199';
    const metadataURI = 'cid/test.png';

    let balance = await futu.balanceOf(recipient);
    expect(balance).to.equal(0);

    const newlyMintedToken = await futu.payToMint(recipient, metadataURI, { value: ethers.utils.parseEther('0.05')});

    await newlyMintedToken.wait();

    balance = await futu.balanceOf(recipient)
    expect(balance).to.equal(1);

    expect(await futu.isContentOwned(metadataURI)).to.equal(true);
  });

});