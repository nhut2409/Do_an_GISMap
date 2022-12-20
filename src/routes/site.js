const express = require ('express');
const route = express.Router();
const siteControllers = require('../app/controllers/SiteControllers');

// route
route.get('/search/:maXa', siteControllers.search);
route.get('/', siteControllers.map);
module.exports = route