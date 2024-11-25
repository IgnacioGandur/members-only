const path = require("path");
const fs = require("fs");

await fs.readdir("./", (error, files) => {
    if (error) {
        throw new Error(error);
    }

    for (let i = 0; i <= files.length; i++) {
        fs.rename(files[i], `${i}.svg`);
    }
});
