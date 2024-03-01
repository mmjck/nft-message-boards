require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  networks: {
      sepolia: {
        url: process.env.STAGING_ALCHEMY_KEY,
        accounts: [process.env.PRIVATE_KEY]
      },
  },
};
