//
// imports
//
var vows = require('vows');
var assert = require('assert');
var events = require('events');
var child_process = require('child_process');
var KyotoStore = require('../lib/connect-kyoto').KyotoStore;


//
// commons
//
function run_ktserver(options, callback) {

  try {

    var options = options || {};
    var args = [];
    if (options.host) {
      args.push('-host');
      args.push(options.host);
    }
    if (options.port) {
      args.push('-port');
      args.push(options.port);
    }

    var ktserver = child_process.spawn('ktserver', args);
    if (!ktserver) {
      callback({
        message: 'failed create ktserver child process',
      });
      return;
    }

    ktserver.on('exit', function (code) {
      ktserver.stdin.end();
    });

    callback(null, ktserver);

  } catch (e) {
    callback(e);
  }
}


//
// tests
//

var suite = vows.describe('connect-kyoto tests');
suite.addBatch({
  'creating KyotoStore object': {
    topic: function () {
      return function (options) {
        var promise = new events.EventEmitter();
        process.nextTick(function () {
          var store;
          try {
            store = new KyotoStore(options);
            promise.emit('success', store);
          } catch (e) {
            promise.emit('success', e);
          } finally {
            //store && store.end();
          }
        });
        return promise;
      };
    },
    'with default options': {
      topic: function (parent) {
        return parent();
      },
      'should create a KyotoStore object': function (store) {
        assert.isNotNull(store);
        assert.isObject(store);
      },
    },
    'with specific port and host': {
      topic: function (parent) {
        return parent({
          port: 1979,
          host: 'localhost',
        });
      },
      'should create a KyotoStore object': function (store) {
        assert.isNotNull(store);
        assert.isObject(store);
      },
    },
    'with specific port : `65535`': {
      topic: function (parent) {
        return parent({
          port: 70000,
        });
      },
      'should create a KyotoStore object': function (store) {
        assert.isNotNull(store);
        assert.isObject(store);
      },
    },
    'with illegal port : `65536`': {
      topic: function (parent) {
        return parent({
          port: 65536,
        });
      },
      'should pass an Error object': function (err) {
        assert.isNotNull(err);
        assert.instanceOf(err, Error);
      },
    },
    'with illegal port : `-1`': {
      topic: function (parent) {
        return parent({
          port: -1,
        });
      },
      'should pass an Error object': function (err) {
        assert.isNotNull(err);
        assert.instanceOf(err, Error);
      },
    },
    'with specific host : `IP`': {
      topic: function (parent) {
        return parent({
          host: '127.0.0.1',
        });
      },
      'should create a KyotoStore object': function (store) {
        assert.isNotNull(store);
        assert.isObject(store);
      },
    },
    'with illegal host : `0`': {
      topic: function (parent) {
        return parent({
          host: '0'
        });
      },
      'should create a KyotoStore object': function (store) {
        assert.isNotNull(store);
        assert.isObject(store);
      },
    },
  },
}).addBatch({
  'set a session': {
    topic: function () {
      return function (options) {
        var promise = new events.EventEmitter();
        process.nextTick(function () {
          var store;
          try {
            store = new KyotoStore(options);
            store.set(options.session_id, options.session, function (err) {
              if (err) {
                promise.emit('success', err);
                //store.end();
              } else {
                store.get(options.session_id, function (err, session) {
                  promise.emit('success', session);
                  //store.end();
                });
              }
            });
          } catch (e) {
            promise.emit('success', e);
            //store && store.end();
          }
        });
        return promise;
      };
    },
    'with specific session_id -> `123`, session -> `{ cookie: { maxAge: 2000 }, name: "kazupon" }`': {
      topic: function (parent) {
        return parent({
          port: 1980,
          session_id: '123',
          session: {
            cookie: {
              maxAge: 2000,
            },
            name: 'kazupon',
          },
        });
      },
      'should get a session object': function (session) {
        assert.isNotNull(session);
        assert.deepEqual({
          cookie: {
            maxAge: 2000,
          },
          name: 'kazupon',
        }, session);
      },
    },
    'with illegal session_id -> `null`': {
      topic: function (parent) {
        return parent({
          port: 9999,
          session_id: null,
          session: {
            cookie: {
              maxAge: 2000,
            },
          },
        });
      },
      'should pass an error object': function (err) {
        assert.isNotNull(err);
        assert.instanceOf(err, Error);
      },
    },
    'with illegal session_id -> `""`': {
      topic: function (parent) {
        return parent({
          port: 9999,
          session_id: '',
          session: {
            cookie: {
              maxAge: 2000,
            },
          },
        });
      },
      'should pass an error object': function (err) {
        assert.isNotNull(err);
        assert.instanceOf(err, Error);
      },
    },
    'with illegal session -> `nothing`': {
      topic: function (parent) {
        return parent({
          port: 9999,
          session_id: '123',
        });
      },
      'should pass an error object': function (err) {
        assert.isNotNull(err);
        assert.instanceOf(err, Error);
      },
    },
    'with illegal session -> `null`': {
      topic: function (parent) {
        return parent({
          port: 9999,
          session_id: '123',
          session: null,
        });
      },
      'should pass an error object': function (err) {
        assert.isNotNull(err);
        assert.instanceOf(err, Error);
      },
    },
    'with illegal session -> `cookie nothing`': {
      topic: function (parent) {
        return parent({
          port: 9999,
          session_id: '123',
          session: {
          },
        });
      },
      'should pass an error object': function (err) {
        assert.isNotNull(err);
        assert.instanceOf(err, Error);
      },
    },
    'with illegal session -> `cookie null`': {
      topic: function (parent) {
        return parent({
          port: 9999,
          session_id: '123',
          session: {
            cookie: null,
          },
        });
      },
      'should pass an error object': function (err) {
        assert.isNotNull(err);
        assert.instanceOf(err, Error);
      },
    },
    'with specific session -> `cookie empty`': {
      topic: function (parent) {
        return parent({
          port: 1981,
          session_id: '123',
          session: {
            cookie: {
            },
          },
        });
      },
      'should get a session object': function (session) {
        assert.isNotNull(session);
        assert.equal(86400, session.cookie.maxAge);
      },
    },
  },
}).export(module);

