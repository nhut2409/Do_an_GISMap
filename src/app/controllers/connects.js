// const pool = require("../config/PgConnection");
// const models = require("./moduls");

// const getXa = (req, res) => {
//   pgClient.query("Select * from xa", (err, results) => {
//     if (err) {
//       throw err;
//     } else {
//       res.status(200).json(results.rows);
//       console.log(results.rows);
//     }
//   });
// };
// const getNenDiaChinh = (req, res) => {
//   pgClient.query(
//     "Select gid, loaidat, ma_xa, sh_thua, sh_to, ten_chusd from ndc",
//     (err, results) => {
//       if (err) {
//         throw err;
//       } else {
//         res.status(200).json(results.rows);
//         console.log(results.rows);
//       }
//     }
//   );
// };
// const getQuyHoachSuDung = (req, res) => {
//   pgClient.query(
//     "Select  gid,mucdichsud,namquyhoac,tencongtri from qhsd",
//     (err, results) => {
//       if (err) {
//         throw err;
//       } else {
//         res.status(200).json(results.rows);
//         console.log(results.rows);
//       }
//     }
//   );
// };
// const getHienTrangSuDung = (req, res) => {
//     pgClient.query(
//       "SELECT gid,loaidathie,maxa,namkiemke,tencongtri from htsd",
//       (err, results) => {
//         if (err) {
//           throw err;
//         } else {
//           res.status(200).json(results.rows);
//           console.log(results.rows);
//         }
//       }
//     );
//   };

// module.exports = {
//   getXa,
//   getNenDiaChinh,
//   getQuyHoachSuDung,
//   getHienTrangSuDung
// };
