const POLYGON_TEST_RPC_URL = process.env.POLYGON_TEST_RPC_URL || `https://polygon-mumbai-bor.publicnode.com`;
const PRIVATE_KEY_LIST = process.env.PRIVATE_KEY_LIST || undefined;
const CHAIN_ID = 80001;

export const POLYGON_TEST = {
    url: POLYGON_TEST_RPC_URL,
    accounts: PRIVATE_KEY_LIST !== undefined ? JSON.parse(PRIVATE_KEY_LIST) : [],
    chainId: CHAIN_ID,
};

console.log(POLYGON_TEST);
