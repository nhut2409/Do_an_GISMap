const client = require("./app/config/PgConnection");
const express = require("express");
const morgan = require("morgan");
const app = express();
const path = require("path");
const route = require("./routes");
const hbs = require("express-handlebars");

const port = 3000;
const hostname = "127.0.0.1";
app.use(morgan("combined"));
// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );
// app.use(express.json);

app.use(express.static(path.join(__dirname, "./public")));
app.engine(
  "hbs",
  hbs.engine({
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./resources/views"));
// routes innit
route(app);

client
  .connect()
  .then(() => console.log("connected"))
  .catch((err) => console.error("connection error", err.stack));

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
