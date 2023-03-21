import * as EVoting from "../index";

const EXAMPLE_API_KEY = "71724fc25503d176fd654cc99a53a387";

export const testEVoting = async () => {

    // initialize user client
    const eVoting = EVoting.createClient();

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

    // initialize votes
    const vote: EVoting.Vote = {
        "itemKey": "President",
        "itemTitle": "President of the USA",
        "optionKey": "Biden",
        "optionTitle": "Joe Biden"
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
}