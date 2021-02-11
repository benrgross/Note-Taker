const express = require("express");
const { fstat } = require("fs");
const path = require("path");
const notes = require("./db/db.json");
const fs = require("fs");
const { json } = require("express");
const { notStrictEqual } = require("assert");

const app = express();
const PORT = process.env.PORT || 3000;

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

    let savedNote = JSON.parse(data);
    let newNote = req.body;
    let noteId = savedNote.length.toString();
    newNote.id = noteId;
    savedNote.push(newNote);
    console.log(newNote);
    // fs write file sync take user input and wrote ot back to json file
    fs.writeFileSync("./db/db.json", JSON.stringify(savedNote), (err) =>
      err ? console.log(error) : console.log("saving note")
    );
    return res.end();
  })
);

// delete note
app.delete("/api/notes/:id", function (req, res) {
  let readNotes = fs.readFileSync("./db/db.json", "utf-8", (err) =>
    err ? console.log(error) : console.log("reading .json")
  );
  readNotes = JSON.parse(readNotes);
  console.log("notes read", readNotes);
  console.log("params id", req.params.id);
  //   readNotes = JSON.stringify(readNotes);
  //   console.log("string", notes);
  let notesKept = readNotes.filter((note) => note.id !== req.params.id);
  fs.writeFileSync("./db/db.json", JSON.stringify(notesKept), (err) =>
    err ? console.log(error) : console.log("deleting note")
  );
  console.log(notesKept);
  return res.end();
});

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});

// app.get("/", (req, res) => {
//   res.send("the server is listening");
// });
