const express = require("express");
const route = express.Router();
const siteControllers = require("../app/controllers/SiteControllers");

route.get("/", siteControllers.map);
module.exports = route;
