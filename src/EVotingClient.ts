import * as EVotingAPI from "./EVotingAPI";

const { subtle } = globalThis.crypto;

const HOST = "https://evoting.cryptit.at";

export type Vote = {
    itemKey: string;
    itemTitle: string;
    optionKey: string;
    optionTitle: string;
}

export type VoteResult = {
    receipt: string;
}

export type ElectionResult = {
    result: string;
}

/**
 * @summary Client that allows user-level interaction with an EVoting system from a browser context. Authorized users can cast votes in elections and anyone may request the hashed results of a completed election.
 */
export class EVotingClient {

    private host = HOST;

    /**
    * @summary Initializes a client that allows user-level interaction with an EVoting system from a browser context. Authorized users can cast votes in elections and anyone may request the hashed results of a completed election.
    */
    constructor();

    /**
    * @summary Initializes a client that allows user-level interaction with an EVoting system from a browser context. Authorized users can cast votes in elections and anyone may request the hashed results of a completed election.
    * @param host Optional host URL
    */
    constructor(host: string);

    /**
    * @summary Initializes a client that allows user-level interaction with an EVoting system from a browser context. Authorized users can cast votes in elections and anyone may request the hashed results of a completed election.
    * @param config Client configuration, including an API-key for admin authorization and an optional host URL
    */
    constructor(config?: { host?: string } | string);
    constructor(config?: { host?: string } | string) {
        if (typeof config === 'string') {
            this.host = config;
        }
        else {
            if (config?.host) {
                this.host = config.host;
            }
        }
    }

    /**
     * @summary After an election has ended anybody can request the results hash.
     * @param publicId The public ID of the election to retrieve results for, which is returned by createElection
     * @returns An ElectionResult, including a hash of the completed election data
     */
    getElectionResults = async (publicId: string) => {
        try {
            const res = await EVotingAPI.get(
                this.host + '/api/election/results?publicId=' + publicId
            );
            return res as ElectionResult;
        }
        catch (ex) {
            const error = ex as EVotingAPI.RequestError;
            error.message = `Failed to get results for election ${publicId}\n${error.message}: ${JSON.stringify(error.error)}`;
            throw error;
        }
    }

    /**
     * @summary Vote as a valid voter. The election provider is supposed to give the valid voter key only when the voter is authorized on their platform.
     * @param publicId The public ID of the election to participate in, which is returned by createElection
     * @param voterKey The voter key that identifies the voter
     * @param votes An array of Votes, where itemKey and itemTitle identify an ElectionItem, and optionKey and optionTitle identify an ElectionOption of the Election
     * @returns A VoteResult, including the receipt for the vote
     */
    vote = async (publicId: string, voterKey: string, votes: Vote[]) => {
        // use salted and hashed voterKey as voterHash
        const encrypted = Math.random().toString() + voterKey;
        const voterHash = await this.sha256(encrypted);
        try {
            const res = await EVotingAPI.post(
                this.host + '/api/election/vote',
                {
                    publicId,
                    voterKey,
                    voterHash,
                    votes
                }
            );
            return res as VoteResult;
        }
        catch (ex) {
            const error = ex as EVotingAPI.RequestError;
            error.message = `Failed to cast vote in election ${publicId}\n${error.message}: ${JSON.stringify(error.error)}`;
            throw error;
        }
    }

    private async sha256(str: string) {
        const buf = await subtle.digest("SHA-256", new TextEncoder().encode(str));
        return Array.prototype.map.call(new Uint8Array(buf), x => (('00' + x.toString(16)).slice(-2))).join('');
    }
}

export type Election = {
    electionName: string;
    startTime: Date;
    endTime: Date;
    items: ElectionItem[]
}

export type ElectionMetadata = {
    publicId: string;
}

export type ElectionItem = {
    itemKey: string;
    itemTitle: string;
    description: string;
    options: ElectionOption[];
}

export type ElectionOption = {
    optionKey: string;
    optionTitle: string;
}

/**
 * @summary Client that allows admin-level interaction with an EVoting system from a Nodejs app. An admin may create elections and grant or revoke users' authorization for an election by adding or removing voter keys. Requires an API-key for admin authorization. 
 */
export class EVotingAdminClient {

    private host = HOST;
    private apiKey: string;

    /**
     * @summary Initializes a client that allows admin-level interaction with an EVoting system from a Nodejs app. An admin may create elections and grant or revoke users' authorization for an election by adding or removing voter keys. Requires an API-key for admin authorization.
     * @param apiKey API-key for admin authorization
     */
    constructor(apiKey: string);

    /**
     * @summary Initializes a client that allows admin-level interaction with an EVoting system from a Nodejs app. An admin may create elections and grant or revoke users' authorization for an election by adding or removing voter keys. Requires an API-key for admin authorization.
     * @param config Client configuration, including an API-key for admin authorization and an optional host URL
     */
    constructor(config: { host?: string, apiKey: string } | string);
    constructor(config: { host?: string, apiKey: string } | string) {
        if (typeof config === 'string') {
            this.apiKey = config;
        }
        else {
            if (config.host) {
                this.host = config.host;
            }
            this.apiKey = config.apiKey;
        }
    }

    /**
     * @summary Create a new election, this needs an account API key as authorization. Once a collection has beend created, voters can access the vote page with the returned publicId and their registered voterKey
     * @param election The Election object to create
     * @returns The created election's ElectionMetadata, including its publicId
     */
    createElection = async (election: Election) => {
        try {
            const res = await EVotingAPI.postWithHeaders(
                this.host + '/api/election/create',
                { "x-api-key": this.apiKey },
                election
            );
            return res as ElectionMetadata;
        }
        catch (ex) {
            const error = ex as EVotingAPI.RequestError;
            error.message = `Failed to create election\n${error.message}: ${JSON.stringify(error.error)}`;
            throw error;
        }
    }
    
    /**
     * @summary Add valid voter keys as the election owner
     * @param publicId The public ID of the election, which is returned by createElection
     * @param keys An array of valid voter keys to add to the election
     */
    addVoterKeys = async (publicId: string, keys: string[]) => {
        try {
            await EVotingAPI.postWithHeaders(
                this.host + '/api/election/addkeys',
                { "x-api-key": this.apiKey },
                {
                    publicId: publicId,
                    keys: keys
                }
            );
        }
        catch (ex) {
            const error = ex as EVotingAPI.RequestError;
            error.message = `Failed to add ${keys.length} voter keys to election ${publicId}\n${error.message}: ${JSON.stringify(error.error)}`;
            throw error;
        }
    }
    
    /**
     * @summary Remove a voter key as the election owner
     * @param publicId The public ID of the election, which is returned by createElection
     * @param key The single voter key to remove from the election
     */
    removeVoterKey = async (publicId: string, key: string) => {
        try {
            await EVotingAPI.postWithHeaders(
                this.host + '/api/election/removekey',
                { "x-api-key": this.apiKey },
                {
                    publicId: publicId,
                    key: key
                }
            );
        } catch (ex) {
            const error = ex as EVotingAPI.RequestError;
            error.message = `Failed to remove voter key from election ${publicId}\n${error.message}: ${JSON.stringify(error.error)}`;
            throw error;
        }
    }
}