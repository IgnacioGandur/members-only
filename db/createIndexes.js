const { argv } = require("node:process");
const { Client } = require("pg");

const SQL = `
    CREATE UNIQUE INDEX idx_users_usernames ON users(username);
    CREATE INDEX idx_messages_author ON messages (author_id);
    CREATE UNIQUE INDEX idx_profilepictures_users_user_pic ON profilepictures_users (profile_picture_id, user_id);
    CREATE INDEX idx_profilepictures_users_user_id ON profilepictures_users (user_id);
`;

async function main() {
    console.log("Getting ready to create indexes...");
    const client = new Client({
        connectionString: argv[2],
    });
    await client.connect();
    console.log("Creating indexes...");
    await client.query(SQL);
    await client.end();

    console.log("Done. Indexes were created!");
}

main();
