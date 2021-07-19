"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// Generated by CoffeeScript 2.5.1
(function () {
  var _flat, flatTree;

  _flat = function flat(dst, src, prefix) {
    var k, v;

    for (k in src) {
      v = src[k];

      if (_typeof(v) === 'object' && v !== null) {
        _flat(dst, v, "".concat(prefix).concat(k, "."));
      } else {
        dst["".concat(prefix).concat(k)] = v; // flat =
      }
    }
  }; // ----------------------------


  flatTree = function flatTree(src) {
    var res;

    _flat(res = {}, src, '');

    return res; // flatTree:
  }; // ----------------------------


  module.exports = flatTree;
}).call(void 0);