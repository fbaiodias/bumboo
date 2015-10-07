var Mitm = require('mitm')
var httpProxy = require('http-proxy')
var hidemyass = require('hidemyass')
var sample = require('lodash.sample')

function defaultGetProxies (callback) {
  hidemyass
    .proxies()
    .get(gotProxies)

  function gotProxies (err, proxies) {
    if (err) {
      return callback(new Error('could not get proxies'))
    }

    var proxiesDetails = proxies
      .filter(function (prox) {
        return ['http', 'https'].indexOf(prox.protocol) !== -1 // prox.connection_time < 100
      })
      .map(function (prox) {
        return { protocol: prox.protocol, host: prox.ip, port: prox.port }
      })

    callback(null, proxiesDetails)
  }
}

module.exports = function (options, callback) {
  var getProxies = options.getProxies || defaultGetProxies

  getProxies(gotProxies)

  function gotProxies (err, proxies) {
    if (err) {
      return callback(new Error('could not get proxies'))
    }

    callback()

    console.log('got', proxies.length, 'proxies')

    var proxyHosts = proxies.map(function (prox) {
      return prox.host
    })

    var proxy = httpProxy.createProxyServer()

    proxy.on('error', function (err, req, res) {
      console.log('proxy error', err)

      res.writeHead(598, {
        'Content-Type': 'text/plain'
      })

      res.end('Error on proxy')
    })

    var mitm = Mitm()

    mitm.on('connect', function (socket, opts) {
      if (proxyHosts.indexOf(opts.host) !== -1) {
        console.log('bypassing', opts.host + ':' + opts.port)
        socket.bypass()
        return
      }

      console.log('proxying connnect to', opts.host + ':' + opts.port)
    })

    mitm.on('request', function (req, res) {
      var random = sample(proxies)

      var target = random.protocol + '://' + random.host + ':' + random.port

      console.log('proxying request to target', target)

      proxy.web(req, res, { target: target })
    })
  }
}
