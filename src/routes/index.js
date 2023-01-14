function routes(app) {
  app.use("/homes", require("./homes"));
  app.use("/",  require("./site"));
}
module.exports = routes;
