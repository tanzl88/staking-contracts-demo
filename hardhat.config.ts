import * as dotenv from "dotenv";
dotenv.config();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import { POLYGON_TEST } from "./network_config/mumbai";

const config: HardhatUserConfig = {
    solidity: "0.8.19",
    defaultNetwork: "hardhat",
    networks: {
        mumbai: POLYGON_TEST,
    },
};

export default config;
