const AbiHandler = require('./abiHandler');

class Contract {
    constructor(provider, address, abi) {
        if (!provider) {
            throw new Error(`Contract constructor: parameter 'provider' is required.`);
        } if (!address) {
            throw new Error(`Contract constructor: parameter 'address' is required.`);
        } if (!abi) {
            throw new Error(`Contract constructor: parameter 'abi' is required.`);
        }

        this.provider = provider;
        this.address = address;

        try {
            this.abiHandler = new AbiHandler(abi);
        } catch (error) {
            throw new Error(`Contract constructor: Failed to initialize AbiHandler: ${error.message}`);
        }
        

        const functions = this.abiHandler.parseAbi().functions;
        for (const functionName of Object.keys(functions)) {
            this[functionName] = async (...args) => {
                return this._callFunction(functionName, args);
            };
        }
    }

    async _callFunction(functionName, args) {
        const data = this.abiHandler.encodeFunctionCall(functionName, args);

        const payload = {
            method: 'eth_call',
            params: [
                {
                    to: this.address,
                    data: data,
                },
                'latest',
            ],
        };

        const result = await this.provider.request(payload);
        
        return this.abiHandler.decodeFunctionResponse(functionName, result);
    }
}

module.exports = Contract;
