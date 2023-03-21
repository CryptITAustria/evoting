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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminClient = exports.createClient = void 0;
const SDK = __importStar(require("./src/EVotingClient"));
const { EVotingClient, EVotingAdminClient, } = SDK;
/**
* @summary Initializes a client that allows user-level interaction with an EVoting system from a browser context. Authorized users can cast votes in elections and anyone may request the hashed results of a completed election.
* @param host Optional host URL
*/
const createClient = () => new EVotingClient();
exports.createClient = createClient;
/**
 * @summary Initializes a client that allows admin-level interaction with an EVoting system from a Nodejs app. An admin may create elections and grant or revoke users' authorization for an election by adding or removing voter keys. Requires an API-key for admin authorization.
 * @param apiKey API-key for admin authorization
 */
const createAdminClient = (apiKey) => new EVotingAdminClient(apiKey);
exports.createAdminClient = createAdminClient;
