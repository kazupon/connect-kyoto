/**
 * example.js
 * @fileoverview sample
 */

var connect = require('connect');
var KyotoStore = require('./lib/connect-kyoto').KyotoStore;

var port = 3002;

try {
  connect(
    connect.cookieParser(),
    connect.session({
      secret: 'yatsuhashi',
      cookie: {
        maxAge: 10 * 1000,
      },
      store: new KyotoStore(),
    }),
    function (req, res, next) {
      var session = req.session;
      if (session.views) {
        session.views++;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end('<p>views: ' + session.views + '</p>');
      } else {
        session.views = 1;
        res.end('京都へようこそ、おいでやす〜。更新お願いしやす〜。');
      }
    }
  ).listen(port);
  console.log('port : ' + port + ' connect-kyoto example');
} catch (e) {
  console.error(e.message);
}
