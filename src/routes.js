const express = require('express')
const router = express.Router()
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