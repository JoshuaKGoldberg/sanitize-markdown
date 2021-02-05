'use strict';

var fs = require('fs');
var test = require('tape');
var sanitizeMarkdown = require('..');

function read (file) {
  return fs.readFileSync('./test/fixtures/' + file + '.html', 'utf8');
}

test('succeeds because of sensible defaults', function (t) {
  t.equal(sanitizeMarkdown(read('dirty')), read('dirty-expected'));
  t.end();
});

test('shouldn\'t take that long with (highlighted) async readme', function (t) {
  var start = Date.now();
  sanitizeMarkdown(read('async'));
  var diff = Date.now() - start;
  console.log('diff:', diff);
  t.ok(diff < 200);
  t.end();
});

test('shouldn\'t take that long with (highlighted) cheerio readme', function (t) {
  var start = Date.now();
  sanitizeMarkdown(read('cheerio'));
  var diff = Date.now() - start;
  console.log('diff:', diff);
  t.ok(diff < 200);
  t.end();
});

test('should match deep tag', function (t) {
  t.equal(sanitizeMarkdown(read('deep'), {
    allowedClasses: {
      section: ['md-attachments'],
      a: ['md-attachment', 'fa', 'fa-download'],
      span: ['md-attachment-annotation']
    },
    allowedAttributes: {
      a: ['href', 'target', 'title', 'download']
    }
  }), read('deep-expected'));
  t.end();
});

test('shouldn\'t cry about unclosed html', function (t) {
  t.equal(sanitizeMarkdown('<a href="eat"></a> <font size=100 hello world What would you'), '<a href="eat"></a> ');
  t.end();
});
