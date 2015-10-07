bumboo
===

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

Makes your http requests go through random proxies. Arr!

This is an hack, done just for the fun.


## install

```
npm install bumboo
```

## usage

```javascript
var request = require('request')
var bumboo = require('bumboo')

bumboo({}, function (err) {
  if (err) {
    console.error('err', err)
    return
  }

  request.get('http://example.com', function (err, res, body) {
    if (err) {
      console.error('err', err)
      return
    }

    console.log('got response', res.statusCode)
  })
})
```
