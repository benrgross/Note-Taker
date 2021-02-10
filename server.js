const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

//set up the express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Send user to the ajax page
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "notes.html")));

app.get("/", (req, res) => {
  res.send("the server is listening");
});

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}1`);
});
