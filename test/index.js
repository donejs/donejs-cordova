var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;

describe('donejs-cordova', function() {
  before(function(done) {
    helpers.run(path.join(__dirname, '../default'))
      .withPrompts({
        name: 'Foo',
        id: 'com.bar.foo'
      }).on('end', done);
  });

  it('default generator', function() {
    assert.file(['build.js']);
    assert.fileContent('build.js', /id: "com.bar.foo"/);
    assert.fileContent('build.js', /name: "Foo"/);
  });
});