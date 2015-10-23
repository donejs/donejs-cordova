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
      }, {
        name: 'wp8',
        checked: is.windows,
        disabled: !is.windows
      }, {
        name: 'windows',
        checked: is.windows,
        disabled: !is.windows
      }, {
        name: 'amazon-fireos'
      }, {
        name: 'blackberry10'
      }, {
        name: 'Firefox OS'
      }, {
        name: 'Ubuntu',
        checked: is.linux,
        disabled: !is.linux
      }, {
        name: 'tizen'
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
