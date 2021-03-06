"use strict";

// Generated by CoffeeScript 2.5.1
(function () {
  var Result, checkDocumentName, compileTags, copyExtra, processActions, processDocs, processFields, processRefers, processStates, sortedMap;
  Result = require('../result');

  var _require = require('../utils');

  checkDocumentName = _require.checkDocumentName;
  sortedMap = require('../sortedMap');
  compileTags = require('../tags/_compile');
  processFields = require('./_processFields');
  processActions = require('./_processActions');
  processStates = require('./_processStates');
  processRefers = require('./_processRefers');
  copyExtra = require('./_copyExtra');

  processDocs = function processDocs(result, config, noSystemItems) {
    if (!config.$$src.hasOwnProperty('docs')) {
      result.error('dsc.missingProp', {
        value: 'docs'
      });
      return;
    }

    return result.context(Result.prop('docs'), function () {
      // processDocs =
      var doc, res;
      res = sortedMap(result, config.$$src.docs, {
        checkName: function checkName(v) {
          if (!checkDocumentName(v)) {
            return false;
          }

          if (v.indexOf('.') === -1) {
            // rule: 'doc.' is a default namespace
            return "doc.".concat(v);
          }

          return true;
        }
      });

      if (!result.isError) {
        doc = void 0;
        result.context(function (path) {
          return Result.prop(doc.name)(path);
        }, function () {
          var i, len, ref;
          ref = res.$$list;

          for (i = 0, len = ref.length; i < len; i++) {
            doc = ref[i];
            result.isError = false;
            doc.fields = processFields(result, doc, config, 'fields', noSystemItems);
            doc.actions = processActions(result, doc, config, noSystemItems);

            if (!result.isError) {
              doc.states = processStates(result, doc, doc.fields, doc.actions); // result.context
            }
          }
        }); // rule: docs.$$list is sorted in alpabetical order of their names

        res.$$list.sort(function (left, right) {
          return left.name.localeCompare(right.name);
        });
        copyExtra(result, res);
        sortedMap.index(result, res, {
          mask: true
        });
        compileTags(result, res);

        if (result.isError) {
          return;
        }

        sortedMap.finish(result, res);

        if (result.isError) {
          return;
        }

        processRefers(result, res);

        if (!result.isError) {
          // processDocs = (result, config) ->
          config.docs = res;
        }
      }
    });
  }; // ----------------------------


  module.exports = processDocs;
}).call(void 0);