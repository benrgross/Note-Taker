const express = require("express");
// const { fstat } = require("fs");
const path = require("path");
const notes = require("./db/db.json");
const fs = require("fs");
// const { json } = require("express");
// const { notStrictEqual } = require("assert");

const app = express();
const PORT = process.env.PORT || 4000;

//set up the express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Send user to the ajax page
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/notes.html"))
);

// make route for GET /api/notes
app.get("/api/notes", (req, res) => res.json(notes));
// make route for POST /api/notes

app.post("/api/notes", (req, res) =>
  // read file
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    if (err) {
      console.log(err);
      return;
    }

    let savedNotes = JSON.parse(data);
    let newNote = req.body;
    let noteId = savedNotes.length + 1;
    newNote.id = noteId;
    savedNotes.push(newNote);
    console.log(newNote);
    // fs write file sync take user input and wrote ot back to json file
    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(req.body);
    return console.log("Added new note: " + newNote.title);
  })
);

// app.get("/api/notes/:id", function (req, res) )

// delete note
app.delete("/api/notes/:id", function (req, res) {
  let readNotes = fs.readFileSync("./db/db.json", "utf-8", (err) =>
    err ? console.log(error) : console.log("reading .json")
  );
  readNotes = JSON.parse(readNotes);
  console.log("notes read", readNotes);
  console.log("params id", req.params.id);
  let notesKept = readNotes.filter((note) => note.id !== Number(req.params.id));
  fs.writeFileSync("./db/db.json", JSON.stringify(notesKept), (err) =>
    err ? console.log(error) : console.log("deleting note")
  );
  console.log("notes kept", notesKept);
  res.json(notesKept);
});

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
