var request = require('request')
var bumboo = require('../')
var async = require('async')

function getProxies (cb) {
  var proxies = [
    { protocol: 'http', host: '218.189.26.20', port: 8080 },
    { protocol: 'http', host: '111.11.255.11', port: 80 },
    { protocol: 'http', host: '60.13.74.184', port: 81 },
    { protocol: 'http', host: '117.135.241.93', port: 80 }
  ]

  process.nextTick(function () {
    cb(null, proxies)
  })
}

var options = {
  getProxies: getProxies
}

bumboo(options, function (err) {
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
