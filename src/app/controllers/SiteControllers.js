const pgClient = require("../config/PgConnection");
var async = require("async");
const database = require("mime-db");
class SiteControllers {
  map(req, res) {
    async.series(
      {
        xaData: function (callback) {
          pgClient.query(`Select * from xa`, (err, result) => {
            callback(err, result.rows);
          });
        },
        loaidatData: function (callback) {
          pgClient.query(`Select * from loaidat`, (err, result) => {
            callback(err, result.rows);
          });
        },
        // ndcData: function (callback) {
        //   pgClient.query(`Select * from ndc`, (err, result) => {
        //     callback(err, result.rows);
        //   });
        // },
        ndcData: function (callback) {
          pgClient.query(`SELECT * FROM xa INNER JOIN ndc ON xa.ma_xa = ndc.ma_xa`, (err, result) => {
            callback(err, result.rows);
          });
        },
      },
      function (err, results) {
        if (!err) {
          res.render("map", results);
        }
      }
    );
  }

  search(req, res) {
    console.log(req.params);
    res.send("NEW SEARCH DETAIL!!!");
  }
}
module.exports = new SiteControllers();
