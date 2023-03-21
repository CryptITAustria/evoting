import * as SDK from './src/EVotingClient';
/**
* @summary Initializes a client that allows user-level interaction with an EVoting system from a browser context. Authorized users can cast votes in elections and anyone may request the hashed results of a completed election.
* @param host Optional host URL
*/
declare const createClient: () => SDK.EVotingClient;
/**
 * @summary Initializes a client that allows admin-level interaction with an EVoting system from a Nodejs app. An admin may create elections and grant or revoke users' authorization for an election by adding or removing voter keys. Requires an API-key for admin authorization.
 * @param apiKey API-key for admin authorization
 */
declare const createAdminClient: (apiKey: string) => SDK.EVotingAdminClient;
export { createClient, createAdminClient, };
export { Vote, VoteResult, ElectionResult, Election, ElectionMetadata, ElectionItem, ElectionOption, } from './src/EVotingClient';
export type { RequestError } from './src/EVotingAPI';
