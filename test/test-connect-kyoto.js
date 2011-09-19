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
      console.error('ktserver exit code : ' + code);
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
          run_ktserver(options, function (err, ktserver) {
            try {
              var store = new KyotoStore(options);
              promise.emit('success', store);
            } catch (e) {
              promise.emit('success', e);
            } finally {
              ktserver.stdin.end();
              ktserver.kill();
            }
          });
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
}).export(module);

