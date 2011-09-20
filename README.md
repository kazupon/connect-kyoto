# connect-kyoto
      
connect-kyoto is a kyoto-tycoon session store.


# Requirements

- [kyoto-cabinet](http://fallabs.com/kyotocabinet/) >= 1.2.63
- [kyoto-tycoon](http://fallabs.com/kyototycoon/) >= 0.9.45


# Installation

    $ npm install connect-kyoto


# Options

- `port` : kyoto-tycoon port number
- `host` : kyoto-tycoon hostname


# Usage

## connect

    var KyotoStore = require('connect-kyoto').KyotoStore;
    ...
    connect(
      ...
      connect.cookieParser(),
      connect.session({
        secret: 'youre secret here',
        cookie: {
          maxAge: 7 * 24 * 60 * 60 * 1000 // one week
        },
        store: new KyotoStore(),
      }),
      ...
    ).listen(3001);

## express

    var KyotoStore = require('connect-kyoto').KyotoStore;
    ...
    app.configure(function(){
      ...
      app.use(express.cookieParser());
      app.use(express.session({
        secret: 'your secret here',
        store: new KyotoStore(),
        cookie: {
          maxAge: 7 * 24 * 60 * 60 * 1000 // one week
        },
      }));
      ...
    });

# Running Tests

connect-kyoto depends on [Vows](http://vowsjs.org/) for testing.

1. Invoke kyoto-tycoon database server by ktserver_invoker.js

    $ node ktserver_invoker.js

2. Run the tests.

    $ vows test/*.js


# License

[MIT license](http://www.opensource.org/licenses/mit-license.php).


# TODO

* feature : `db` option
* refactoring : unit test kyoto-tycoon mock server.

