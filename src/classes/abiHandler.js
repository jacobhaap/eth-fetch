const { defaultAbiCoder, Interface } = require('@ethersproject/abi');

class AbiHandler {
    constructor(abi) {
        this.interface = new Interface(abi);
    }

    encodeFunctionCall(functionName, params) {
        const fragment = this.interface.getFunction(functionName);
        return this.interface.encodeFunctionData(fragment, params);
    }

    decodeFunctionResponse(functionName, data) {
        const fragment = this.interface.getFunction(functionName);
        return this.interface.decodeFunctionResult(fragment, data);
    }

    encodeParams(types, values) {
        return defaultAbiCoder.encode(types, values);
    }

    decodeParams(types, data) {
        return defaultAbiCoder.decode(types, data);
    }

    encodeEventTopics(eventName, params) {
        const fragment = this.interface.getEvent(eventName);
        return this.interface.encodeFilterTopics(fragment, params);
    }

    decodeEventLog(eventName, log) {
        const fragment = this.interface.getEvent(eventName);
        return this.interface.decodeEventLog(fragment, log.data, log.topics);
    }

    getFunctionSelector(functionName) {
        const fragment = this.interface.getFunction(functionName);
        return this.interface.getSighash(fragment);
    }

    parseAbi() {
        const functions = {};
        const events = {};

        this.interface.fragments.forEach(fragment => {
            if (fragment.type === "function") {
                functions[fragment.name] = {
                    inputs: fragment.inputs,
                    outputs: fragment.outputs,
                    selector: this.interface.getSighash(fragment),
                };
            } else if (fragment.type === "event") {
                events[fragment.name] = {
                    inputs: fragment.inputs,
                    anonymous: fragment.anonymous,
                    topic: this.interface.getEventTopic(fragment),
                };
            }
        });

        return { functions, events };
    }
}

module.exports = AbiHandler;
