require("dotenv").config();
const mysql = require("mysql2");

const conn = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_PASSWORD,
});

async function getBots() {
  return await new Promise(function (res, rej) {
    results = [];
    conn.query("SELECT * FROM bots", function (err, data) {
      if (err) {
        rej(err);
      }
      data.forEach((element) => {
        row = element;
        row["token"] = "YOUR_TOKEN_WAS_HIDDEN_BY_JPANEL_TO_PREVENT_HACKING";
        results.push(element);
      });
      res(data);
    });
  });
}

module.exports = {
  getBots: getBots,
};
