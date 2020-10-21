// express variables
const { json } = require("express");
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

// STORAGE VARIABLES
// noteTitle, noteText as properties
const notes = [];

// routing

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
})

//GET `/api/notes`
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
})

// - Should read the `db.json` file and return all saved notes as JSON
app.get("/api/notes", (req, res) => {
    const noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

    res.json(noteList);
})

//POST `/api/notes` - Should receive a new note to save on the request body
//add it to the `db.json` file, and then return the new note to the client
app.post("/api/notes", (req, res) => {
    var newNote = req.body;
    // add unique ID to note
    // add test functionality to determine if ID already exists, if it does: generate new ID;
    newNote.id = newNote.title.substring(0, 3) + newNote.text.substring(0, 3) + Math.floor(Math.random() * 100);
    console.log("New Note to add: " + JSON.stringify(newNote));

    // get previously generated notes
    let noteArr = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    // append new note to array
    noteArr.push(newNote);
    // write array back into db.json
    fs.writeFileSync("./db/db.json", JSON.stringify(noteArr), "utf8");
    res.json(noteArr);
})

//DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to
//delete. This means you'll need to find a way to give each note a unique `id` when it's
//saved. In order to delete a note, you'll need to read all notes from the `db.json` file,
//remove the note with the given `id` property, and then rewrite the notes to the `db.json` file
app.delete("/api/notes/:id", (req, res) => {
    const { id } = req.params;
    // console.log("Target ID: " + id);

    let noteArr = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    // console.log("Notes: " + JSON.stringify(noteArr));

    for (let i = 0; i < noteArr.length; i++) {
        if (noteArr[i].id === id) {
            console.log("Note to delete: " + JSON.stringify(noteArr[i]));
            noteArr.splice(i, 1);
            break;
        }
    }
    fs.writeFileSync("./db/db.json", JSON.stringify(noteArr), "utf8");
    res.json(noteArr);
});

// listener for server
app.listen(PORT, () => console.log("App listening on PORT: " + PORT));