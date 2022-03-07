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

async function updatePrefix(data) {
  return await new Promise(function (res, rej) {
    conn.query(
      `UPDATE bots SET prefix = '${data.prefix}' WHERE client_id = '${data.id}'`,
      function (err, data) {
        if (err) {
          console.log(err);
          rej(false);
        }
        res(true);
      }
    );
  });
}

async function updateToken(data) {
  return await new Promise(function (res, rej) {
    conn.query(
      `UPDATE bots SET token = '${data.token}' WHERE client_id = '${data.id}'`,
      function (err, data) {
        if (err) {
          console.log(err);
          rej(false);
        }
        res(true);
      }
    );
  });
}

async function toggleFeature(data) {
  function opposite(current) {
    if (current == 1) {
      return 0;
    } else {
      return 1;
    }
  }
  return await new Promise(function (res, rej) {
    conn.query(
      `UPDATE bots SET ${data.feature}_feature =' ${opposite(
        data.currentState
      )}' WHERE client_id = ${data.id}`,
      function (err, data) {
        if (err) {
          console.log(err);
          rej(false);
        }
        res(true);
      }
    );
  });
}

async function createBot(data) {
  return await new Promise(function (res, rej) {
    conn.query(
      `INSERT INTO bots(name, tag, prefix, created, client_id, image_url, token) VALUES('${data.name}', '${data.tag}', '${data.prefix}', '${data.created}', '${data.client_id}', '${data.image_url}', '${data.token}')`,
      function (err, data) {
        if (err) {
          rej(err);
        }
        res(data);
      }
    );
  });
}

async function getBotByID(id) {
  return await new Promise(function (res, rej) {
    conn.query(
      `SELECT * FROM bots WHERE client_id = '${id}' LIMIT 1`,
      function (err, data) {
        if (err) {
          rej(err);
          return;
        } else {
          results = JSON.parse(JSON.stringify(data));
          if (results.length > 0) {
            res(results);
          } else {
            rej({ Success: false, Message: "Bot not found" });
          }
        }
      }
    );
  });
}

getBotSize = new Promise((res, rej) => {
  conn.query(
    `SELECT COUNT(*) AS 'COUNT' FROM bots`,
    async function (err, data) {
      if (err) {
        return false;
      } else {
        res(JSON.parse(JSON.stringify(data))[0]["COUNT"]);
      }
    }
  );
}).then((res) => {
  return res;
});

getTableSize = new Promise((res, rej) => {
  conn.query(
    `SELECT table_schema, ROUND(SUM(data_length + index_length), 1) "Size" FROM information_schema.tables GROUP BY table_schema`,
    async function (err, data) {
      if (err) {
        return false;
      } else {
        Tables = JSON.parse(JSON.stringify(data));
        Tables.forEach((element) => {
          if (element.table_schema == process.env.MYSQL_DATABASE) {
            res(element);
          }
        });
      }
    }
  );
}).then((res) => {
  return res;
});

module.exports = {
  getBots: getBots,
  getBotSize: getBotSize,
  getBotByID: getBotByID,
  createBot: createBot,
  getTableSize: getTableSize,
  updateToken: updateToken,
  updatePrefix: updatePrefix,
  toggleFeature: toggleFeature,
};
