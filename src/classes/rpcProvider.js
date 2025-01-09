class RpcProvider {
    constructor(providerUrl) {
        if (!providerUrl) {
            throw new Error(`RpcProvider constructor: parameter 'providerUrl' is required.`);
        }
        this.providerUrl = providerUrl;
        this.requestId = 0;
    }

    async request({ method, params }) {
        if (!method || typeof method !== 'string') {
            throw new Error(`Invalid 'method': must be a non-empty string.`);
        }

        const body = {
            jsonrpc: '2.0',
            id: ++this.requestId,
            method,
            params: params || [],
        };

        try {
            const response = await fetch(this.providerUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const json = await response.json();

            if (json.error) {
                const { code, message, data } = json.error;
                const error = new Error(message);
                error.code = code;
                error.data = data;
                throw error;
            }

            return json.result;
        } catch (error) {
            throw new Error(`Request to RPC provider failed: ${error.message}`);
        }
    }
}

module.exports = RpcProvider;
