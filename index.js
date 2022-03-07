require("dotenv").config();

const Compiler = require("./compiler/index");
const system = require("system-commands");
const bodyParser = require("body-parser");
const Discord = require("discord.js");
const fetch = require("node-fetch");
const express = require("express");
const mysql = require("mysql");
const Path = require("path");
const fs = require("fs");
const pm2 = require("pm2");
const os = require("os");
const App = express();

const conn = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_PASSWORD,
});

const SQL = require("./modules/sql");
App.set("view engine", "html");
App.engine("html", require("ejs").renderFile);
App.use(express.static(Path.join(__dirname, "public")));

App.use(bodyParser.urlencoded({ extended: false }));
App.use(bodyParser.json());

App.get("/toggle-feature/:id", async (req, res) => {
  if (req.params.id) {
    SQL.getBotByID(req.params.id)
      .then((results) => {
        Data = results[0];
        if (Data) {
          SQL.toggleFeature({
            id: req.params.id,
            feature: req.query.feature,
            currentState: `${Data[`${req.query.feature}_feature`]}`,
          })
            .then((data) => {
              res.end(
                JSON.stringify({
                  Success: true,
                  Message: "Successfuly Toggled Feature",
                })
              );
            })
            .catch((err) => {
              res.end(
                JSON.stringify({
                  Success: false,
                  Message: "Error Occured",
                })
              );
            });
        } else {
          res.sendFile(`${__dirname}/pages/no-bot.html`);
        }
      })
      .catch((err) => {
        console.log(err);
        res.end({
          Success: false,
          Message: "Bot not found",
        });
      });
  } else {
    res.sendFile(`${__dirname}/pages/no-bot.html`);
  }
});

App.get("/update-prefix/:id", async (req, res) => {
  if (req.params.id) {
    SQL.getBotByID(req.params.id)
      .then((results) => {
        Data = results[0];
        if (Data) {
          SQL.updatePrefix({
            id: req.params.id,
            prefix: req.query.prefix,
          })
            .then((data) => {
              res.end(
                JSON.stringify({
                  Success: true,
                  Message: "Successfuly Updated Prefix",
                })
              );
            })
            .catch((err) => {
              res.end(
                JSON.stringify({
                  Success: false,
                  Message: "Error Occured",
                })
              );
            });
        } else {
          res.sendFile(`${__dirname}/pages/no-bot.html`);
        }
      })
      .catch((err) => {
        console.log(err);
        res.end({
          Success: false,
          Message: "Bot not found",
        });
      });
  } else {
    res.sendFile(`${__dirname}/pages/no-bot.html`);
  }
});

App.get("/update-token/:id", async (req, res) => {
  if (req.params.id) {
    SQL.getBotByID(req.params.id)
      .then((results) => {
        Data = results[0];
        if (Data) {
          SQL.updateToken({
            id: req.params.id,
            token: req.query.token,
          })
            .then((data) => {
              res.end(
                JSON.stringify({
                  Success: true,
                  Message: "Successfuly Updated Token",
                })
              );
            })
            .catch((err) => {
              res.end(
                JSON.stringify({
                  Success: false,
                  Message: "Error Occured",
                })
              );
            });
        } else {
          res.sendFile(`${__dirname}/pages/no-bot.html`);
        }
      })
      .catch((err) => {
        console.log(err);
        res.end({
          Success: false,
          Message: "Bot not found",
        });
      });
  } else {
    res.sendFile(`${__dirname}/pages/no-bot.html`);
  }
});

App.get("/restart/:id", async (req, res) => {
  if (req.params.id) {
    SQL.getBotByID(req.params.id)
      .then((results) => {
        pm2.restart(req.params.id);
        res.end(
          JSON.stringify({
            Success: true,
            Message: `Successfuly Restarted`,
          })
        );
      })
      .catch((err) => {
        console.log(err);
        res.end({
          Success: false,
          Message: "Bot not found",
        });
      });
  } else {
    res.end(
      JSON.stringify({
        Success: false,
        Message: "No id query given",
      })
    );
  }
});

App.get("/start/:id", async (req, res) => {
  if (req.params.id) {
    SQL.getBotByID(req.params.id)
      .then((results) => {
        pm2.start({
          watch: false,
          daemon: false,
          detached: true,
          min_uptime: 5000,
          watch_delay: 5000,
          autorestart: false,
          watch_ignore: true,
          name: `${req.params.id}`,
          lines: process.env.MAX_LOG_LINES,
          max_restarts: process.env.MAX_RELOADS,
          restart_delay: process.env.RESTART_DELAY,
          script: `${__dirname}/bots/${req.params.id}/index.js`,
          out_file: `${__dirname}/bots/logs/${req.params.id}.strout.log`,
          error_file: `${__dirname}/bots/logs/${req.params.id}.strerr.log`,
          max_memory_restart: `${
            parseFloat(process.env.MAXIMUM_RAM_BYTES) / 1000000
          }M`,
        });
        res.end(
          JSON.stringify({
            Success: true,
            Message: `Successfuly Started`,
          })
        );
      })
      .catch((err) => {
        console.log(err);
        res.end({
          Success: false,
          Message: "Bot not found",
        });
      });
  } else {
    res.end(
      JSON.stringify({
        Success: false,
        Message: "No id query given",
      })
    );
  }
});

App.post("/create", async (req, res) => {
  if (req.body.token) {
    if (req.body.prefix) {
      let client = new Discord.Client({
        intents: [Discord.Intents.FLAGS.GUILDS],
      });
      try {
        client.login(req.body.token).catch((err) => {
          res.end(
            JSON.stringify({
              Success: false,
              Message: `${err}`,
            })
          );
        });
        client.on("ready", () => {
          let Pack = {
            name: client.user.id,
            version: "1.0.0",
            main: "index.js",
            author: "Jareer",
            license: "ISC",
            dependencies: {
              "discord.js": "^12.5.3",
              "node-fetch": "^2.6.6",
            },
          };
          fs.mkdir(`./bots/${client.user.id}`, function (err, data) {
            fs.openSync(`./bots/${client.user.id}/index.js`, "w");
            fs.open(
              `./bots/${client.user.id}/package.json`,
              "w",
              function (err, data) {
                fs.writeFileSync(
                  `./bots/${client.user.id}/package.json`,
                  JSON.stringify(Pack)
                );
                system(`cd ./bots/${client.user.id} && npm install`)
                  .then((data) => {
                    console.log(data);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            );
          });
          Username = client.user.tag.split("#");
          SQL.createBot({
            created: new Date().getTime(),
            token: req.body.token,
            prefix: req.body.prefix,
            name: Username[0],
            tag: Username[1],
            image_url: client.user.avatarURL(),
            client_id: client.user.id,
          })
            .then((data) => {
              system("");
              res.end(
                JSON.stringify({
                  Success: true,
                  Message: `Successfuly Added ${client.user.tag}`,
                  Data: data,
                })
              );
            })
            .catch((err) => {
              res.end(
                JSON.stringify({
                  Success: false,
                  Message: `Error Occured ${err}`,
                })
              );
            });
        });
      } catch (err) {
        JSON.stringify({
          Success: false,
          Message: `${err}`,
        });
      }
    } else {
      JSON.stringify({
        Success: false,
        Message: `You forgot to enter a bot prefix`,
      });
    }
  } else {
    res.end(
      JSON.stringify({
        Success: false,
        Message: `You forgot to enter a bot token`,
      })
    );
  }
});

App.get("/list-bots", async (req, res) => {
  pm2.list((err, list) => {
    res.end(
      JSON.stringify({
        Success: true,
        Message: `Successfuly Start`,
        Data: list,
      })
    );
  });
});

App.get("/npm-install/:id", async (req, res) => {
  if (req.params.id) {
    SQL.getBotByID(req.params.id)
      .then((results) => {
        system(`cd ./bots/${req.params.id} && npm install`)
          .then((output) => {
            res.end(
              JSON.stringify({
                Success: true,
                Message: `Successfuly Installed`,
                Data: {
                  Output: output,
                },
              })
            );
          })
          .catch((error) => {
            res.end(
              JSON.stringify({
                Success: false,
                Message: `Error Occured`,
                Data: {
                  Error: error,
                },
              })
            );
          });
      })
      .catch((err) => {
        console.log(err);
        res.end({
          Success: false,
          Message: "Bot not found",
        });
      });
  } else {
    res.end(
      JSON.stringify({
        Success: false,
        Message: "No id query given",
      })
    );
  }
});

App.get("/npm-init/:id", async (req, res) => {
  if (req.params.id) {
    SQL.getBotByID(req.params.id)
      .then((results) => {
        system(`cd ${__dirname}/bots/${req.params.id} && npm init --yes`)
          .then((output) => {
            res.end(
              JSON.stringify({
                Success: true,
                Message: `Successfuly Installed`,
                Data: {
                  Output: output,
                },
              })
            );
          })
          .catch((error) => {
            res.end(
              JSON.stringify({
                Success: false,
                Message: `Error Occured`,
                Data: {
                  Error: error,
                },
              })
            );
          });
      })
      .catch((err) => {
        console.log(err);
        res.end({
          Success: false,
          Message: "Bot not found",
        });
      });
  } else {
    res.end(
      JSON.stringify({
        Success: false,
        Message: "No id query given",
      })
    );
  }
});

App.get("/compile", (req, res) => {
  if (req.query.id) {
    conn.query(
      `SELECT * FROM bots WHERE client_id = '${req.query.id}' LIMIT 1`,
      function (err, result) {
        data = result[0];
        if (err) {
          res.end(
            JSON.stringify({
              Success: false,
            })
          );
        } else {
          let Code = Compiler.Compile(result[0]);
          if (fs.existsSync(`./bots/${req.query.id}`)) {
            if (fs.existsSync(`./bots/${req.query.id}/index.js`)) {
              fs.writeFile(
                `./bots/${req.query.id}/index.js`,
                Code,
                function () {
                  res.end(
                    JSON.stringify({
                      Success: true,
                      Message:
                        "Successfuly Compiled New Code, Restart The Bot For Changes",
                      Data: data,
                    })
                  );
                }
              );
            } else {
              fs.openSync(`./bots/${req.query.id}/index.js`, "w");
              res.end(
                JSON.stringify({
                  Success: false,
                  Message:
                    "Bot file didn't exist so we created one for you, Retry please",
                })
              );
            }
          } else {
            fs.mkdirSync(`./bots/${req.query.id}`);
            res.end(
              JSON.stringify({
                Success: false,
                Message:
                  "Bot directory didn't exist so we created one for you, Retry please",
              })
            );
          }
        }
      }
    );
  } else {
    res.end(
      JSON.stringify({
        Success: false,
      })
    );
  }
});

App.get("/manage/:id", async (req, res) => {
  function censor(str) {
    ray = "";
    dat = str.split("");
    for (let i = 0; i < dat.length; i++) {
      const element = dat[i];
      ray += "*";
    }
    return ray;
  }
  if (req.params.id) {
    SQL.getBotByID(req.params.id)
      .then((results) => {
        Data = results[0];
        if (Data) {
          Data["Censoredtoken"] = `${censor(
            Data["token"].substring(Data["token"] - 4)
          )}${Data["token"].substring((0, Data["token"].length - 6))}`;
          res.render(`${__dirname}/pages/manage-bot.html`, {
            Data: JSON.stringify(results[0]),
          });
        } else {
          res.sendFile(`${__dirname}/pages/no-bot.html`);
        }
      })
      .catch((err) => {
        console.log(err);
        res.sendFile(`${__dirname}/pages/no-bot.html`);
      });
  } else {
    res.sendFile(`${__dirname}/pages/no-bot.html`);
  }
});

App.get("/:name", (req, res) => {
  if (req.params.name) {
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
      res.end(JSON.stringify(data));
    })
    .catch((err) => {
      res.end(JSON.stringify(err));
    });
});

App.get("/json/stats", async (req, res) => {
  Rows = await SQL.getBotSize;
  Size = await SQL.getTableSize;
  res.end(
    JSON.stringify({
      Success: true,
      Data: {
        Server: {
          Ram: os.totalmem - os.freemem,
          RamGB: (os.totalmem - os.freemem) / 1024 / 1024 / 1024,
        },
        MySQL: {
          Bots: Rows,
          Size: Size,
        },
      },
    })
  );
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
