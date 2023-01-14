const pgClient = require("../config/PgConnection");
var async = require("async");
const database = require("mime-db");
class HomesControllers {
  homeDetail(req, res) {
    async.series(
      {
        homeDataDetal: function (callback) {
          pgClient.query(
            `SELECT *
          FROM thongtinnha, ndc, xa 
          WHERE (thongtinnha.id_ndc = ndc.gid) and (ndc.ma_xa = xa.ma_xa)
          ORDER BY thongtinnha.id_nha`,
            (err, result) => {
              callback(err, result.rows[req.params.slug]);
              console.log(result.rows[req.params.slug]);
            }
          );
        },
      },
      function (err, results) {
        if (!err) {
          res.render("homedetail", results);
        }
      }
    );
  }

  // [GET] / Homes
  homes(req, res) {
    res.send("NEW DETAIL!!! --- ");
    // res.render("homes");
  }
  // [GET] / Homes detail: /homes/:slug
  // homeDetail(req, res) {
  //   res.render("homeDetail", results);
  //   // res.send("NEW DETAIL!!! 2222--- " + req.params.slug);
  // }
}
module.exports = new HomesControllers();
