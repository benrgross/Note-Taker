const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("the server is listening");
});

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}1`);
});
