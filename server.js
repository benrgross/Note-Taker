const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

//set up the express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Send user to the ajax page
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

// make route for GET /api/notes
app.get("/api/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "db/db.json"));
});
// make route for POST /api/notes

app.post("/api/notes", function (req, res) {
  // read file
  fs.readFile(path.join(__dirname, "db/db.json"), "utf8", function (err, data) {
    if (err) {
      console.log(err);
    }

    let savedNotes = JSON.parse(data);
    let newNote = req.body;
    let noteId = savedNotes.length + 1;
    newNote.id = noteId;
    savedNotes.push(newNote);
    console.log(newNote);
    // fs write file sync take user input and wrote ot back to json file
    res.json(newNote);
    fs.writeFileSync(
      path.join(__dirname, "db/db.json"),
      JSON.stringify(savedNotes)
    );
    console.log("Added new note: " + newNote.title);
  });
});

// delete note by filtering out using note id and rewriting file
app.delete("/api/notes/:id", function (req, res) {
  let readNotes = fs.readFileSync("./db/db.json", "utf-8", (err) =>
    err ? console.log(error) : console.log("reading .json")
  );
  readNotes = JSON.parse(readNotes);
  let notesKept = readNotes.filter((note) => note.id !== Number(req.params.id));
  fs.writeFileSync("./db/db.json", JSON.stringify(notesKept), (err) =>
    err ? console.log(error) : console.log("deleting note")
  );
  res.json(notesKept);
});

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
