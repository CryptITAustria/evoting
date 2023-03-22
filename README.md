# CryptIT E-Voting SDK

This SDK provides an easy-to-use TypeScript abstraction layer for interfacing with the CryptIT E-Voting API, which allows for admin- and user-level interaction with secure online elections. View the API documentation [here](https://documenter.getpostman.com/view/25751373/2s935uFKvy).

Features include creating elections and authorizing users to participate in elections via the admin client API, as well as casting votes and verifying results via the user client API.

## Usage

### User API

Run `npm i cryptit-e-voting-sdk` to install the package.

Use the standard EVotingClient to allow authorized clients to cast votes in elections and verify results independently of the service provider.

```typescript
    import * as EVoting from "cryptit-e-voting-sdk";

    // initialize user client
    const eVoting = EVoting.createClient();

    // initialize votes
    const vote: EVoting.Vote = {
        "itemKey": "President",
        "itemTitle": "President of the USA",
        "optionKey": "Biden",
        "optionTitle": "Joe Biden"
    };

    try {
        // cast votes
        const voteResult = await eVoting.vote(electionId, "abcd123", [vote]);
        console.log("VoteResult:", voteResult);

        // get election results
        const electionResult = await eVoting.getElectionResults(electionId);
        console.log("ElectionResult:", electionResult);
    }
    catch (ex) {
        console.error(ex);

        const error = ex as EVoting.RequestError;
        console.log(error.error);
        // ...handle error dynamically
    }
```

### Admin API

Use the EVotingAdminClient to create elections and authorize users to participate in elections, or revoke users' authorization by adding/removing voterKeys. In order to use this API, you will need an API key for authorization. Admin functionality should only be used in a backend context in order to avoid exposing your secret API key.

```typescript
    import * as EVoting from "cryptit-e-voting-sdk";

    // initialize admin client
    const eVotingAdmin = EVoting.createAdminClient(EXAMPLE_API_KEY);

    // initialize election data
    const election: EVoting.Election = {
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

    try {
        // create the election
        const electionMetadata = await eVotingAdmin.createElection(election);
        const electionId = electionMetadata.publicId;
        console.log(`Created election with ID ${electionId}`);
    
        // add keys to the election
        await eVotingAdmin.addVoterKeys(electionId, ["abcd123", "abcd234", "abcd456"]);
    
        // remove a key from the election
        await eVotingAdmin.removeVoterKey(electionId, "abcd456");
    }
    catch (ex) {
        console.error(ex);

        const error = ex as EVoting.RequestError;
        console.log(error.error);
        // ...handle error dynamically
    }
```

## Building and testing

Requires Node.js v19.7.0 for usage in a Node.js backend application.

- run `npm install` to install required dependencies
- run `npm run build` to build the SDK from source
- run `npx webpack` to bundle the built SDK for use in browsers
