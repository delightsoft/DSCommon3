"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// Generated by CoffeeScript 2.5.1
(function () {
  var _argError, invalidArg, isResult, prettyPrint;

  prettyPrint = require('./_prettyPrint');

  _argError = function _argError(reason, name, value) {
    return new Error("".concat(reason, " '").concat(name, "': ").concat(prettyPrint(value)));
  }; // ----------------------------


  module.exports = {
    notEnoughArgs: function notEnoughArgs() {
      throw new Error("Not enough arguments");
    },
    tooManyArgs: function tooManyArgs() {
      throw new Error("Too many arguments");
    },
    invalidArg: invalidArg = function invalidArg(name, value) {
      throw _argError('Invalid argument', name, value);
    },
    unknownOption: function unknownOption(name) {
      throw new Error("Unknown option: '".concat(name, "'"));
    },
    missingRequiredOption: function missingRequiredOption(name) {
      throw new Error("Missing required option: '".concat(name, "'"));
    },
    invalidOption: function invalidOption(name, value) {
      throw _argError('Invalid option', name, value);
    },
    invalidProp: function invalidProp(name) {
      throw new Error("Invalid property ".concat(name));
    },
    invalidPropValue: function invalidPropValue(name, value) {
      throw _argError('Invalid value of propery', name, value);
    },
    reservedPropName: function reservedPropName(name, value) {
      throw _argError('Reserved prop is used', name, value);
    },
    _argError: _argError,
    // Прим.: С instanceof Result возникают проблемы в спецификациях, так как они регулярно сбрасывают require.cache.
    // Так что надо определять result по другим признакам
    // Как result, считаются объекты не только типа Result, но Report
    isResult: isResult = function isResult(result) {
      return _typeof(result) === 'object' && result !== null && result.hasOwnProperty('isError'); // isResult =
    },
    checkResult: function checkResult(result) {
      if (!isResult(result)) {
        return invalidArg('result', result);
      }
    }
  };
}).call(void 0);