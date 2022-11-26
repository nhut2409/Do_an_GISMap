const client = require("../config/PgConnection");
class SiteControllers {
  // [GET] map
  map(req, res) {
    // res.render("map");
    client.query(`Select maxa from htsd`, (err, result) => {
      if (!err) {
        res.send(result.rows);
      }
    });
    client.end;
  }
  // [GET] search
  search(req, res) {
    res.send("NEW SEARCH DETAIL!!!");
  }
}
module.exports = new SiteControllers();
