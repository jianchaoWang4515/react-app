const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        proxy('/api', {
            target: 'http://10.186.177.21:8007/',
            pathRewrite: {
                "^/api": ""
            }
        }
    ))
  }
