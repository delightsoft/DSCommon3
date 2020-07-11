"use strict";

// Generated by CoffeeScript 2.5.1
(function () {
  // - namespace'ы начинаются с маленьких букв и содержит буквы и цифры
  var checkTagsNamespace;

  checkTagsNamespace = function checkTagsNamespace(value) {
    return typeof value === 'string' && /^tags[._][a-z][a-zA-Z0-9]*$/.test(value);
  }; // ----------------------------


  module.exports = checkTagsNamespace;
}).call(void 0);