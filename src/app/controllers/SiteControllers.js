const pool = require("../config/PgConnection");
const pgClient = require("../config/PgConnection");
class SiteControllers {
  // [GET] map
  async map(req, res, next) {
    pgClient.query(`Select * from xa`, (err, result) => {
      if (!err) {
        res.render("map", {
          xaData: result.rows,
        });
      }
    });
    pgClient.query(`Select * from qhsd`, (err, result) => {
      if (!err) {
        res.render("map", {
          qhsdData: JSON.stringify(result.rows),
        });
      }
    });
  }

  search(req, res) {
    console.log(req.params);
    res.send("NEW SEARCH DETAIL!!!");
  }
}
module.exports = new SiteControllers();
