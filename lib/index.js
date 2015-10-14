var fs = require("fs");
var path = require("path");
var _ = require("lodash");

var id = "com.donejs.chat";
var name = "DoneJS chat";

fs.readFile(path.join(__dirname, 'template.js'), 'utf8', function (err, data) {
    if (err) {
        throw new Error('[donejs-cordova] Failed to add cordova ' + err);
    }

    var template = _.template(data);
    var buildOptions = template({
        id: id,
        name: name
    });

    fs.appendFile('build.js', buildOptions, 'utf8', function (err) {
        if (err) {
            throw new Error('[donejs-cordova] Failed to add cordova ' + err);
        }
        console.log('[donejs-cordova] Successfully added cordova');
    })
});
