var fs = require('fs');
var os = require('os');
var generator = require('yeoman-generator');
var ejs = require('ejs');
var is = {
  macos: os.platform() === 'darwin',
  linux: os.platform() === 'linux',
  windows: os.platform() === 'win32'
};

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
      default: 'com.donejs.' + this.appname.replace(/[\. ,:-]+/g, "")
    }, {
      type: 'checkbox',
      name: 'platforms',
      message: 'What platforms would you like to support (needs SDK installed)',
      choices: [{
        name: 'ios',
        checked: is.macos,
        disabled: !is.macos
      }, {
        name: 'android'
      }]
    }], function (answers) {
      this.config.set('name', answers.name);
      this.config.set('id', answers.id);
      this.config.set('platforms', answers.platforms);
      done();
    }.bind(this));
  },
  installingStealCordova: function() {
    this.npmInstall(['steal-cordova'], { 'saveDev': true });
  },
  writing: function () {
    var done = this.async();
    var outputBuildjs = this.destinationPath('build.js');

    var context = {
      name: this.config.get('name'),
      id: this.config.get('id'),
      platforms: this.config.get('platforms')
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
        var commentStartText = this.fs.read(this.templatePath('commentStart.ejs'), 'utf8'),
            commentEndText = this.fs.read(this.templatePath('commentEnd.ejs'), 'utf8'),
            cordovaOptionsText = this.fs.read(this.templatePath('cordovaOptions.ejs'), 'utf8'),
            commentStartIndex = data.indexOf(commentStartText),
            commentEndIndex = data.indexOf(commentEndText),
            newContent;

        if (commentStartIndex < 0 && commentEndIndex < 0) {
          // add nwOptions
          newContent = data +
            ejs.render(commentStartText, context) +
            ejs.render(cordovaOptionsText, context) +
            ejs.render(commentEndText, context);
        } else {
          // replace existing nwOptions
          newContent = data.substring(data, commentStartIndex) +
            ejs.render(commentStartText, context) +
            ejs.render(cordovaOptionsText, context) +
            ejs.render(commentEndText, context) +
            data.substring(commentEndIndex + commentEndText.length);
        }

        fs.writeFile(outputBuildjs, newContent, done);
      }.bind(this));
    }
  }
});
