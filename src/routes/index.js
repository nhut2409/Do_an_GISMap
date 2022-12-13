function route(app) {
  app.use("/homes", require("./homes"));
  app.use("/",  require("./site"));
}
module.exports = route;
