var request = require('request')
var bumboo = require('../')
var async = require('async')

bumboo({}, function (err) {
  if (err) {
    console.error('err', err)
    return
  }

  async.times(30, function (i, cb) {
    request.get('http://example.com', function (err, res, body) {
      if (err) {
        console.error('err', err)
        return cb(err)
      }

      console.log('got response', res.statusCode)

      cb()
    })
  })
})
