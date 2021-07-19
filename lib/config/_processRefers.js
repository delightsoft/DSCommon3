"use strict";

// Generated by CoffeeScript 2.5.1
(function () {
  var Result, processRefers;
  Result = require('../result');

  processRefers = function processRefers(result, docs) {
    var _processFields2, _processRef, _processRefsArray, doc;

    _processRef = function _processRef(doc, ref) {
      var refers;
      refers = ref.indexOf('.') !== -1 ? ref : doc.name.substr(0, doc.name.lastIndexOf('.') + 1) + ref;

      if (!docs.hasOwnProperty(refers)) {
        result.error('dsc.unknownDocument', {
          value: refers
        });
        return;
      }

      return docs[refers];
    };

    _processRefsArray = function _processRefsArray(doc, field, refList) {
      var i, isAll, res;
      isAll = false;
      res = [];
      i = void 0;
      result.context(function (path) {
        return Result.index(i, Result.prop('refers'))(path);
      }, function () {
        var j, len, ref, results, v;
        results = [];

        for (i = j = 0, len = refList.length; j < len; i = ++j) {
          ref = refList[i];
          ref = ref.trim();
          result.isError = false;

          if (ref === '#all') {
            results.push(isAll = true);
          } else {
            v = _processRef(doc, ref);

            if (!(result.isError || res.indexOf(v) >= 0)) {
              results.push(res.push(v));
            } else {
              results.push(void 0);
            }
          }
        }

        return results;
      });
      field.refers = isAll ? [] : (res.sort(), res); // _processRefsArray
    };

    _processFields2 = function _processFields(doc, docOrField) {
      var field;
      field = void 0;
      result.context(function (path) {
        return Result.prop(field.name, Result.prop('fields'))(path);
      }, function () {
        var j, len, ref1, results;
        ref1 = docOrField.fields.$$list;
        results = [];

        for (j = 0, len = ref1.length; j < len; j++) {
          field = ref1[j];

          if (field.type === 'refers') {
            if (Array.isArray(field.refers)) {
              results.push(_processRefsArray(doc, field, field.refers));
            } else {
              results.push(_processRefsArray(doc, field, field.refers.split(',')));
            }
          } else if (field.hasOwnProperty('fields')) {
            results.push(_processFields2(doc, field));
          } else {
            results.push(void 0);
          }
        }

        return results;
      });
    };

    doc = void 0;
    result.context(function (path) {
      return Result.prop(doc.name, Result.prop('docs'))(path);
    }, function () {
      // processRefers =
      var j, len, ref1;
      ref1 = docs.$$list; // result.context

      for (j = 0, len = ref1.length; j < len; j++) {
        doc = ref1[j];

        _processFields2(doc, doc);
      }
    });
  }; // ----------------------------


  module.exports = processRefers;
}).call(void 0);