"use strict";

// Generated by CoffeeScript 2.5.1
(function () {
  var _add, index, invalidArg, notEnoughArgs, tooManyArgs;

  var _require = require('../utils');

  var _require$err = _require.err;
  invalidArg = _require$err.invalidArg;
  notEnoughArgs = _require$err.notEnoughArgs;
  tooManyArgs = _require$err.tooManyArgs;

  _add = function _add(index, path) {
    if (!(arguments.length > 0)) {
      notEnoughArgs();
    }

    if (typeof path !== 'string') {
      invalidArg('path', name);
    }

    if (!(arguments.length <= 2)) {
      tooManyArgs();
    }

    path += "[".concat(index, "]");
    return path; // _add =
  };

  index = function index(_index, pathFunc) {
    if (!(arguments.length > 0)) {
      notEnoughArgs();
    }

    if (typeof _index !== 'number') {
      invalidArg('index', _index);
    }

    if (!(arguments.length <= 2)) {
      tooManyArgs();
    }

    if (arguments.length === 1) {
      return function (path) {
        return _add(_index, path);
      };
    }

    if (typeof pathFunc === 'function') {
      return function (path) {
        return _add(_index, pathFunc(path));
      };
    }

    invalidArg('pathFunc', pathFunc); // index =
  }; // ----------------------------


  module.exports = index;
}).call(void 0);