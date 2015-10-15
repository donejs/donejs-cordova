var assert = require('assert');
var lib = require('../lib');
var prompt = require('prompt');
var sinon = require('sinon');
var fs = require('fs');

describe('donejs-cordova', function() {
  it('default export', function(done) {
    var stub = sinon.stub(prompt, 'get');
    stub.callsArgWith(1, undefined, {
      name: 'Foo',
      id: 'com.bar.foo'
    });

    var out = lib.default();

    assert.ok(typeof out.then === 'function', 'default export returns a promise');

    out.then(function () {
      fs.exists('build.js', function(exists) {
        assert.ok(exists, 'build.js file is created');

        fs.readFile('build.js', 'utf8', function(err, data) {
          assert.ok(data.indexOf('id: "com.bar.foo"') > 0, 'should have correct id');
          assert.ok(data.indexOf('name: "Foo"') > 0, 'should have correct name');

          fs.unlink('build.js', function() {
            done();
          });
        });
      });
    });
  });
});