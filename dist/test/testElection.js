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
exports.testEVoting = void 0;
const EVoting = __importStar(require("../index"));
const EXAMPLE_API_KEY = "71724fc25503d176fd654cc99a53a387";
const testEVoting = () => __awaiter(void 0, void 0, void 0, function* () {
    // initialize user client
    const eVoting = EVoting.createClient();
    // initialize admin client
    const eVotingAdmin = EVoting.createAdminClient(EXAMPLE_API_KEY);
    // initialize election data
    const election = {
        electionName: "My election",
        startTime: new Date(Date.now() - (24 * 7 * 3600)),
        endTime: new Date(Date.now() + (24 * 7 * 3600)),
        items: [
            {
                "itemKey": "President",
                "itemTitle": "President of the USA",
                "description": "The president of the United States of America for a 4 year period",
                "options": [
                    {
                        "optionKey": "Trump",
                        "optionTitle": "Donald J. Trump"
                    },
                    {
                        "optionKey": "Biden",
                        "optionTitle": "Joe Biden"
                    }
                ]
            }
        ]
    };
    // initialize votes
    const vote = {
        "itemKey": "President",
        "itemTitle": "President of the USA",
        "optionKey": "Biden",
        "optionTitle": "Joe Biden"
    };
    try {
        // create the election
        const electionMetadata = yield eVotingAdmin.createElection(election);
        const electionId = electionMetadata.publicId;
        console.log(`Created election with ID ${electionId}`);
        // add keys to the election
        yield eVotingAdmin.addVoterKeys(electionId, ["abcd123", "abcd234", "abcd456"]);
        // remove a key from the election
        yield eVotingAdmin.removeVoterKey(electionId, "abcd456");
        // cast votes
        const voteResult = yield eVoting.vote(electionId, "abcd123", [vote]);
        console.log("VoteResult:", voteResult);
        // get election results
        const electionResult = yield eVoting.getElectionResults(electionId);
        console.log("ElectionResult:", electionResult);
    }
    catch (ex) {
        console.error(ex);
        const error = ex;
        console.log(error.error);
        // ...handle error dynamically
    }
});
exports.testEVoting = testEVoting;
