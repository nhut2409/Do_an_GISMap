const pgClient = require("../config/PgConnection");
var async = require("async");
const database = require("mime-db");
class SiteControllers {
  // [GET] map
  // async map(req, res, next) {
  //   pgClient.query(`Select * from xa`, (err, result) => {
  //     if (!err) {
  //       res.render("map", {
  //         xaData: result.rows,
  //       });
  //     }
  //   });
  //   pgClient.query(`Select * from qhsd`, (err, result) => {
  //     if (!err) {
  //       res.render("map", {
  //         qhsdData: result.rows,
  //       });
  //     }
  //   });
  // }
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
