const { argv } = require("node:process");
const { Client } = require("pg");

const SQL = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER GENERATED ALWAYS AS IDENTITY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        bio VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        creation_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        gender VARCHAR(255),
        is_member BOOLEAN NOT NULL DEFAULT false,
        is_admin BOOLEAN NOT NULL DEFAULT false,
        PRIMARY KEY(id),
        CONSTRAINT unique_username UNIQUE(username)
    );

    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER GENERATED ALWAYS AS IDENTITY,
        author_id INTEGER,
        title VARCHAR(255) NOT NULL,
        content VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        CONSTRAINT fk_user_id FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS profile_pictures (
        id INTEGER GENERATED ALWAYS AS IDENTITY,
        path VARCHAR(255),
        description VARCHAR(255),
        PRIMARY KEY (id),
        CONSTRAINT unique_path UNIQUE(path),
        CONSTRAINT unique_description UNIQUE(description)
    );

    CREATE TABLE IF NOT EXISTS profilePictures_users (
        id INTEGER GENERATED ALWAYS AS IDENTITY,
        profile_picture_id INTEGER,
        user_id INTEGER,
        PRIMARY KEY (id),
        CONSTRAINT fk_profile_picture_id FOREIGN KEY (profile_picture_id) REFERENCES profile_pictures(id) ON DELETE SET NULL,
        CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS likes (
        id INTEGER GENERATED ALWAYS AS IDENTITY,
        message_id INTEGER,
        user_id INTEGER,
        PRIMARY KEY (id),
        CONSTRAINT fk_message_id FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
        CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

`;

async function main() {
    console.log("Seeding...");
    const client = new Client({
        connectionString: argv[2],
    });

    await client.connect();
    await client.query(SQL);
    await client.end();

    console.log("Done!");
}

main();
