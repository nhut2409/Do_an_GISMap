class HomesControllers {
  // [GET] / Homes
  homes(req, res) {
    res.render("homes");
  }
  // [GET] / Homes detail: /homes/:slug
  homeDetail(req, res) {
    res.send("NEW DETAIL!!! --- " + req.params.slug);
  }
}
module.exports = new HomesControllers();
