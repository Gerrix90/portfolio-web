'use strict'
let path = require('path')

module.exports = (req, res) => {
  console.error('No resource matches: ' + req.url)
  res.sendFile(path.resolve(__dirname, '../../app/404.html'))
}
