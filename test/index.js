var request = require('request')
var bamboo = require('../')

bamboo({}, function (err) {
  if (err) {
    console.error('err', err)
    return
  }

  request.get('http://example.com', function (err, res, body) {
    if (err) {
      console.error('err', err)
      return
    }

    console.log('got', body)
  })
})
