const db = require("./pool");
const bcrypt = require("bcryptjs");
const { format } = require("date-fns");

async function checkIfUserExistsByUsername(username) {
    const query = `
        SELECT id FROM users WHERE username = $1;
        `;
    const { rows } = await db.query(query, [username]);

    if (rows.length > 0) {
        return true;
    } else {
        return false;
    }
}

async function checkIfProfilePictureExists(id) {
    try {
        const query = `
            SELECT id FROM profile_pictures WHERE id = $1;
        `;

        const { rows } = await db.query(query, [id]);

        if (rows.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Database error:", error.message);
        throw new Error("Could not check if the profile picture exists.");
    }
}

async function usernameExists(username) {
    try {
        const query = `
            SELECT * FROM users WHERE username = $1;
        `;
        const { rows } = await db.query(query, [username]);

        if (rows.length > 0) {
            //If the result is not empty, the username already is in the db.
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Database error:", error.message);
        throw new Error("Could not check if user exists.");
    }
}

async function checkIfUpdatedUsernameIsValid(userId, updatedUsername) {
    try {
        const query = `
                SELECT username FROM users WHERE id = $1;
            `;
        const { rows } = await db.query(query, [userId]);

        const currentUsername = rows[0].username;

        // If the user didn't updated the username.
        if (currentUsername === updatedUsername) {
            return;
        }

        const query2 = `
                SELECT * FROM users WHERE username = $1;
            `;

        const { rows: usernameResults } = await db.query(query2, [
            updatedUsername,
        ]);

        if (usernameResults.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Database error: ", error.message);
        throw new Error(
            "Could not check if the username already existed when trying to update the username.",
        );
    }
}

async function getProfilePicturesPath() {
    try {
        const query = `
                SELECT * FROM profile_pictures;
            `;
        const { rows } = await db.query(query);

        return rows;
    } catch (error) {
        console.error("Database error: ", error.message);
        throw new Error("Could not get profile pictures.");
    }
}

async function insertUser(
    firstName,
    lastName,
    username,
    bio,
    password,
    gender,
    profilePictureId,
) {
    const hashedPass = await bcrypt.hash(password, 10);

    try {
        const query = `
            INSERT INTO users (first_name, last_name, username, bio, password, gender) VALUES ($1, $2, $3, $4, $5, $6 ) RETURNING id;
            `;

        const { rows } = await db.query(query, [
            firstName,
            lastName,
            username,
            bio,
            hashedPass,
            gender,
        ]);

        const userId = rows[0].id;

        const query2 = `
                    INSERT INTO profilepictures_users (profile_picture_id, user_id) VALUES ($1, $2);
            `;

        await db.query(query2, [Number(profilePictureId), userId]);
    } catch (error) {
        console.error("Database error:", error.message);
        throw new Error("Could not insert user into database.");
    }
}

async function getAllUsers() {
    try {
        const query = `
            SELECT users.id,
                users.first_name, 
                users.last_name,
                users.username,
                users.gender,
                users.is_member,
                users.is_admin,
                users.creation_date,
                profile_pictures.path AS profile_picture,
                (SELECT COUNT(*) FROM messages WHERE messages.author_id = users.id) AS n_messages FROM users
                INNER JOIN profilepictures_users ON users.id = profilepictures_users.user_id
                INNER JOIN profile_pictures ON profilepictures_users.profile_picture_id = profile_pictures.id;
        `;
        const { rows } = await db.query(query);

        for (let i = 0; i < rows.length; i++) {
            rows[i].creation_date = format(
                rows[i].creation_date,
                "do 'of' MMMM 'of' yyyy 'at' h:mm b",
            );
        }

        return rows;
    } catch (error) {
        console.error("Database error: ", error.message);
        throw new Error("Could not get all users");
    }
}

async function getUserByUsername(username) {
    try {
        const query = `
            SELECT * FROM users WHERE username = $1;
        `;
        const { rows } = await db.query(query, [username]);

        return rows[0];
    } catch (error) {
        console.error("Database error: ", error.message);
        throw new Error("Could not get the user by username.");
    }
}

async function getUserInfoById(id) {
    try {
        const query = `
            SELECT users.id, users.first_name, users.last_name, users.username, users.bio, users.gender, users.is_member, users.is_admin, profile_pictures.path AS profile_picture, profile_pictures.description AS ppf_description, profile_pictures.id AS profile_picture_id FROM users 
            INNER JOIN profilepictures_users ON users.id = profilepictures_users.user_id
            INNER JOIN profile_pictures ON profilepictures_users.profile_picture_id = profile_pictures.id
            WHERE users.id = $1;
        `;

        const { rows } = await db.query(query, [id]);

        return rows[0];
    } catch (error) {
        console.error("Database error: ", error.message);
        throw new Error("Could not get the user information by it's id.");
    }
}

async function grantAdminPrivileges(userId) {
    try {
        const query = `
            UPDATE users SET is_admin = true WHERE id = $1;
        `;

        await db.query(query, [userId]);
    } catch (error) {
        console.error("Database error: ", error.message);
        throw new Error("Could not grant admin privileges to the user.");
    }
}

async function grantMemberPrivileges(userId) {
    try {
        const query = `
            UPDATE users SET is_member = true WHERE id = $1;
        `;

        await db.query(query, [userId]);
    } catch (error) {
        console.error("Database error: ", error.message);
        throw new Error("Could not grant member privileges to the user.");
    }
}

async function getUserPassword(userId) {
    try {
        const query = `
            SELECT password FROM users WHERE id = $1;
        `;

        const { rows } = await db.query(query, [userId]);

        return rows[0].password;
    } catch (error) {
        console.error("Database error: ", error.message);
        throw new Error("Could not get the user password.");
    }
}

async function deleteUser(id) {
    try {
        const query = `
            DELETE FROM users WHERE id = $1;
        `;

        await db.query(query, [id]);
    } catch (error) {
        console.error("Database error: ", error.message);
        throw new Error("Could not delete the user.");
    }
}

async function insertNewMessage(userId, title, content) {
    try {
        const query = `
            INSERT INTO messages (author_id, title, content) VALUES ($1, $2, $3);
        `;

        await db.query(query, [userId, title, content]);
    } catch (error) {
        console.error("Database error: ", error.message);
        throw new Error("Could not insert the messagege in the database.");
    }
}

async function getAllMessages() {
    try {
        const query = `
            SELECT users.first_name,
                users.last_name,
                users.username,
                users.gender,
                users.is_member,
                users.is_admin,
                messages.id AS message_id,
                messages.author_id AS message_author,
                messages.title AS message_title,
                messages.content AS message_content,
                messages.created_at AS message_date,
                profile_pictures.path AS profile_picture,
                profile_pictures.description AS ppf_description
                FROM messages INNER JOIN users ON messages.author_id = users.id
                INNER JOIN profilepictures_users ON users.id = profilepictures_users.user_id
                INNER JOIN profile_pictures ON profilepictures_users.profile_picture_id = profile_pictures.id ORDER BY messages.created_at DESC;
            `;

        const { rows } = await db.query(query);

        // Transform the message date to a more readibly format.
        for (let i = 0; i < rows.length; i++) {
            rows[i].message_date = format(
                rows[i].message_date,
                "do,  MMMM 'of' yyyy 'at' hh:mm a",
            );
        }

        return rows;
    } catch (error) {
        console.error("Database error: ", error.message);
        throw new Error("Could not get all the messages.");
    }
}

async function deleteMessage(messageId) {
    try {
        const query = `
            DELETE FROM messages WHERE id = $1;
        `;

        await db.query(query, [messageId]);
    } catch (error) {
        console.error("Database error: ", error.message);
        throw new Error("Could not delete the message.");
    }
}

async function updateUserProfile(
    userId,
    firstName,
    lastName,
    username,
    gender,
    bio,
) {
    try {
        // Update profile in the 'users' table.
        const query = `
                UPDATE users SET first_name = $1, last_name= $2, username = $3, gender = $4, bio = $5 WHERE id = $6;
            `;

        await db.query(query, [
            firstName,
            lastName,
            username,
            gender,
            bio,
            userId,
        ]);
    } catch (error) {
        console.error("Database error:", error.message);
        throw new Error("Error when trying to update the user profile.");
    }
}

async function updateProfilePicture(userId, profilePictureId) {
    try {
        const query = `
            UPDATE profilepictures_users SET profile_picture_id = $1 WHERE user_id = $2;
        `;

        await db.query(query, [profilePictureId, userId]);
    } catch (error) {
        console.error("Database error:", error.message);
        throw new Error(
            "Something failed when trying to update the user's profile picture.",
        );
    }
}

async function getUserPassword(userId) {
    try {
        const query = `
            SELECT password FROM users WHERE id = $1;
        `;

        const { rows } = await db.query(query, [userId]);

        return rows[0].password;
    } catch (error) {
        console.error("Database error:", error.message);
        throw new Error("Could not the user password.");
    }
}

async function updateUserPassword(userId, newPassword) {
    try {
        const hashedPass = await bcrypt.hash(newPassword, 10);
        const query = `
            UPDATE users SET password = $1 WHERE id = $2;
        `;

        await db.query(query, [hashedPass, userId]);
    } catch (error) {
        console.error("Database error:", error.message);
        throw new Error("Could not update the user's password.");
    }
}

async function getUserMessages(userId) {
    try {
        const query = `
                SELECT messages.id, messages.title, messages.content, messages.created_at FROM messages INNER JOIN users ON messages.author_id = users.id WHERE users.id = $1 ORDER BY messages.created_at DESC;
            `;

        const { rows } = await db.query(query, [userId]);

        for (let i = 0; i < rows.length; i++) {
            rows[i].created_at = format(
                rows[i].created_at,
                "do,  MMMM 'of' yyyy 'at' hh:mm a",
            );
        }

        return rows;
    } catch (error) {
        console.error("Database error: ", error.message);
        throw new Error(
            "Something failed when trying to retrieve messages wrote by user.",
        );
    }
}

async function checkIfMessageExists(messageId) {
    const query = `
        SELECT id FROM messages WHERE id = $1;
    `;

    const { rows } = await db.query(query, [messageId]);

    if (rows.length > 0) {
        return true;
    } else {
        return false;
    }
}

async function checkIfUserIsMessageAuthor(messageId, userId) {
    try {
        const query = `
            SELECT * FROM messages WHERE id = $1 AND author_id = $2;
        `;

        const { rows } = await db.query(query, [messageId, userId]);

        if (rows.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Database error: ", error.message);
        throw new Error("Cound not check if the user is the message author.");
    }
}

async function deleteUserMessage(userId, messageId) {
    try {
        const query = `
                DELETE FROM messages WHERE author_id = $1 AND id = $2;
            `;

        await db.query(query, [userId, messageId]);
    } catch (error) {
        console.error("Database error:", error.message);
        throw new Error(
            "Something went wrong when the use was trying to delete one of it's own messages.",
        );
    }
}

async function getUserProfile(userId) {
    try {
        const query = `
                SELECT users.first_name,
                    users.last_name,
                    users.username,
                    users.gender,
                    users.is_admin,
                    users.is_member,
                    users.bio,
                    users.creation_date,
                    profile_pictures.path AS profile_picture FROM users
                                INNER JOIN profilepictures_users ON users.id = profilepictures_users.user_id
                                INNER JOIN profile_pictures ON profilepictures_users.profile_picture_id = profile_pictures.id WHERE users.id = $1;
            `;

        const { rows } = await db.query(query, [userId]);

        rows[0].creation_date = format(
            rows[0].creation_date,
            "do,  MMMM 'of' yyyy",
        );

        const query2 = `
                SELECT * FROM messages WHERE author_id = $1;
            `;

        const { rows: messages } = await db.query(query2, [userId]);

        for (let i = 0; i < messages.length; i++) {
            messages[i].created_at = format(
                messages[i].created_at,

                "do,  MMMM 'of' yyyy 'at' hh:mm a",
            );
        }

        rows[0].messages = messages;

        return rows[0];
    } catch (error) {
        console.error("Database error:", error.message);
        throw new Error("Something went wrong when getting user profile.");
    }
}

async function checkIfUserExistsById(userId) {
    try {
        const query = `
            SELECT id FROM users WHERE id = $1;
        `;

        const { rows } = await db.query(query, [userId]);

        if (rows.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Database error:", error.message);
        throw new Error("Could not check if the user exists by it's id.");
    }
}

async function getAllUsersSortedBy(sortBy) {
    try {
        console.log("content of sort by variable:", sortBy);

        const query = `
            SELECT users.id,
                users.first_name, 
                users.last_name,
                users.username,
                users.gender,
                users.is_member,
                users.is_admin,
                users.creation_date,
                profile_pictures.path AS profile_picture,
                (SELECT COUNT(*) FROM messages WHERE messages.author_id = users.id) AS n_messages FROM users
                INNER JOIN profilepictures_users ON users.id = profilepictures_users.user_id
                INNER JOIN profile_pictures ON profilepictures_users.profile_picture_id = profile_pictures.id
                    ORDER BY users.creation_date ${sortBy};
        `;

        const { rows } = await db.query(query);

        for (let i = 0; i < rows.length; i++) {
            rows[i].creation_date = format(
                rows[i].creation_date,
                "do 'of' MMMM 'of' yyyy 'at' h:mm b",
            );
        }

        console.log("The content of rows is:", rows);
        return rows;
    } catch (error) {
        console.error("Database error:", error.message);
        throw new Error(
            "Something went wrong when trying to get the users sorted.",
        );
    }
}

async function searchUserByUsername(username) {
    try {
        const query = `
            SELECT users.id,
                users.first_name, 
                users.last_name,
                users.username,
                users.gender,
                users.is_member,
                users.is_admin,
                users.creation_date,
                profile_pictures.path AS profile_picture,
                (SELECT COUNT(*) FROM messages WHERE messages.author_id = users.id) AS n_messages FROM users
                INNER JOIN profilepictures_users ON users.id = profilepictures_users.user_id
                INNER JOIN profile_pictures ON profilepictures_users.profile_picture_id = profile_pictures.id WHERE users.username LIKE $1;
        `;

        const { rows } = await db.query(query, [`%${username}%`]);

        for (let i = 0; i < rows.length; i++) {
            rows[i].creation_date = format(
                rows[i].creation_date,
                "do 'of' MMMM 'of' yyyy",
            );
        }

        return rows;
    } catch (error) {
        console.error("Database error:", error.message);
        throw new Error(
            "Something went wrong when trying to search for a user.",
        );
    }
}

async function getMessagesSorted(sortBy) {
    try {
        const query = `
            SELECT users.first_name,
                users.last_name,
                users.username,
                users.gender,
                users.is_member,
                users.is_admin,
                messages.id AS message_id,
                messages.author_id AS message_author,
                messages.title AS message_title,
                messages.content AS message_content,
                messages.created_at AS message_date,
                profile_pictures.path AS profile_picture,
                profile_pictures.description AS ppf_description
                FROM messages INNER JOIN users ON messages.author_id = users.id
                INNER JOIN profilepictures_users ON users.id = profilepictures_users.user_id
                INNER JOIN profile_pictures ON profilepictures_users.profile_picture_id = profile_pictures.id ORDER BY messages.created_at ${sortBy};
        `;

        const { rows } = await db.query(query);

        for (let i = 0; i < rows.length; i++) {
            rows[i].message_date = format(
                rows[i].message_date,
                "do,  MMMM 'of' yyyy 'at' hh:mm a",
            );
        }

        return rows;
    } catch (error) {
        console.error("Database error:", error.message);
        throw new Error(
            "Something went wrong when trying to get messages sorted.",
        );
    }
}

module.exports = {
    usernameExists,
    checkIfMessageExists,
    checkIfUpdatedUsernameIsValid,
    getProfilePicturesPath,
    insertUser,
    getAllUsers,
    getUserByUsername,
    getUserInfoById,
    grantAdminPrivileges,
    grantMemberPrivileges,
    getUserPassword,
    deleteUser,
    insertNewMessage,
    getAllMessages,
    deleteMessage,
    updateUserProfile,
    updateProfilePicture,
    getUserPassword,
    updateUserPassword,
    getUserMessages,
    deleteUserMessage,
    getUserProfile,
    checkIfUserExistsById,
    checkIfProfilePictureExists,
    checkIfUserIsMessageAuthor,
    checkIfUserExistsByUsername,
    searchUserByUsername,
    getAllUsersSortedBy,
    getMessagesSorted,
};
