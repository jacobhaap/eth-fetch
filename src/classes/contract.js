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

        this.abi = {
            encodeFunctionCall: this.encodeFunctionCall.bind(this),
            decodeFunctionResponse: this.decodeFunctionResponse.bind(this),
            encodeParams: this.encodeParams.bind(this),
            decodeParams: this.decodeParams.bind(this),
            encodeEventTopics: this.encodeEventTopics.bind(this),
            decodeEventLog: this.decodeEventLog.bind(this),
            getFunctionSelector: this.getFunctionSelector.bind(this),
            parseAbi: this.parseAbi.bind(this),
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

    encodeFunctionCall(functionName, params) {
        return this.abiHandler.encodeFunctionCall(functionName, params);
    }

    decodeFunctionResponse(functionName, data) {
        return this.abiHandler.decodeFunctionResponse(functionName, data);
    }

    encodeParams(types, values) {
        return this.abiHandler.encodeParams(types, values);
    }

    decodeParams(types, data) {
        return this.abiHandler.decodeParams(types, data);
    }

    encodeEventTopics(eventName, params) {
        return this.abiHandler.encodeEventTopics(eventName, params);
    }

    decodeEventLog(eventName, log) {
        return this.abiHandler.decodeEventLog(eventName, log);
    }

    getFunctionSelector(functionName) {
        return this.abiHandler.getFunctionSelector(functionName);
    }

    parseAbi() {
        return this.abiHandler.parseAbi();
    }
}

module.exports = Contract;
