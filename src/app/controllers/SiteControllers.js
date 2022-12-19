const pgClient = require("../config/PgConnection");
class SiteControllers {
  // [GET] map
  map(req, res, next) {
    
    const qhsd = pgClient.query(`Select * from qhsd`, ["get qhsd successful!"]);
    console.log(qhsd);
    res.render("map",qhsd );
    // res.send(qhsd);
    // pgClient.query(`Select * from qhsd`, (err, result) => {
    //   if (!err) {
    //     res.render("map", { qhsd: result.rows });
    //     res.send(result);
    //   }
    // });
    pgClient.end;
  }
  // [GET] search
  search(req, res) {
    res.send("NEW SEARCH DETAIL!!!");
  }
}
module.exports = new SiteControllers();
