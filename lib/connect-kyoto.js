/*!
 * connect-kyoto.js
 * @fileoverview kyoto-tycoon session store for connect
 *
 * @author kazuya kawaguchi <kawakazu80@gmail.com>
 */


//
// import(s)
//
var KyotoTycoon = require('kyoto-tycoon').KyotoTycoon;
var Store = require('connect').session.Store;


//
// constant(s)
//
var REGEX_HOSTNAME = /^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/;
var REGEX_IPADDRESS = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
var ONE_DAY = 86400;


//
// class(es)
//

/**
 * Create a new KyotoStore.
 *
 * @class KyotoStore
 * @constructor
 * @param {Object} options
 * @api public
 */
function KyotoStore (options) {
  try {
    var options = options || {};
    // check port number
    if (options.port && (options.port < 0 || options.port > 65535)) {
      throw new Error('Invalid port option');
    }
    // check host name
    if (options.host && (!REGEX_HOSTNAME.test(options.host) | 
                         !REGEX_IPADDRESS.test(options.host))) {
      throw new Error('Invalid host option');
    }
    Store.call(this, options);
    this.kt = new KyotoTycoon(options);
  } catch (e) {
    throw e;
  }
}

KyotoStore.prototype.__proto__ = Store.prototype;

/**
 * Attempt to fetch session by the given `session_id`.
 *
 * @method get
 * @param {String} session_id
 * @param {Function} callback 
 * @api public
 */
KyotoStore.prototype.get = function (session_id, callback) {
  try {
    this.kt.get(session_id, function (err, data) {
      callback && callback(err, (err ? null : JSON.parse(data)));
    });
  } catch (e) {
    callback && callback(e);
  }
};

/**
 * Commit the given `session` object associated with the given `session_id`.
 *
 * @param {String} session_id
 * @param {Object} session
 * @param {Function} callback
 * @api public
 */
KyotoStore.prototype.set = function (session_id, session, callback) {
  try {
    // check session_id
    if (!session_id || session_id === '') {
      callback && callback(new Error('Invalid session_id'));
    }
    var max_age = session.cookie.maxAge || (session.cookie.maxAge = ONE_DAY)
    this.kt.set(session_id, JSON.stringify(session), {
      xt: max_age / 1000 | 0,
    }, function (err, data) {
      callback && callback(err);
    });
  } catch (e) {
    callback && callback(e);
  }
};

/**
 * Destroy the session associated with the given `session_id`.
 *
 * @param {String} session_id
 * @api public
 */
KyotoStore.prototype.destroy = function (session_id, callback) {
  throw new Error('Not Implemented');
};

/**
 * Fetch number of sessions.
 *
 * @param {Function} callback
 * @api public
 */
KyotoStore.prototype.length = function (callback) {
  throw new Error('Not Implemented');
};

/**
 * Clear all sessions.
 *
 * @param {Function} callback
 * @api public
 */
KyotoStore.prototype.clear = function (callback) {
  throw new Error('Not Implemented');
};


// exports

exports.KyotoStore = KyotoStore;

