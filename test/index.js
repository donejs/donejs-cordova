var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;
var fs = require('fs-extra');

describe('donejs-cordova', function() {
  describe('when no build.js exists', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../default'))
        .withPrompts({
          name: 'Foo',
          id: 'com.bar.foo'
        }).on('end', done);
    });

    it('should write build.js', function() {
      assert.file(['build.js']);
      assert.fileContent('build.js', /id: "com\.bar\.foo"/);
      assert.fileContent('build.js', /name: "Foo"/);
    });
  });

  describe('when build.js was already created by generator-donejs', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../default'))
      .inTmpDir(function(dir) {
        var done = this.async();
        fs.copy(path.join(__dirname, 'templates/generator-donejs'), dir, done);
      })
      .withPrompts({
        name: 'Foo',
        id: 'com.bar.foo'
      }).on('end', done);
    });

    it('should add cordovaOptions to build.js', function() {
      assert.file(['build.js']);
      assert.fileContent('build.js', /generator-donejs build\.js/);
      assert.fileContent('build.js', /id: "com\.bar\.foo"/);
      assert.fileContent('build.js', /name: "Foo"/);
    });
  });

  describe('when build.js was already created by generator-donejs and updated by donejs-cordvoa', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../default'))
      .inTmpDir(function(dir) {
        var done = this.async();
        fs.copy(path.join(__dirname, 'templates/donejs-cordova'), dir, done);
      })
      .withPrompts({
        name: 'Foo',
        id: 'com.bar.foo'
      }).on('end', done);
    });

    it('should not overwrite build.js', function() {
      assert.file(['build.js']);
      assert.fileContent('build.js', /generator-donejs \+ donejs-cordova build\.js/);
      assert.fileContent('build.js', /id: "com\.bar\.foo\.existing"/);
      assert.fileContent('build.js', /name: "Existing Foo"/);
    });
  });
});