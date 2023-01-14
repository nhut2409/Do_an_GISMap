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
        //   pgClient.query(`Select * from xa`, (err, result) => {
        //     callback(err, result.rows);
        //   });
        // },
        homeData: function (callback) {
          pgClient.query(
            `SELECT *
          FROM thongtinnha, ndc, xa 
          WHERE (thongtinnha.id_ndc = ndc.gid) and (ndc.ma_xa = xa.ma_xa)
          ORDER BY thongtinnha.id_nha`,
            (err, result) => {
              callback(err, result.rows);
              console.log(result.rows);
            }
          );
        },
        ndcData: function (callback) {
          pgClient.query(
            `SELECT * FROM xa INNER JOIN ndc ON xa.ma_xa = ndc.ma_xa`,
            (err, result) => {
              callback(err, result.rows);
            }
          );
        },
      },
      function (err, results) {
        if (!err) {
          res.render("map", results);
        }
      }
    );
  }

  // search(req, res) {
  //   console.log(req.params);
  //   res.send("NEW SEARCH DETAIL!!!");
  // }
}
module.exports = new SiteControllers();
