"use strict";

// Generated by CoffeeScript 2.5.1
(function () {
  var Result, processExtraProps, validateBuilder;
  Result = require('../result');
  validateBuilder = require('../validate');

  processExtraProps = function processExtraProps(result, fieldDesc, res) {
    var copyIfValid, ref, ref1, validator;
    validator = void 0;

    copyIfValid = function copyIfValid(prop) {
      if (fieldDesc.hasOwnProperty(prop)) {
        result.isError = false;
        result.context(function (path) {
          return Result.prop(prop)(path);
        }, function () {
          return (validator || (validator = validateBuilder(res)))(result, fieldDesc.init);
        });

        if (!result.isError) {
          return res[prop] = fieldDescres[prop];
        }
      }
    };

    if ((ref = fieldDesc.type) === 'string' || ref === 'text') {
      if (fieldDesc.hasOwnProperty('min')) {
        if (!(typeof fieldDesc.min === 'number' && Number.isInteger(fieldDesc.min) && fieldDesc.min > 0)) {
          result.error(function (path) {
            return Result.prop('min')(path);
          }, 'dsc.invalidValue', {
            value: fieldDesc.min
          });
        }

        if (!(fieldDesc.min <= res.length)) {
          result.error(function (path) {
            return Result.prop('min')(path);
          }, 'dsc.tooBig', {
            value: fieldDesc.min
          });
        } else {
          res.min = fieldDesc.min;
        }
      }

      if (fieldDesc.type === 'text') {
        if (fieldDesc.hasOwnProperty('max')) {
          if (!(typeof fieldDesc.max === 'number' && Number.isInteger(fieldDesc.max) && fieldDesc.max > 0)) {
            result.error(function (path) {
              return Result.prop('max')(path);
            }, 'dsc.invalidValue', {
              value: fieldDesc.max
            });
          }

          if (!(res.hasOwnProperty('min') && fieldDesc.max < res.min)) {
            result.error(function (path) {
              return Result.prop('max')(path);
            }, 'dsc.tooSmall', {
              value: fieldDesc.max
            });
          } else {
            res.max = fieldDesc.max;
          }
        }
      }
    } else if ((ref1 = fieldDesc.type) === 'integer' || ref1 === 'double' || ref1 === 'decimal') {
      result.isError = false;
      copyIfValid('min');
      copyIfValid('max');

      if (!result.isError && res.hasOwnProperty('min') && res.hasOwnProperty('max') && res.min > res.max) {
        result.error(function (path) {
          return Result.prop('max')(path);
        }, 'dsc.tooSmall', {
          value: fieldDesc.max
        });
      }
    }

    if (fieldDesc.hasOwnProperty('init')) {
      copyIfValid('init');
    }

    return res; // processExtraProps =
  }; // ----------------------------


  module.exports = processExtraProps;
}).call(void 0);