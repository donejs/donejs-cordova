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
  writing: function () {
    this.fs.copyTpl(
      this.templatePath('build.js'),
      this.destinationPath('build.js'),
      {
        name: this.config.get('name'),
        id: this.config.get('id')
      }
    );
  }
});