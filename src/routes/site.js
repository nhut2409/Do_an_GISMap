const express = require ('express');
const route = express.Router();
const siteControllers = require('../app/controllers/SiteControllers');

// route
route.use('/search', siteControllers.search);
route.use('/', siteControllers.map);
module.exports = route