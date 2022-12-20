// const pool = require("../config/PgConnection");
const pool = require("../config/PgConnection");
class SiteControllers {
  // [GET] map
  async map(req, res, next) {
    const xa = [{}];
    const [rows, fields] = await pool.execute(`Select * from xa`);
    return res.render("map", {
      xaData: rows,
    });
  }

  search(req, res) {
    console.log(req.params);
    res.send("NEW SEARCH DETAIL!!!");
  }
}
module.exports = new SiteControllers();
