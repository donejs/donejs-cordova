var assert = require('assert');
var prompt = require('prompt');
var sinon = require('sinon');
var fs = require('fs');
var path = require('path');
var yeoman = require('yeoman-environment');

describe('donejs-cordova', function() {
  it('default generator', function(done) {
    var stub = sinon.stub(prompt, 'get');
    stub.callsArgWith(1, undefined, {
      name: 'Foo',
      id: 'com.bar.foo'
    });

    require('../lib/index');
    var env = yeoman.createEnv();
    var fullName = path.join(process.cwd(), 'default');

    env.register(require.resolve(fullName), 'default');

    assert.ok(true);
    env.run('default', function() {
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