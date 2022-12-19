const pgClient = require("../config/PgConnection");

const qhsd = pgClient.query(`Select * from qhsd`, (err, result) => {
  if (!err) {
    res.send(result.rows);
  }
});
pgClient.end;
