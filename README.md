# ETH Fetch
![NPM Version](https://img.shields.io/npm/v/eth-fetch) ![NPM License](https://img.shields.io/npm/l/eth-fetch) ![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/eth-fetch)

> A JavaScript interface for fetching data from Ethereum nodes and smart contracts.

The **eth-fetch** library is a JavaScript interface designed for fetching data from Ethereum nodes and smart contracts using read-only JSON-RPC calls. To get started, install the library:
```bash
npm install eth-fetch
```

## ethFetch Methods
The library supports two methods, one for creating a provider instance for sending JSON-RPC requests over HTTP, and the other for creating an interface for smart contract interactions based on a contract address and ABI.
```js
ethFetch.RpcProvider(providerUrl);
```
Creating a provider instance is supported by the `ethFetch.RpcProvider();` method, and requires a `providerUrl` parameter be provided, which expects a provider. The provider should support a JSON-RPC interface over HTTP (e.g.. port 8545 of a Geth node, an endpoint for a service like Infura).
```js
ethFetch.Contract(provider, address, abi);
```
Creating a contract interface is supported by the `ethFetch.Contract();` method, and requires a `provider`, `address`, and `abi` parameter be provided. These should correspond to a provider instance (such as *ethFetch.RpcProvider*), a the contract's address, and the contract's ABI. The ABI encoding/decoding is supported by [@ethersproject/abi](https://www.npmjs.com/package/@ethersproject/abi), therefore the ABI supplied must match an [ABI Format](https://docs.ethers.org/v5/api/utils/abi/formats/) supported by Ethers.

## Example Use
In this first example, a provider instance is created, and used to fetch the current block number.
```js
const ethFetch = require('eth-fetch');

// Create instance of the provider
const providerUrl = "https://mainnet.infura.io/v3/INFURA_API_KEY";
const provider = new ethFetch.RpcProvider(providerUrl);

// Fetch current Block Number
(async () => {
    try {
        const blockNumber = await provider.request({ method: 'eth_blockNumber' });
        console.log("Block Number:", parseInt(blockNumber, 16));
    } catch (error) {
        throw error;
    }
})();

// Sample Output:
// Block Number: 21589526

```
In this second example, an interface for an Ethereum Name Service smart contract is created, supplying the contract address, and ABI for the `owner` function, to retrieve the owner address for the ENS name `ethereum.eth`.
```js
const ethFetch = require('eth-fetch');

// Create instance of the provider
const providerUrl = "http://127.0.0.1:8545";
const provider = new ethFetch.RpcProvider(providerUrl);

// Create smart contract interface
const contractAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
const abi = ["function owner(bytes32 node) external view returns (address)"];
const contract = new ethFetch.Contract(provider, contractAddress, abi);

// Find the owner address for ethereum.eth (using namehash)
const namehash = "0x78c5b99cf4668cf6da387866de4331c78b75b7db0087988c552f73e1714447b9";

(async () => {
    try {
        const ownerAddress = await contract.owner(namehash);
        console.log("Owner Address:", ownerAddress);
    } catch (error) {
        throw error;
    }
})();

// Sample Output:
// Owner Address: [ '0xAd2e180019FCa9e55CADe76E4487F126Fd08DA34' ]

```
