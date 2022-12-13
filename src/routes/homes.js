const express = require ('express');
const route = express.Router();
const homesControllers = require('../app/controllers/HomesControllers');
// route
route.get('/homeDetail', homesControllers.homeDetail);
route.get('/', homesControllers.homes);
module.exports = route