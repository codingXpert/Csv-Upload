const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home_controller');

router.get('/',homeController.home);    //route for homepage

router.use('/file',require('./file'));  //route for all other routes related to files

module.exports = router;