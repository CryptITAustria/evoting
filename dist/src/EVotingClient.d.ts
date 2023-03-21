export type Vote = {
    itemKey: string;
    itemTitle: string;
    optionKey: string;
    optionTitle: string;
};
export type VoteResult = {
    receipt: string;
};
export type ElectionResult = {
    result: string;
};
/**
 * @summary Client that allows user-level interaction with an EVoting system from a browser context. Authorized users can cast votes in elections and anyone may request the hashed results of a completed election.
 */
export declare class EVotingClient {
    private host;
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
    constructor(config?: {
        host?: string;
    } | string);
    /**
     * @summary After an election has ended anybody can request the results hash.
     * @param publicId The public ID of the election to retrieve results for, which is returned by createElection
     * @returns An ElectionResult, including a hash of the completed election data
     */
    getElectionResults: (publicId: string) => Promise<ElectionResult>;
    /**
     * @summary Vote as a valid voter. The election provider is supposed to give the valid voter key only when the voter is authorized on their platform.
     * @param publicId The public ID of the election to participate in, which is returned by createElection
     * @param voterKey The voter key that identifies the voter
     * @param votes An array of Votes, where itemKey and itemTitle identify an ElectionItem, and optionKey and optionTitle identify an ElectionOption of the Election
     * @returns A VoteResult, including the receipt for the vote
     */
    vote: (publicId: string, voterKey: string, votes: Vote[]) => Promise<VoteResult>;
    private sha256;
}
export type Election = {
    electionName: string;
    startTime: Date;
    endTime: Date;
    items: ElectionItem[];
};
export type ElectionMetadata = {
    publicId: string;
};
export type ElectionItem = {
    itemKey: string;
    itemTitle: string;
    description: string;
    options: ElectionOption[];
};
export type ElectionOption = {
    optionKey: string;
    optionTitle: string;
};
/**
 * @summary Client that allows admin-level interaction with an EVoting system from a Nodejs app. An admin may create elections and grant or revoke users' authorization for an election by adding or removing voter keys. Requires an API-key for admin authorization.
 */
export declare class EVotingAdminClient {
    private host;
    private apiKey;
    /**
     * @summary Initializes a client that allows admin-level interaction with an EVoting system from a Nodejs app. An admin may create elections and grant or revoke users' authorization for an election by adding or removing voter keys. Requires an API-key for admin authorization.
     * @param apiKey API-key for admin authorization
     */
    constructor(apiKey: string);
    /**
     * @summary Initializes a client that allows admin-level interaction with an EVoting system from a Nodejs app. An admin may create elections and grant or revoke users' authorization for an election by adding or removing voter keys. Requires an API-key for admin authorization.
     * @param config Client configuration, including an API-key for admin authorization and an optional host URL
     */
    constructor(config: {
        host?: string;
        apiKey: string;
    } | string);
    /**
     * @summary Create a new election, this needs an account API key as authorization. Once a collection has beend created, voters can access the vote page with the returned publicId and their registered voterKey
     * @param election The Election object to create
     * @returns The created election's ElectionMetadata, including its publicId
     */
    createElection: (election: Election) => Promise<ElectionMetadata>;
    /**
     * @summary Add valid voter keys as the election owner
     * @param publicId The public ID of the election, which is returned by createElection
     * @param keys An array of valid voter keys to add to the election
     */
    addVoterKeys: (publicId: string, keys: string[]) => Promise<void>;
    /**
     * @summary Remove a voter key as the election owner
     * @param publicId The public ID of the election, which is returned by createElection
     * @param key The single voter key to remove from the election
     */
    removeVoterKey: (publicId: string, key: string) => Promise<void>;
}
