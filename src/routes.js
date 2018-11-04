const express = require('express')
const router = express.Router()
const request = require('request');
var garmin = require('./garmin');

router.post('/content', (req, res) => {
    garmin.activities(res, req.body);
})

router.get('/', (req, res) => {
  res.render('import', {
    data: {},
  })
})

router.post('/', (req, res) => {
  res.render('import', {
    data: req.body, // { message, email }
  })
})

module.exports = router