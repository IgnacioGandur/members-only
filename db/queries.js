const db = require("./pool");
const bcrypt = require("bcryptjs");
const { format } = require("date-fns");

const dbInteractions = {
    async usernameExists(username) {
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
    },

    async checkIfUpdatedUsernameIsValid(userId, updatedUsername) {
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
                console.log("username not available");
                return true;
            } else {
                console.log("username available");
                return false;
            }
        } catch (error) {
            console.error("Database error: ", error.message);
            throw new Error(
                "Could not check if the username already existed when trying to update the username.",
            );
        }
    },

    async getProfilePicturesPath() {
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
    },

    async insertUser(
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
    },

    async getAllUsers() {
        const query = `
            SELECT users.first_name, users.last_name, users.username, users.bio, users.gender, users.is_member, users.is_admin, profile_pictures.path AS profile_picture, profile_pictures.description AS ppf_description FROM users
            INNER JOIN profilepictures_users ON users.id = profilepictures_users.user_id
            INNER JOIN profile_pictures ON profilepictures_users.profile_picture_id = profile_pictures.id;
        `;
        const { rows } = await db.query(query);

        return rows;
    },

    async getUserByUsername(username) {
        const query = `
            SELECT * FROM users WHERE username = $1;
        `;
        const { rows } = await db.query(query, [username]);

        return rows[0];
    },

    async getUserInfoById(id) {
        const query = `
            SELECT users.id, users.first_name, users.last_name, users.username, users.bio, users.gender, users.is_member, users.is_admin, profile_pictures.path AS profile_picture, profile_pictures.description AS ppf_description FROM users 
            INNER JOIN profilepictures_users ON users.id = profilepictures_users.user_id
            INNER JOIN profile_pictures ON profilepictures_users.profile_picture_id = profile_pictures.id
            WHERE users.id = $1;
        `;

        const { rows } = await db.query(query, [id]);

        return rows[0];
    },

    async grantAdminPrivileges(userId) {
        const query = `
            UPDATE users SET is_admin = true WHERE id = $1;
        `;

        await db.query(query, [userId]);
    },

    async grantMemberPrivileges(userId) {
        const query = `
            UPDATE users SET is_member = true WHERE id = $1;
        `;

        await db.query(query, [userId]);
    },
    async getUserPassword(userId) {
        const query = `
            SELECT password FROM users WHERE id = $1;
        `;

        const { rows } = await db.query(query, [userId]);

        return rows[0].password;
    },
    async deleteUser(id) {
        const query = `
            DELETE FROM users WHERE id = $1;
        `;

        await db.query(query, [id]);
    },
    async insertNewMessage(userId, title, content) {
        const query = `
            INSERT INTO messages (author_id, title, content) VALUES ($1, $2, $3);
        `;

        await db.query(query, [userId, title, content]);
    },
    async getAllMessages() {
        const query = `
            SELECT users.first_name,
                users.last_name,
                users.username,
                users.gender,
                users.is_member,
                users.is_admin,
                messages.id AS message_id,
                messages.title AS message_title,
                messages.content AS message_content,
                messages.created_at AS message_date,
                profile_pictures.path AS profile_picture,
                profile_pictures.description AS ppf_description
                FROM messages INNER JOIN users ON messages.author_id = users.id
                INNER JOIN profilepictures_users ON users.id = profilepictures_users.user_id
                INNER JOIN profile_pictures ON profilepictures_users.profile_picture_id = profile_pictures.id ORDER BY messages.created_at;
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
    },

    async deleteMessage(messageId) {
        const query = `
            DELETE FROM messages WHERE id = $1;
        `;

        await db.query(query, [messageId]);
    },

    async updateUserProfile(
        userId,
        updatedProfilePictureId,
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

            // Update profile picture
            const query2 = `
                UPDATE profilePictures_users SET profile_picture_id = $1 WHERE user_id = $2;
            `;

            await db.query(query2, [updatedProfilePictureId, userId]);
        } catch (error) {
            console.error("Database error:", error.message);
            throw new Error("Error when trying to update the user profile.");
        }
    },

    async getUserPassword(userId) {
        const query = `
            SELECT password FROM users WHERE id = $1;
        `;

        const { rows } = await db.query(query, [userId]);

        return rows[0].password;
    },

    async updateUserPassword(userId, newPassword) {
        const hashedPass = await bcrypt.hash(newPassword, 10);
        const query = `
            UPDATE users SET password = $1 WHERE id = $2;
        `;

        await db.query(query, [hashedPass, userId]);
    },
};

module.exports = dbInteractions;
