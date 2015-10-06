var Mitm = require('mitm')
var httpProxy = require('http-proxy')
var hidemyass = require('hidemyass')

module.exports = function (options, callback) {
  hidemyass
    .proxies()
    .get(gotProxies)

  function gotProxies (err, proxies) {
    if (err) {
      return callback(new Error('could not get proxies'))
    }

    callback()

    var proxiesUrls = []
    var proxiesDetails = proxies.map(function (prox) {
      proxiesUrls.push(prox.ip + ':' + prox.port)
      return { host: prox.ip, port: prox.port }
    })

    console.log('got proxies', proxiesDetails)

    var proxy = httpProxy.createProxyServer({
      target: proxiesDetails[0]
    })

    var mitm = Mitm()

    mitm.on('connect', function (socket, opts) {
      if (proxiesUrls.indexOf(opts.host + ':' + opts.port) === -1) {
        socket.bypass()
        return
      }
    })

    mitm.on('request', function (req, res) {
      proxy.web(req, res)
    })
  }
}
