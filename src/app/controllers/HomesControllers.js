class HomesControllers {
  // [GET] / Homes
  homes(req, res) {
    res.render("homes");
  }
  // [GET] / Homes detail
  homeDetail(req, res) {
    res.send("NEW DETAIL!!!");
  }
}
module.exports = new HomesControllers();
