var request = require('request')
require('../')

request.get('http://example.com', function (err, res, body) {
  if (err) {
    console.error('err', err)
    return
  }

  console.log('got', body)
})
