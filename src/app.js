const pool = require("./app/config/PgConnection");
const express = require("express");
const morgan = require("morgan");
const app = express();
const path = require("path");
const routes = require("./routes");
const port = 3000;
const hostname = "127.0.0.1";
app.use(morgan("combined"));
app.use(express.json())
app.use(express.static(path.join(__dirname, "./public")));
// app.engine(
//   "hbs",
//   hbs.engine({
//     extname: ".hbs",
//   })
// );
// app.set("view engine", "hbs");
app.set("view engine", "ejs")

app.set("views", path.join(__dirname, "./views"));
// routes innit
routes(app);
// conntct database
pool
  .connect()
  .then(() => console.log("connected successfully pool!!!"))
  .catch((err) => console.error("connection error pool", err.stack))
 

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
