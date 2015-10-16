var generator = require('yeoman-generator');
var ejs = require('ejs');
var fs = require('fs');

module.exports = generator.Base.extend({
  prompting: function () {
    var done = this.async();
    this.prompt([{
      type    : 'input',
      name    : 'name',
      message : 'Name of project for Cordova',
      default : this.appname // Default to current folder name
    }, {
      type    : 'input',
      name    : 'id',
      message : 'ID of project for Cordova',
    }], function (answers) {
      this.config.set('name', answers.name);
      this.config.set('id', answers.id);
      done();
    }.bind(this));
  },
  writing: function () {
    var done = this.async();
    var outputBuildjs = this.destinationPath('build.js');

    var context = {
      name: this.config.get('name'),
      id: this.config.get('id')
    };

    if (!this.fs.exists(outputBuildjs)) {
      this.fs.copyTpl(
        this.templatePath('build.ejs'),
        outputBuildjs,
        context
      );
      done();
    } else {
      fs.readFile(outputBuildjs, 'utf8', function(err, data) {
        if (data.indexOf('cordovaOptions') < 0) {
            var cordovaOptionsText = this.fs.read(this.templatePath('cordovaOptions.ejs'), 'utf8');
            var newContent = data + ejs.render(cordovaOptionsText, context);
            fs.writeFile(outputBuildjs, newContent, done);
        } else {
          done();
        }
      }.bind(this));
    }
  }
});