var prompt = require('prompt');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var optionsSchema = {
    properties: {
        name: {
            description: 'Name of project for Cordova:'
        },
        id: {
            description: 'id of project for Cordova:'
        }
    }
};

prompt.message = '';
prompt.delimiter = '';
prompt.start();

prompt.get(optionsSchema, function (err, result) {
    var id = result.id;
    var name = result.name;

    fs.readFile(path.join(__dirname, 'template.js'), 'utf8', function (err, data) {
        if (err) {
            throw new Error('Failed to add cordova ' + err);
        }

        var template = _.template(data);
        var buildOptions = template({
            id: id,
            name: name
        });

        fs.appendFile('build.js', buildOptions, 'utf8', function (err) {
            if (err) {
                throw new Error('Failed to add cordova ' + err);
            }
            console.log('Successfully added cordova');
        })
    });
});
