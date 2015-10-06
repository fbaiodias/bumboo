var Mitm = require('mitm')
var httpProxy = require('http-proxy')

var mitm = Mitm()

// test proxy
var proxyDetails = {
  port: 80,
  host: '198.169.246.30'
}

var proxy = httpProxy.createProxyServer({
  target: proxyDetails
})

mitm.on('connect', function (socket, opts) {
  if (opts.host === proxyDetails.host) {
    socket.bypass()
    return
  }
})

mitm.on('request', function (req, res) {
  proxy.web(req, res)
})
