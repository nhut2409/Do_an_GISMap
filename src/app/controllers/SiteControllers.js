const pgClient = require("../config/PgConnection");
class SiteControllers {
  // [GET] map
  map(req, res) {
    // res.render("map");
    pgClient.query(`Select * from qhsd`, (err, result) => {
      if (!err) {
        res.send(result.rows);
      }
    });
    pgClient.end;
  }
  // [GET] search
  search(req, res) {
    res.send("NEW SEARCH DETAIL!!!");
  }
}
module.exports = new SiteControllers();
