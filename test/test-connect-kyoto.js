//
// import(s)
//
var vows = require('vows');
var assert = require('assert');
var events = require('events');
var KyotoStore = require('../lib/connect-kyoto').KyotoStore;


//
// test(s)
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
              } else {
                store.get(options.session_id, function (err, session) {
                  promise.emit('success', session);
                });
              }
            });
          } catch (e) {
            promise.emit('success', e);
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
}).addBatch({
  'get a session': {
    topic: function () {
      return function (options) {
        var promise = new events.EventEmitter();
        process.nextTick(function () {
          var store;
          try {
            store = new KyotoStore(options);
            store.set(options.set_session_id, options.session, function (err) {
              store.get(options.get_session_id, function (err, session) {
                promise.emit('success', (err ? err : session));
              });
            });
          } catch (e) {
            promise.emit('success', e);
          }
        });
        return promise;
      };
    },
    'with specific session_id -> `123`': {
      topic: function (parent) {
        return parent({
          port: 1982,
          set_session_id: '123',
          session: {
            cookie: {
              maxAge: 2000,
            },
            name: 'kazupon',
          },
          get_session_id: '123',
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
          set_session_id: '123',
          session: {
            cookie: {
              maxAge: 2000,
            },
          },
          get_session_id: null,
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
          set_session_id: '123',
          session: {
            cookie: {
              maxAge: 2000,
            },
          },
          get_session_id: "",
        });
      },
      'should pass an error object': function (err) {
        assert.isNotNull(err);
        assert.instanceOf(err, Error);
      },
    },
  },
}).addBatch({
  'destroy a session': {
    topic: function () { 
      return function (options) {
        var promise = new events.EventEmitter();
        process.nextTick(function () {
          var store;
          try {
            store = new KyotoStore(options);
            store.set(options.set_session_id, options.session, function (err) {
              store.destroy(options.destroy_session_id, function (err) {
                if (err) {
                  promise.emit('success', err);
                } else {
                  store.get(options.destroy_session_id, function (err, session) {
                    promise.emit('success', (err ? err : session));
                  });
                }
              });
            });
          } catch (e) {
            promise.emit('success', e);
          }
        });
        return promise;
      };
    },
    'with specific session_id -> `foo`': {
      topic: function (parent) {
        return parent({
          port: 1983,
          set_session_id: 'foo',
          session: {
            cookie: {
              maxAge: 2000,
            },
            name: 'kazupon',
          },
          destroy_session_id: 'foo',
        });
      },
      'should pass an error object': function (err) {
        assert.isNotNull(err);
        assert.isUndefined(err);
      },
    },
    'with illegal session_id -> `null`': {
      topic: function (parent) {
        return parent({
          port: 9999,
          set_session_id: '123',
          session: {
            cookie: {
              maxAge: 2000,
            },
          },
          destroy_session_id: null,
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
          set_session_id: '123',
          session: {
            cookie: {
              maxAge: 2000,
            },
          },
          destroy_session_id: "",
        });
      },
      'should pass an error object': function (err) {
        assert.isNotNull(err);
        assert.instanceOf(err, Error);
      },
    },
  },
}).addBatch({
  'store initilizing,': {
    topic: function () { 
      var promise = new events.EventEmitter();
      var store = new KyotoStore({
        port: 1984,
      });
      store.length(function (err, len) {
        promise.emit('success', {
          err: err,
          len: len,
          store: store,
        });
      });
      return promise;
    },
    'should be length `0`': function (val) {
      assert.equal(0, val.len);
    },
    'should not pass an error': function (val) {
      assert.isNull(val.err);
    },
    'set a session,': {
      topic: function (parent) {
        var promise = new events.EventEmitter();
        var store = parent.store;
        store.set('foo', {
          cookie: {
            maxAge: 2000,
          },
        }, function (err, data) {
          store.length(function (err, len) {
            promise.emit('success', {
              err: err,
              len: len,
              store: store,
            });
          });
        });
        return promise;
      },
      'should be length `1`': function (val) {
        assert.equal(1, val.len);
      },
      'should not pass an error': function (val) {
        assert.isNull(val.err);
      },
      'set a session,': {
        topic: function (parent) {
          var promise = new events.EventEmitter();
          var store = parent.store;
          store.set('bar', {
            cookie: {
              maxAge: 3600,
            },
          }, function (err, data) {
            store.length(function (err, len) {
              promise.emit('success', {
                err: err,
                len: len,
                store: store,
              });
            });
          });
          return promise;
        },
        'should be length `2`': function (val) {
          assert.equal(2, val.len);
        },
        'should not pass an error': function (val) {
          assert.isNull(val.err);
        },
        'destroy a session,': {
          topic: function (parent) {
            var promise = new events.EventEmitter();
            var store = parent.store;
            store.destroy('foo', function (err) {
              store.length(function (err, len) {
                promise.emit('success', {
                  err: err,
                  len: len,
                  store: store,
                });
              });
            });
            return promise;
          },
          'should be length `1`': function (val) {
            assert.equal(1, val.len);
          },
          'should not pass an error': function (val) {
            assert.isNull(val.err);
          },
        },
      },
    },
  },
}).addBatch({
  'clear sessions': {
    topic: function () {
      var promise = new events.EventEmitter();
      store = new KyotoStore({
        port: 1985,
      });
      var max = 100;
      var count = 0;
      var session = {
        cookie: {
          maxAge: 2000,
        },
      };
      for (var i = 0; i < max; i++) {
        store.set(i, session, function (err, data) {
          if (count === (max - 1)) {
            store.clear(function (err) {
              store.length(function (err, len) {
                promise.emit('success', len);
              });
            });
          }
          count++;
        });
      }
      return promise;
    },
    'should be length `0`': function (len) {
      assert.equal(0, len);
    },
  },
}).export(module);

