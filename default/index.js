var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var generator = require('yeoman-generator');

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
  end: function() {
    var done = this.async();
    var self = this;
  
      fs.readFile(path.join(__dirname, 'template.js'), 'utf8', function (err, data) {
          if (err) {
            done();
          }

          var template = _.template(data);
          var buildOptions = template({
            name: self.config.get('name'),
            id: self.config.get('id')
          });

          fs.appendFile('build.js', buildOptions, 'utf8', function (err) {
              if (err) {
                  done();
              }
              done();
          });
    });
  }
});