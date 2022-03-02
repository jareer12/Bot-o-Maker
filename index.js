require("dotenv").config();

const express = require("express");
const fs = require("fs");
const App = express();

const SQL = require("./modules/sql");

App.get("/:name", (req, res) => {
  if (req.params.name) {
    console.log(req.params.name);
    if (fs.existsSync(`./pages/${req.params.name}.html`)) {
      res.sendFile(`${__dirname}/pages/${req.params.name}.html`);
    } else {
      res.sendFile(`${__dirname}/pages/404.html`);
    }
  } else {
    res.sendFile(`${__dirname}/pages/index.html`);
  }
});

App.get("/json/bots", (req, res) => {
  SQL.getBots()
    .then((data) => {
      console.log(data);
      res.end(JSON.stringify(data));
    })
    .catch((err) => {
      console.log(err);
      res.end(JSON.stringify(err));
    });
});

App.get("/", (req, res) => {
  res.sendFile(`${__dirname}/pages/index.html`);
});

App.get("/assets/:name", (req, res) => {
  if (fs.existsSync(`./assets/${req.params.name}`)) {
    res.sendFile(`${__dirname}/assets/${req.params.name}`);
  } else {
    res.send(`Script/style/file does not exist on our server`);
  }
});

App.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});
