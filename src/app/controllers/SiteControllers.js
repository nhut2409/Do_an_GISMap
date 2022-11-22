class SiteControllers {
  // [GET] map
  map(req, res) {
    res.render("map");
  }

  // [GET] search
  search(req, res) {
    res.send("NEW SEARCH DETAIL!!!");
  }
}
module.exports = new SiteControllers();
