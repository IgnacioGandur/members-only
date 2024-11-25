const { argv } = require("node:process");
const { Client } = require("pg");
const path = require("node:path");
const fs = require("fs");

function getProfilePicturesNames() {
    const arr = [];
    const files = fs.readdirSync(
        path.join(__dirname, "../", "public", "profile_pictures"),
        { withFileTypes: true },
    );

    files.forEach((file) => {
        arr.push({
            path: file.name,
            description: `Profile picture ${file.name}`.split(".")[0],
        });
    });

    arr.sort((a, b) => {
        const numA = parseInt(a.path.split(".")[0], 10);
        const numB = parseInt(b.path.split(".")[0], 10);
        return numA - numB;
    });

    return arr;
}

const sortedProfilePicturesNames = getProfilePicturesNames();

const pathsArray = [];
const descriptionsArray = [];

for (let i = 0; i < sortedProfilePicturesNames.length; i++) {
    pathsArray.push(`/profile_pictures/${sortedProfilePicturesNames[i].path}`);
    descriptionsArray.push(sortedProfilePicturesNames[i].description);
}

const SQL = `
    INSERT INTO profile_pictures (path, description) SELECT * FROM UNNEST($1::text[], $2::text[]);
`;

async function main() {
    const client = new Client({
        connectionString: argv[2],
    });

    await client.connect();
    console.log("Connecting...");

    await client.query(SQL, [pathsArray, descriptionsArray]);
    console.log("Seeding...");

    await client.end();
    console.log("Done!");
}

main();
