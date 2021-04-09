// Dependencies
// =============================================================
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const dbJSON = require("../database/db.json");
const path = require("path");

module.exports = app => {
    // API ROUTES
    // ========================================================

    app.get("/api/notes", function (req, res) {
        return res.json(dbJSON);
    });

    app.post("/api/notes", function (req, res) {
        // Validate request body
        if (!req.body.title) {
            return res.json({ error: "Missing required title" });
        }

        // Copy request body and generate ID
        const note = { ...req.body, id: uuidv4() };

        // Push note to dbJSON array - saves data in memory
        dbJSON.push(note);

        writeData();

        console.log("New Note Created with ID " + note.id);
        return res.json(note);
    });

    // Retrieve a note with specific id
    app.get("/api/notes/:id", function (req, res) {
        return res.json(dbJSON.find(ele => ele.id === req.params.id));
    });

    // Deletes a note with specific id
    app.delete("/api/notes/:id", function (req, res) {
        let deletedNote = dbJSON.splice(
            dbJSON.findIndex(ele => ele.id === req.params.id),
            1
        );
        writeData();
        console.log("Note Removed with ID " + req.params.id);
        return res.json(deletedNote);
    });
};

const writeData = () => {
    // Saves data to file by persisting in memory variable dbJSON to db.json file.
    // This is needed because when we turn off server we loose all memory data like pbJSON variable.
    // Saving to file allows us to read previous notes (before server was shutdown) from file.
    fs.writeFile(
        path.join(__dirname, "../database/db.json"),
        JSON.stringify(dbJSON),
        err => {
            if (err) {
                res.json({ error: "Error writing to file" });
            }
        }
    );
};
