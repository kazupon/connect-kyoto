/*!
 * connect-kyoto.js
 * @fileoverview kyoto-tycoon session store for connect
 *
 * @author kazuya kawaguchi <kawakazu80@gmail.com>
 */


// imports

var KyotoTycoon = require('kyoto-tycoon').KyotoTycoon;
var Store = require('connect').session.Store;


// classes

/**
 * Create a new KyotoStore.
 *
 * @class KyotoStore
 * @constructor
 * @param {Object} options
 * @api public
 */
function KyotoStore (options) {
  throw new Error('Not Implemented');
}

/**
 * Attempt to fetch session by the given `session_id`.
 *
 * @method get
 * @param {String} session_id
 * @param {Function} callback 
 * @api public
 */
KyotoStore.prototype.get = function (session_id, callback) {
  throw new Error('Not Implemented');
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
  throw new Error('Not Implemented');
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

