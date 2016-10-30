
/**
 * Module dependencies.
 */

var parse = require('yields-unserialize');
var Emitter = require('component-emitter');
var events = require('component-events');
var store = require('yields-store');

/**
 * Expose `storage`
 */

module.exports = storage;

/**
 * Expose `proto`
 */

var proto = storage.proto = {};

/**
 * Create new storage with `prefix`.
 *
 * @param {String} prefix
 * @return {Function}
 * @api public
 */

function storage(prefix){
  function store(){ return store.apply(arguments); }
  for (var k in proto) store[k] = proto[k];
  store.prefix = prefix;
  store.initialize();
  Emitter(store);
  return store;
}

/**
 * Apply the given `args`.
 *
 * @param {Arguments} args
 * @api private
 */

proto.apply = function(args){
  if ('function' == typeof args[0]) return this.on('change', args[0]);
  if ('function' == typeof args[1]) return this.on(args[0], args[1]);
  if (0 == args.length) return this.all();
  if (2 == args.length) return this.set(args[0], args[1]);
  if (1 == args.length && null == args[0]) return this.clear();
  if (1 == args.length) return this.get(args[0]);
};

/**
 * Initialize
 *
 * @api private
 */

proto.initialize = function(){
  this.events = events(window, this);
  this.events.bind('storage');
};

/**
 * onstorage.
 *
 * @param {Event} e
 * @api private
 */

proto.onstorage = function(e){
  var len = this.prefix.length + 1;
  e = e || window.event;
  if (0 != e.key.indexOf(this.prefix + ':')) return;
  e.previous = parse(e.oldValue);
  e.current = parse(e.newValue);
  var key = e.key;
  delete e.key;
  e.key = key.substr(len);
  this.emit(e.key, e);
  this.emit('change', e);
};

/**
 * Set `key`, `value`.
 *
 * @param {String|Object} key
 * @param {Mixed} value
 * @return {Mixed}
 * @api private
 */

proto.set = function(key, value){
  if ('object' == typeof key) {
    for (var k in key) this.set(k, key[k]);
    return;
  }

  key = this.prefix + ':' + key;
  store(key, value);
};

/**
 * Get `key`.
 *
 * @parma {String} key
 * @return {Mixed}
 * @api private
 */

proto.get = function(key){
  key = this.prefix + ':' + key;
  return store(key);
};

/**
 * Clear all `prefix:`.
 *
 * @api private
 */

proto.clear = function(){
  var storage = window.localStorage;
  for (var i = 0; i < storage.length; ++i) {
    var key = storage.key(i);
    if (0 != key.indexOf(this.prefix + ':')) continue;
    storage.removeItem(key);
  }
};

/**
 * Get all `prefix:`.
 *
 * @api private
 */

proto.all = function(){
  var len = this.prefix.length + 1;
  var items = store();
  var ret = {};

  for (var k in items) {
    if (0 != k.indexOf(this.prefix + ':')) continue;
    ret[k.substr(len)] = items[k];
  }

  return ret;
};
