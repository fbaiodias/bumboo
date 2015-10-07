var Mitm = require('mitm')
var httpProxy = require('http-proxy')
var hidemyass = require('hidemyass')
var sample = require('lodash.sample')

function getProxies (callback) {
  hidemyass
    .proxies()
    .get(gotProxies)

  function gotProxies (err, proxies) {
    if (err) {
      return callback(new Error('could not get proxies'))
    }

    var proxiesDetails = proxies.map(function (prox) {
      return { host: prox.ip, port: prox.port }
    })

    callback(null, proxiesDetails)
  }
}

module.exports = function (options, callback) {
  getProxies(gotProxies)

  function gotProxies (err, _proxiesDetails) {
    if (err) {
      return callback(new Error('could not get proxies'))
    }

    callback()

    var proxyDetails = sample(_proxiesDetails)

    console.log('got proxy', proxyDetails)

    var proxy = httpProxy.createProxyServer({
      target: proxyDetails
    })

    var mitm = Mitm()

    mitm.on('connect', function (socket, opts) {
      if (opts.host === proxyDetails.host) {
        console.log('bypassing', opts.host + ':' + opts.port)
        socket.bypass()
        return
      }
    })

    mitm.on('request', function (req, res) {
      proxy.web(req, res)
    })
  }
}
