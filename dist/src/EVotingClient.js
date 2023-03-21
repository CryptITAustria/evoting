"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVotingAdminClient = exports.EVotingClient = void 0;
const EVotingAPI = __importStar(require("./EVotingAPI"));
const { subtle } = globalThis.crypto;
const HOST = "https://evoting.cryptit.at";
/**
 * @summary Client that allows user-level interaction with an EVoting system from a browser context. Authorized users can cast votes in elections and anyone may request the hashed results of a completed election.
 */
class EVotingClient {
    constructor(config) {
        this.host = HOST;
        /**
         * @summary After an election has ended anybody can request the results hash.
         * @param publicId The public ID of the election to retrieve results for, which is returned by createElection
         * @returns An ElectionResult, including a hash of the completed election data
         */
        this.getElectionResults = (publicId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield EVotingAPI.get(this.host + '/api/election/results?publicId=' + publicId);
                return res;
            }
            catch (ex) {
                const error = ex;
                error.message = `Failed to get results for election ${publicId}\n${error.message}: ${JSON.stringify(error.error)}`;
                throw error;
            }
        });
        /**
         * @summary Vote as a valid voter. The election provider is supposed to give the valid voter key only when the voter is authorized on their platform.
         * @param publicId The public ID of the election to participate in, which is returned by createElection
         * @param voterKey The voter key that identifies the voter
         * @param votes An array of Votes, where itemKey and itemTitle identify an ElectionItem, and optionKey and optionTitle identify an ElectionOption of the Election
         * @returns A VoteResult, including the receipt for the vote
         */
        this.vote = (publicId, voterKey, votes) => __awaiter(this, void 0, void 0, function* () {
            // use salted and hashed voterKey as voterHash
            const encrypted = Math.random().toString() + voterKey;
            const voterHash = yield this.sha256(encrypted);
            try {
                const res = yield EVotingAPI.post(this.host + '/api/election/vote', {
                    publicId,
                    voterKey,
                    voterHash,
                    votes
                });
                return res;
            }
            catch (ex) {
                const error = ex;
                error.message = `Failed to cast vote in election ${publicId}\n${error.message}: ${JSON.stringify(error.error)}`;
                throw error;
            }
        });
        if (typeof config === 'string') {
            this.host = config;
        }
        else {
            if (config === null || config === void 0 ? void 0 : config.host) {
                this.host = config.host;
            }
        }
    }
    sha256(str) {
        return __awaiter(this, void 0, void 0, function* () {
            const buf = yield subtle.digest("SHA-256", new TextEncoder().encode(str));
            return Array.prototype.map.call(new Uint8Array(buf), x => (('00' + x.toString(16)).slice(-2))).join('');
        });
    }
}
exports.EVotingClient = EVotingClient;
/**
 * @summary Client that allows admin-level interaction with an EVoting system from a Nodejs app. An admin may create elections and grant or revoke users' authorization for an election by adding or removing voter keys. Requires an API-key for admin authorization.
 */
class EVotingAdminClient {
    constructor(config) {
        this.host = HOST;
        /**
         * @summary Create a new election, this needs an account API key as authorization. Once a collection has beend created, voters can access the vote page with the returned publicId and their registered voterKey
         * @param election The Election object to create
         * @returns The created election's ElectionMetadata, including its publicId
         */
        this.createElection = (election) => __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield EVotingAPI.postWithHeaders(this.host + '/api/election/create', { "x-api-key": this.apiKey }, election);
                return res;
            }
            catch (ex) {
                const error = ex;
                error.message = `Failed to create election\n${error.message}: ${JSON.stringify(error.error)}`;
                throw error;
            }
        });
        /**
         * @summary Add valid voter keys as the election owner
         * @param publicId The public ID of the election, which is returned by createElection
         * @param keys An array of valid voter keys to add to the election
         */
        this.addVoterKeys = (publicId, keys) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield EVotingAPI.postWithHeaders(this.host + '/api/election/addkeys', { "x-api-key": this.apiKey }, {
                    publicId: publicId,
                    keys: keys
                });
            }
            catch (ex) {
                const error = ex;
                error.message = `Failed to add ${keys.length} voter keys to election ${publicId}\n${error.message}: ${JSON.stringify(error.error)}`;
                throw error;
            }
        });
        /**
         * @summary Remove a voter key as the election owner
         * @param publicId The public ID of the election, which is returned by createElection
         * @param key The single voter key to remove from the election
         */
        this.removeVoterKey = (publicId, key) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield EVotingAPI.postWithHeaders(this.host + '/api/election/removekey', { "x-api-key": this.apiKey }, {
                    publicId: publicId,
                    key: key
                });
            }
            catch (ex) {
                const error = ex;
                error.message = `Failed to remove voter key from election ${publicId}\n${error.message}: ${JSON.stringify(error.error)}`;
                throw error;
            }
        });
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
}
exports.EVotingAdminClient = EVotingAdminClient;
