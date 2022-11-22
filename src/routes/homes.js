const express = require ('express');
const route = express.Router();
const homesControllers = require('../app/controllers/HomesControllers');
// route
route.use('/homeDetail', homesControllers.homeDetail);
route.use('/', homesControllers.homes);
module.exports = route